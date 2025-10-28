/**
 * Notification Services
 * Email notifications via Resend
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'PlayConnect <noreply@playconnect.app>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Send email verification
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your PlayConnect account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to PlayConnect!</h2>
          <p>Thanks for signing up. Please verify your email address to get started.</p>
          <p>
            <a href="${verifyUrl}"
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a>
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 40px;">
            This link expires in 24 hours. If you didn't sign up, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

/**
 * Send playdate proposal notification
 */
export async function sendProposalNotification(params: {
  recipientEmail: string;
  recipientName: string;
  proposerName: string;
  proposerChildName: string;
  recipientChildName: string;
  proposalId: string;
  suggestedSlots: string[];
}) {
  const { recipientEmail, recipientName, proposerName, proposerChildName, recipientChildName, proposalId, suggestedSlots } = params;
  const proposalUrl = `${APP_URL}/proposals/${proposalId}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `New playdate proposal for ${recipientChildName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Playdate Proposal 🎉</h2>
          <p>Hi ${recipientName},</p>
          <p>
            <strong>${proposerName}</strong> has proposed a playdate between
            <strong>${proposerChildName}</strong> and <strong>${recipientChildName}</strong>!
          </p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Suggested Times:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${suggestedSlots.map((slot) => `<li>${slot}</li>`).join('')}
            </ul>
          </div>
          <p>
            <a href="${proposalUrl}"
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Proposal
            </a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 40px;">
            You can confirm, suggest alternative times, or decline in the app.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send proposal notification:', error);
    throw error;
  }
}

/**
 * Send playdate confirmation
 */
export async function sendConfirmationEmail(params: {
  recipientEmail: string;
  recipientName: string;
  otherParentName: string;
  childName: string;
  otherChildName: string;
  dateTime: string;
  location: string;
  proposalId: string;
  icsAttachment?: string;
}) {
  const { recipientEmail, recipientName, childName, otherChildName, dateTime, location, proposalId, icsAttachment } = params;
  const proposalUrl = `${APP_URL}/proposals/${proposalId}`;

  try {
    const emailData: any = {
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `Playdate confirmed: ${childName} & ${otherChildName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Playdate Confirmed! ✅</h2>
          <p>Hi ${recipientName},</p>
          <p>Great news! Your playdate is confirmed.</p>
          <div style="background: #ecfdf5; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0;"><strong>Children:</strong> ${childName} & ${otherChildName}</p>
            <p style="margin: 8px 0 0;"><strong>When:</strong> ${dateTime}</p>
            <p style="margin: 8px 0 0;"><strong>Where:</strong> ${location}</p>
          </div>
          <p>
            <a href="${proposalUrl}"
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Details & Chat
            </a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 40px;">
            A calendar invite is attached. We'll send reminders 24 hours and 2 hours before.
          </p>
        </div>
      `,
    };

    if (icsAttachment) {
      emailData.attachments = [
        {
          filename: 'playdate.ics',
          content: Buffer.from(icsAttachment).toString('base64'),
        },
      ];
    }

    await resend.emails.send(emailData);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}

/**
 * Send playdate reminder
 */
export async function sendReminderEmail(params: {
  recipientEmail: string;
  recipientName: string;
  childName: string;
  otherChildName: string;
  dateTime: string;
  location: string;
  hoursUntil: number;
}) {
  const { recipientEmail, recipientName, childName, otherChildName, dateTime, location, hoursUntil } = params;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `Reminder: Playdate ${hoursUntil === 24 ? 'tomorrow' : 'in 2 hours'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Playdate Reminder ⏰</h2>
          <p>Hi ${recipientName},</p>
          <p>
            ${hoursUntil === 24
              ? "Just a reminder that you have a playdate tomorrow!"
              : "Your playdate is starting in 2 hours!"}
          </p>
          <div style="background: #fffbeb; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0;"><strong>Children:</strong> ${childName} & ${otherChildName}</p>
            <p style="margin: 8px 0 0;"><strong>When:</strong> ${dateTime}</p>
            <p style="margin: 8px 0 0;"><strong>Where:</strong> ${location}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Have a wonderful time! If you need to reschedule, please contact the other parent through the app.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    // Don't throw on reminder failures
  }
}

/**
 * Send message notification (new message in playdate chat)
 */
export async function sendMessageNotification(params: {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  messagePreview: string;
  proposalId: string;
}) {
  const { recipientEmail, recipientName, senderName, messagePreview, proposalId } = params;
  const proposalUrl = `${APP_URL}/proposals/${proposalId}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `New message from ${senderName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Message 💬</h2>
          <p>Hi ${recipientName},</p>
          <p><strong>${senderName}</strong> sent you a message:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; font-style: italic;">
            "${messagePreview}"
          </div>
          <p>
            <a href="${proposalUrl}"
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reply
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send message notification:', error);
    // Don't throw on message notifications
  }
}
