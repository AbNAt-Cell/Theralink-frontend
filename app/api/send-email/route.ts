import { NextResponse } from 'next/server';
import {
    sendAppointmentConfirmationEmail,
    sendAppointmentReminderEmail,
    sendAppointmentCancellationEmail
} from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, ...emailData } = body;

        if (!emailData.clientEmail) {
            return NextResponse.json(
                { error: 'Client email is required' },
                { status: 400 }
            );
        }

        let result;

        switch (type) {
            case 'confirmation':
                result = await sendAppointmentConfirmationEmail(emailData);
                break;
            case 'reminder':
                result = await sendAppointmentReminderEmail(emailData);
                break;
            case 'cancellation':
                result = await sendAppointmentCancellationEmail(emailData);
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid email type. Use: confirmation, reminder, or cancellation' },
                    { status: 400 }
                );
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
