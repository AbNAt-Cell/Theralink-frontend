import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors
let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface AppointmentEmailData {
  clientEmail: string;
  clientName: string;
  staffName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  location?: string;
  clinicName?: string;
}

export async function sendAppointmentConfirmationEmail(data: AppointmentEmailData) {
  const {
    clientEmail,
    clientName,
    staffName,
    appointmentDate,
    appointmentTime,
    appointmentType,
    location = 'To be confirmed',
    clinicName = 'TheraLink'
  } = data;

  try {
    const { data: emailData, error } = await getResend().emails.send({
      from: process.env.EMAIL_FROM || 'appointments@theralink.com',
      to: clientEmail,
      subject: `Appointment Confirmed - ${appointmentType} on ${appointmentDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Appointment Confirmation</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Appointment Confirmed</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Hello <strong>${clientName}</strong>,
              </p>
              
              <p style="color: #666; font-size: 15px; line-height: 1.6;">
                Your appointment has been scheduled. Here are the details:
              </p>
              
              <!-- Appointment Card -->
              <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 120px;">📅 Date:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${appointmentDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">🕐 Time:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${appointmentTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">📋 Type:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${appointmentType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">👤 With:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${staffName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">📍 Location:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${location}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                If you need to reschedule or cancel, please contact us at least 24 hours in advance.
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://app.theralink.com'}/client/appointments" 
                   style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View My Appointments
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                This email was sent by ${clinicName}<br>
                Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending appointment email:', error);
      throw error;
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Failed to send appointment email:', error);
    throw error;
  }
}

export async function sendAppointmentReminderEmail(data: AppointmentEmailData) {
  const {
    clientEmail,
    clientName,
    staffName,
    appointmentDate,
    appointmentTime,
    appointmentType,
    clinicName = 'TheraLink'
  } = data;

  try {
    const { data: emailData, error } = await getResend().emails.send({
      from: process.env.EMAIL_FROM || 'appointments@theralink.com',
      to: clientEmail,
      subject: `Reminder: ${appointmentType} Tomorrow at ${appointmentTime}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Appointment Reminder</title>
        </head>
        <body style="font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
            <h1 style="color: #1e3a5f;">⏰ Appointment Reminder</h1>
            <p>Hi ${clientName},</p>
            <p>This is a friendly reminder about your upcoming appointment:</p>
            <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 ${appointmentDate}</strong> at <strong>${appointmentTime}</strong></p>
              <p style="margin: 5px 0;">📋 ${appointmentType} with ${staffName}</p>
            </div>
            <p>We look forward to seeing you!</p>
            <p style="color: #666; font-size: 12px;">— The ${clinicName} Team</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) throw error;
    return { success: true, data: emailData };
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    throw error;
  }
}

export async function sendAppointmentCancellationEmail(data: AppointmentEmailData & { reason?: string }) {
  const {
    clientEmail,
    clientName,
    appointmentDate,
    appointmentTime,
    appointmentType,
    reason = 'No reason provided',
    clinicName = 'TheraLink'
  } = data;

  try {
    const { data: emailData, error } = await getResend().emails.send({
      from: process.env.EMAIL_FROM || 'appointments@theralink.com',
      to: clientEmail,
      subject: `Appointment Cancelled - ${appointmentDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
            <h1 style="color: #dc2626;">Appointment Cancelled</h1>
            <p>Hi ${clientName},</p>
            <p>Your appointment has been cancelled:</p>
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 ${appointmentDate}</strong> at <strong>${appointmentTime}</strong></p>
              <p style="margin: 5px 0;">📋 ${appointmentType}</p>
              <p style="margin: 5px 0;">📝 Reason: ${reason}</p>
            </div>
            <p>Please contact us to reschedule if needed.</p>
            <p style="color: #666; font-size: 12px;">— The ${clinicName} Team</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) throw error;
    return { success: true, data: emailData };
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
    throw error;
  }
}
