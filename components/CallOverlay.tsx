"use client";

import { contactMessageHistory, fetchPeerId, storePeerId } from "@/hooks/messages";
import React, { useEffect } from "react";
import { Phone, Video, Mic, PhoneOff, VideoOff, MicOff } from "lucide-react";
import Peer from "peerjs";
import { getProfileById } from "@/hooks/profile";
import { usePeerContext } from "@/context/CallProvider";

export default function CallOverlay() {
    const {
        selectedContact,
        loggedInUser,
        setMessages,
        conversationId,
        isCaller,
        caller,
        setCaller,
        callState,
        setCallState,
        callDuration,
        isMuted,
        isVideoOff,
        setPeer,
        setRecipientPeerId,
        setMyPeerId,
        callerId,
        setCallerId,

        localVideoRef,
        remoteVideoRef,
        callTimerRef,
        localStreamRef,
        incomingCallRef,
        dialToneRef,
        ringToneRef,

        formatCallDuration,
        stopCallTimer,
        acceptCall,
        declineCall,
        endCall,
        toggleMute,
        toggleVideo,
        sendMissedCall,
    } = usePeerContext();

    useEffect(() => {
        if (!loggedInUser) return;

        const dateSuffix = new Date().toISOString().replace(/[:.]/g, "-");
        const newPeer = new Peer(`${loggedInUser.id}-${dateSuffix}`);

        newPeer.on("open", async (id) => {
            try {
                setMyPeerId(id);
                await storePeerId(id);
            } catch (err) {
                console.error("Failed to send peer ID:", err);
            }
        });

        newPeer.on("call", (call) => {
            const { callerId: metadataCallerId } = call.metadata || {};
            incomingCallRef.current = call;
            setCallerId(metadataCallerId || call.peer.split("-")[0]);
            setCallState("ringing");

            call.on("close", () => {
                setCallState("ended");
                stopCallTimer();
                endCall(true);
            });

            call.on("error", (err) => {
                console.error("Call error:", err);
                setCallState("unavailable");
                stopCallTimer();
                endCall(true);
            });

            if (ringToneRef.current) {
                ringToneRef.current.play().catch((err: unknown) => {
                    console.error("Failed to play ringtone:", err);
                });
            }
        });

        setPeer(newPeer);

        newPeer.on("disconnected", () => {
            setCallState("disconnected");
            newPeer.reconnect();
        });

        newPeer.on("error", (err) => {
            console.error("Peer error:", err);
            sendMissedCall();
            setCallState("unavailable");
        });

        return () => {
            newPeer.destroy();
        };
    }, [loggedInUser, setMyPeerId, setCallerId, setCallState, stopCallTimer, endCall, ringToneRef, setPeer, sendMissedCall, incomingCallRef]);

    useEffect(() => {
        dialToneRef.current = new Audio("/sounds/dialtone.wav");
        dialToneRef.current.loop = true;

        ringToneRef.current = new Audio("/sounds/ringtone.wav");
        ringToneRef.current.loop = true;
    }, [dialToneRef, ringToneRef]);

    useEffect(() => {
        if (!callerId && callState !== "audio-calling" && callState !== "video-calling") return;
        const ringTone = ringToneRef.current;
        const unlock = () => {
            if (ringTone) {
                ringTone.muted = true;
                ringTone
                    .play()
                    .then(() => {
                        ringTone.pause();
                        ringTone.currentTime = 0;
                        ringTone.muted = false;
                        document.removeEventListener("click", unlock);
                    })
                    .catch((err: unknown) => console.warn("Unlock failed:", err));
            }
        };

        document.addEventListener("click", unlock);
        return () => document.removeEventListener("click", unlock);
    }, [callerId, callState, ringToneRef]);

    useEffect(() => {
        if (callState !== "audio-connected" && callState !== "video-connected") return;

        const timeout = setTimeout(() => {
            const localTracks = localStreamRef.current?.getTracks() || [];
            const localHasMedia = localTracks.some((t: MediaStreamTrack) => t.readyState === "live" && (t.kind === "audio" || t.kind === "video"));

            let remoteHasMedia = false;
            if (remoteVideoRef.current && remoteVideoRef.current.srcObject instanceof MediaStream) {
                const remoteTracks = (remoteVideoRef.current.srcObject as MediaStream).getTracks();
                remoteHasMedia = remoteTracks.some((t) => t.readyState === "live" && (t.kind === "audio" || t.kind === "video"));
            }

            if (!localHasMedia || !remoteHasMedia) {
                setCallState("connecting");
                setTimeout(() => {
                    if (callState === "connecting") {
                        setCallState("ended");
                        endCall(true);
                    }
                }, 10000);
            }
        }, 10000);

        return () => clearTimeout(timeout);
    }, [callState, localStreamRef, remoteVideoRef, setCallState, endCall]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (callState === "audio-calling" || callState === "video-calling" || callState === "ringing") {
            timeout = setTimeout(() => {
                setCallState("no-answer");
                if (isCaller) sendMissedCall();
                endCall();
            }, 60000);
        }
        return () => clearTimeout(timeout);
    }, [callState, isCaller, sendMissedCall, endCall, setCallState]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (callState === "ended" || callState === "unavailable" || callState === "disconnected") {
            timeout = setTimeout(() => {
                setCallState("idle");
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [callState, setCallState]);

    useEffect(() => {
        if (!callerId) return;
        const getCallerInfo = async () => {
            try {
                const response = await getProfileById(callerId.split("-")[0]);
                setCaller(response);
            } catch (error) {
                console.log(error);
                endCall(true);
            }
        };
        getCallerInfo();
    }, [callerId, setCaller, endCall]);

    useEffect(() => {
        const dialTone = dialToneRef.current;
        const ringTone = ringToneRef.current;
        if ((callState === "audio-calling" || callState === "video-calling") && isCaller) {
            dialTone?.play().catch(() => { });
        } else {
            dialTone?.pause();
            if (dialTone) dialTone.currentTime = 0;
        }

        if (callState === "ringing" && !isCaller) {
            ringTone?.play().catch(() => { });
        } else {
            ringTone?.pause();
            if (ringTone) ringTone.currentTime = 0;
        }

        if (callState === "ended" || callState === "idle" || callState === "no-answer") {
            dialTone?.pause();
            ringTone?.pause();
        }
    }, [callState, isCaller, dialToneRef, ringToneRef]);

    useEffect(() => {
        if (!conversationId) return;
        const fetchUpdatedConversation = async () => {
            try {
                const messageHistory = await contactMessageHistory(conversationId);
                setMessages(messageHistory);
                const getPeerIdResponse = await fetchPeerId(selectedContact?._id);
                setRecipientPeerId(getPeerIdResponse?.peerId);
            } catch (error: unknown) {
                console.error(error);
            }
        };
        fetchUpdatedConversation();
        const interval = setInterval(fetchUpdatedConversation, 5000);
        return () => clearInterval(interval);
    }, [conversationId, selectedContact?._id, setMessages, setRecipientPeerId]);

    useEffect(() => {
        const timer = callTimerRef.current;
        const stream = localStreamRef.current;
        return () => {
            if (timer) clearInterval(timer);
            if (stream) {
                stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
            }
        };
    }, [callTimerRef, localStreamRef]);

    if (callState === "idle") return null;

    const displayUser = isCaller ? selectedContact : caller;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center text-white">
            <div className="text-center mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayUser?.avatar || "/images/Blank_Profile.jpg"} alt={displayUser?.firstname} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-white/20" />
                <h3 className="text-2xl font-semibold">
                    {displayUser?.firstname} {displayUser?.lastname}
                </h3>
                <p className="text-lg opacity-80 mt-2">
                    {callState === "ringing" && "Incoming call…"}
                    {callState === "audio-calling" && "Calling..."}
                    {callState === "video-calling" && "Calling..."}
                    {callState === "audio-connected" && `In call • ${formatCallDuration(callDuration)}`}
                    {callState === "video-connected" && `In call • ${formatCallDuration(callDuration)}`}
                    {callState === "no-answer" && "No Answer"}
                    {callState === "ended" && "Call Ended"}
                    {callState === "unavailable" && "Unavailable"}
                </p>
            </div>

            <div className={`relative w-full max-w-md aspect-video mb-8 overflow-hidden rounded-xl bg-gray-900 shadow-2xl ${callState.includes('video') ? 'block' : 'hidden'}`}>
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <video ref={localVideoRef} autoPlay muted playsInline className="absolute bottom-4 right-4 w-32 aspect-video object-cover rounded-lg border-2 border-white/30 shadow-lg" />
            </div>

            <div className="flex items-center gap-6 mt-4">
                {callState === "ringing" ? (
                    <>
                        <button onClick={acceptCall} className="p-5 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-transform active:scale-95">
                            <Phone className="w-8 h-8" />
                        </button>
                        <button onClick={declineCall} className="p-5 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-transform active:scale-95">
                            <PhoneOff className="w-8 h-8" />
                        </button>
                    </>
                ) : callState === "no-answer" || callState === "ended" || callState === "unavailable" ? (
                    <button
                        onClick={() => setCallState("idle")}
                        className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-medium"
                    >
                        Dismiss
                    </button>
                ) : (
                    <>
                        <button onClick={toggleMute} className={`p-4 rounded-full ${isMuted ? "bg-red-500" : "bg-white/10 hover:bg-white/20"} transition-colors`}>
                            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        {(callState.includes('video')) && (
                            <button onClick={toggleVideo} className={`p-4 rounded-full ${isVideoOff ? "bg-red-500" : "bg-white/10 hover:bg-white/20"} transition-colors`}>
                                {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                            </button>
                        )}
                        <button onClick={() => endCall()} className="p-4 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-colors active:scale-95">
                            <PhoneOff className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
