"use client";

import { sendMessage, storePeerId } from "@/hooks/messages";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import CallOverlay from "@/components/CallOverlay";

interface Contact {
    email: string;
    firstname: string;
    lastname: string;
    id?: number;
    name?: string;
    role?: string;
    _id?: string;
    lastMessage?: string;
    timestamp?: string;
    unread?: number;
    avatar?: string;
    isOnline?: boolean;
    isGroup?: boolean;
    status: string;
}

type CallState =
    | "idle"
    | "audio-calling"
    | "video-calling"
    | "ringing"
    | "audio-connected"
    | "video-connected"
    | "ended"
    | "unavailable"
    | "disconnected"
    | "no-answer"
    | "connecting";

const PeerContext = createContext<any | undefined>(undefined);

export const PeerProvider = ({ children, loggedInUser }: { children: React.ReactNode; loggedInUser: any }) => {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [sending, setSending] = useState(false);
    const [messages, setMessages] = useState<any>(null);
    const [conversationId, setConversationId] = useState("");
    const [isCaller, setIsCaller] = useState(false);
    const [caller, setCaller] = useState<any>(null);

    const [callState, setCallState] = useState<CallState>("idle");
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [peer, setPeer] = useState<Peer | null>(null);
    const [recipientPeerId, setRecipientPeerId] = useState<string | null>(null);
    const [myPeerId, setMyPeerId] = useState<string | null>(null);
    const [callerId, setCallerId] = useState<string | null>(null);
    const connRef = useRef<MediaConnection | null>(null);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const callTimerRef = useRef<number | null>(null);
    const callStartRef = useRef<number | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const incomingCallRef = useRef<any>(null);
    const unansweredTimeoutRef = useRef<any>(null);
    const dialToneRef = useRef<HTMLAudioElement | null>(null);
    const ringToneRef = useRef<HTMLAudioElement | null>(null);
    const dataConnRef = useRef<any>(null);

    useEffect(() => {
        if (!loggedInUser || peer) return;

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
            const { type, callerId: metadataCallerId } = call.metadata || {};
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
                ringToneRef.current.play().catch((err: any) => {
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
    }, [loggedInUser]);

    const formatCallDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const startCallTimer = () => {
        if (callTimerRef.current !== null) return;
        callStartRef.current = Date.now() - callDuration * 1000;
        callTimerRef.current = window.setInterval(() => {
            if (!callStartRef.current) return;
            const elapsedSeconds = Math.floor((Date.now() - callStartRef.current) / 1000);
            setCallDuration(elapsedSeconds);
        }, 250);
    };

    const stopCallTimer = (reset = true) => {
        if (callTimerRef.current !== null) {
            clearInterval(callTimerRef.current);
            callTimerRef.current = null;
        }
        if (reset) {
            callStartRef.current = null;
            setCallDuration(0);
        } else {
            callStartRef.current = null;
        }
    };

    const handleSignal = (msg: any) => {
        if (msg.type === "end-call") endCall(true);
        if (msg.type === "decline-call") endCall(true);
    };

    const startAudioCall = async (remoteId: string) => {
        sendCall("audio");
        setIsCaller(true);
        if (dialToneRef.current) {
            dialToneRef.current.currentTime = 0;
            await dialToneRef.current.play().catch(() => { });
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            localStreamRef.current = stream;
            if (!peer) throw new Error("Peer not initialized");

            const call = peer.call(remoteId, stream, { metadata: { type: "audio", callerId: myPeerId } });
            call.on("stream", (remoteStream) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                setCallState("audio-connected");
                startCallTimer();
            });
            call.on("close", () => {
                setCallState("ended");
                endCall();
            });
            call.on("error", () => {
                setCallState("unavailable");
                endCall();
            });

            connRef.current = call;
            setCallState("audio-calling");

            unansweredTimeoutRef.current = setTimeout(() => {
                if (callState === "audio-calling") {
                    setCallState("no-answer");
                    endCall(true);
                }
            }, 60000);

            dataConnRef.current = peer.connect(remoteId);
            dataConnRef.current.on("data", (msg: any) => handleSignal(msg));
        } catch (err) {
            console.error("Audio call error:", err);
            setCallState("idle");
        }
    };

    const startVideoCall = async (remoteId: string) => {
        sendCall("video");
        setIsCaller(true);
        if (dialToneRef.current) {
            dialToneRef.current.currentTime = 0;
            await dialToneRef.current.play().catch(() => { });
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.play().catch(() => { });
            }
            if (!peer) throw new Error("Peer not initialized");

            const call = peer.call(remoteId, stream, { metadata: { type: "video", callerId: myPeerId } });
            call.on("stream", (remoteStream) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                setCallState("video-connected");
                startCallTimer();
            });
            call.on("close", () => {
                setCallState("ended");
                endCall(true);
            });
            call.on("error", () => {
                setCallState("unavailable");
                endCall(true);
            });

            connRef.current = call;
            setCallState("video-calling");

            unansweredTimeoutRef.current = setTimeout(() => {
                if (callState === "video-calling") {
                    setCallState("no-answer");
                    endCall(true);
                }
            }, 60000);
        } catch (err) {
            console.error("Video call error:", err);
            setCallState("idle");
        }
    };

    const playRingtone = () => {
        if (ringToneRef.current) {
            ringToneRef.current.currentTime = 0;
            ringToneRef.current.play().catch(() => { });
        }
    };

    const stopDialtone = () => {
        if (dialToneRef.current) {
            dialToneRef.current.pause();
            dialToneRef.current.currentTime = 0;
        }
    };

    const stopRingtone = () => {
        if (ringToneRef.current) {
            ringToneRef.current.pause();
            ringToneRef.current.currentTime = 0;
        }
    };

    const acceptCall = async () => {
        if (!incomingCallRef.current) return;
        const call = incomingCallRef.current;
        const { type } = call.metadata || {};
        const constraints = type === "video" ? { audio: true, video: true } : { audio: true, video: false };
        stopRingtone();
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.play().catch(() => { });
            }
            call.answer(stream);
            call.on("stream", (remoteStream: MediaStream) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
            });
            connRef.current = call;
            setCallState(type === "video" ? "video-connected" : "audio-connected");
            startCallTimer();
        } catch (err) {
            console.error("Error accepting call:", err);
            setCallState("idle");
        }
    };

    const declineCall = () => {
        if (dataConnRef.current?.open) dataConnRef.current.send({ type: "decline-call" });
        if (incomingCallRef.current) {
            incomingCallRef.current.close();
            incomingCallRef.current = null;
        }
        stopDialtone();
        if (isCaller) sendMissedCall();
        endCall(true);
    };

    const endCall = (forceEnded = false) => {
        if (dataConnRef.current?.open) dataConnRef.current.send({ type: "end-call" });
        setCallState(forceEnded ? "ended" : "idle");
        stopCallTimer();
        setIsMuted(false);
        setIsVideoOff(false);
        setIsCaller(false);
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (connRef.current) {
            connRef.current.close();
            connRef.current = null;
        }
        if (incomingCallRef.current) {
            incomingCallRef.current.close();
            incomingCallRef.current = null;
        }
        if (dataConnRef.current) {
            dataConnRef.current.close();
            dataConnRef.current = null;
        }
        stopRingtone();
        stopDialtone();
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    const sendMissedCall = async () => {
        if (!selectedContact) return;
        try {
            await sendMessage(conversationId, "Missed call", "missedCall", "");
        } catch (error) {
            console.error(error);
        }
    };

    const sendCall = async (type: string) => {
        if (!selectedContact) return;
        try {
            await sendMessage(conversationId, `${type} call`, `${type}Call`, "");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <PeerContext.Provider
            value={{
                selectedContact,
                setSelectedContact,
                sending,
                setSending,
                loggedInUser,
                messages,
                setMessages,
                conversationId,
                setConversationId,
                isCaller,
                setIsCaller,
                caller,
                setCaller,
                callState,
                setCallState,
                callDuration,
                setCallDuration,
                isMuted,
                setIsMuted,
                isVideoOff,
                setIsVideoOff,
                peer,
                setPeer,
                recipientPeerId,
                setRecipientPeerId,
                myPeerId,
                setMyPeerId,
                callerId,
                setCallerId,

                connRef,
                localVideoRef,
                remoteVideoRef,
                callTimerRef,
                callStartRef,
                localStreamRef,
                incomingCallRef,
                unansweredTimeoutRef,
                dialToneRef,
                ringToneRef,
                dataConnRef,

                formatCallDuration,
                startCallTimer,
                stopCallTimer,
                handleSignal,
                startAudioCall,
                startVideoCall,
                playRingtone,
                stopDialtone,
                stopRingtone,
                acceptCall,
                declineCall,
                endCall,
                toggleMute,
                toggleVideo,
                sendMissedCall,
                sendCall,
            }}>
            {children}
            <CallOverlay />
        </PeerContext.Provider>
    );
};

export const usePeerContext = () => {
    const ctx = useContext(PeerContext);
    if (!ctx) throw new Error("usePeerContext must be used within PeerProvider");
    return ctx;
};
