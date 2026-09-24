/**
 * GayaSeva Premium HTML & Plain-Text Email Templates Engine
 * Clean, email-client compliant, responsive design supporting all 16 event keys.
 */

import { EmailEventKey, EMAIL_EVENTS } from './events';
import { substituteVariables } from './variables';

export interface EmailTemplateRecord {
  id: string;
  event_key: EmailEventKey;
  subject: string;
  preheader: string;
  html_body: string;
  text_body: string;
  active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Modern, responsive GayaSeva Master Email Container HTML Wrapper
 */
export function wrapInMasterTemplate(contentHtml: string, preheader: string = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>GayaSeva Email</title>
  <style type="text/css">
    /* Reset styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F8FAF9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }

    /* Mobile Responsive Styles */
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 12px !important; }
      .content-box { padding: 20px 16px !important; }
      .cta-button { width: 100% !important; text-align: center !important; display: block !important; }
      .header-title { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAF9;">
  <!-- Hidden Preheader Text -->
  <div style="display: none; font-size: 1px; color: #F8FAF9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAF9;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <!-- Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #800020 0%, #4A2E1A 100%); padding: 32px 24px; text-align: center;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="background-color: #D4AF37; width: 48px; height: 48px; border-radius: 12px; display: inline-block; line-height: 48px; text-align: center; color: #800020; font-size: 26px; font-weight: bold; font-family: serif;">
                      GS
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <h1 class="header-title" style="margin: 0; color: #FFFFFF; font-family: Georgia, serif; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">
                      GayaSeva
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #F1E5D1; font-size: 13px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">
                      Gaya Ji Premium Local Services & Pilgrimage Portal
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Section -->
          <tr>
            <td class="content-box" style="padding: 32px 36px; background-color: #FFFFFF; color: #1E293B; font-size: 15px; line-height: 1.6;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Support & Trust Banner -->
          <tr>
            <td style="background-color: #FDFBF7; padding: 20px 36px; border-top: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size: 13px; color: #64748B;">
                    <strong style="color: #4A2E1A;">Need assistance?</strong> Our Gaya-based local support team is here to help you 24/7.
                  </td>
                  <td align="right" style="font-size: 13px;">
                    <a href="mailto:{{support_email}}" style="color: #800020; font-weight: 600; text-decoration: none;">Contact Support &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1E293B; padding: 28px 36px; text-align: center; color: #94A3B8; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0; color: #E2E8F0; font-size: 13px; font-weight: 600;">
                GayaSeva Services Private Limited
              </p>
              <p style="margin: 0 0 12px 0;">
                Vishnupad Temple Road, Chand Chaura, Gaya, Bihar 823001, India
              </p>
              <p style="margin: 0 0 16px 0;">
                <a href="{{website_url}}" style="color: #D4AF37; text-decoration: none; margin: 0 8px;">Website</a> |
                <a href="{{privacy_url}}" style="color: #D4AF37; text-decoration: none; margin: 0 8px;">Privacy Policy</a> |
                <a href="{{terms_url}}" style="color: #D4AF37; text-decoration: none; margin: 0 8px;">Terms of Service</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748B;">
                &copy; {{current_year}} GayaSeva. All rights reserved. Confidential & Security Encrypted Transactional Email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Helper to build high-converting email buttons
 */
export function buildCtaButton(text: string, url: string): string {
  return `<table border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
  <tr>
    <td align="center" style="border-radius: 10px; background-color: #800020;">
      <a href="${url}" target="_blank" class="cta-button" style="font-size: 15px; font-family: sans-serif; color: #FFFFFF; text-decoration: none; border-radius: 10px; padding: 14px 28px; border: 1px solid #800020; display: inline-block; font-weight: 600; letter-spacing: 0.3px;">
        ${text}
      </a>
    </td>
  </tr>
</table>`;
}

/**
 * Built-in default HTML templates for all 16 email events
 */
const DEFAULT_BUILTIN_TEMPLATES: Record<EmailEventKey, { subject: string; preheader: string; html: string; text: string }> = {
  USER_REGISTERED: {
    subject: 'Welcome to GayaSeva — Your Gaya Journey Starts Here',
    preheader: 'Welcome to GayaSeva! Explore certified pandits, verified stays, and pick & drop services.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Welcome to <strong>GayaSeva</strong> — Gaya Ji's trusted local service & pilgrimage platform!</p>
      <p>Your account has been successfully created. You can now book verified local Pandits for Pind Daan, explore hotels & homestays near Vishnupad, book railway station pick & drop, and manage support requests directly from your personal dashboard.</p>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAF9; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #E2E8F0;">
        <tr>
          <td style="font-size: 14px; color: #475569;">
            <strong>Account Email:</strong> {{account_email}}<br>
            <strong>Registration Date:</strong> {{current_year}}<br>
            <strong>Account Status:</strong> <span style="color: #166534; font-weight: 600;">Active</span>
          </td>
        </tr>
      </table>

      ${buildCtaButton('Open GayaSeva Dashboard', '{{dashboard_url}}')}

      <p style="margin-bottom: 0; color: #64748B; font-size: 13px;">If you have any questions, our local Gaya support team is always here to assist you.</p>
    `,
    text: `Hello {{user_name}},\n\nWelcome to GayaSeva — Gaya Ji's trusted local service & pilgrimage platform!\n\nAccount Email: {{account_email}}\nAccount Status: Active\n\nAccess your dashboard: {{dashboard_url}}\n\nRegards,\nGayaSeva Team`,
  },

  CUSTOMER_REGISTERED: {
    subject: 'Welcome to GayaSeva — Your Gaya Journey Starts Here',
    preheader: 'Your GayaSeva account is ready. Discover trusted pandits, stays, and pick & drop services.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Welcome to <strong>GayaSeva</strong>! Your account has been registered successfully.</p>
      <p>We are dedicated to providing seamless, authentic pilgrimage and local travel experiences in Gaya Ji.</p>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAF9; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #E2E8F0;">
        <tr>
          <td style="font-size: 14px; color: #475569;">
            <strong>Registered Email:</strong> {{account_email}}<br>
            <strong>Status:</strong> Active
          </td>
        </tr>
      </table>

      ${buildCtaButton('Open GayaSeva Dashboard', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nWelcome to GayaSeva!\nRegistered Email: {{account_email}}\n\nDashboard: {{dashboard_url}}`,
  },

  PROVIDER_REGISTERED: {
    subject: 'Welcome to GayaSeva — Your Service Provider Registration is Received',
    preheader: 'Thank you for registering your service with GayaSeva. Profile review in progress.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{provider_name}}</strong>,</p>
      <p>Thank you for registering your service with <strong>GayaSeva</strong>. We have successfully received your provider registration application.</p>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAF9; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #E2E8F0;">
        <tr>
          <td style="font-size: 14px; color: #334155; line-height: 1.8;">
            <strong>Provider Name:</strong> {{provider_name}}<br>
            <strong>Provider Type:</strong> {{provider_type}}<br>
            <strong>Service:</strong> {{service_name}}<br>
            <strong>Registration Status:</strong> <span style="color: #D97706; font-weight: 600;">Under Review</span><br>
            <strong>Registration Date:</strong> {{date}}<br>
            <strong>Payment Status:</strong> {{status}}
          </td>
        </tr>
      </table>

      <p><strong>Next Step:</strong> Your profile and uploaded verification documents will be reviewed by the GayaSeva verification team. You will receive an email once your account is verified.</p>

      ${buildCtaButton('View Provider Dashboard', '{{dashboard_url}}')}

      <p style="color: #64748B; font-size: 13px;">Thank you for partnering with GayaSeva to serve devotees and travelers in Gaya Ji.</p>
    `,
    text: `Hello {{provider_name}},\n\nThank you for registering your service with GayaSeva.\n\nProvider Type: {{provider_type}}\nService: {{service_name}}\nRegistration Status: Under Review\nDate: {{date}}\nPayment Status: {{status}}\n\nView Dashboard: {{dashboard_url}}\n\nRegards,\nGayaSeva Verification Team`,
  },

  PROVIDER_PAYMENT_SUCCESS: {
    subject: 'GayaSeva — Provider Registration Payment Successful',
    preheader: 'Your registration fee payment of ₹49 was verified successfully.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{provider_name}}</strong>,</p>
      <p>Your service provider registration payment of <strong>₹49</strong> has been verified successfully.</p>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAF9; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #E2E8F0;">
        <tr>
          <td style="font-size: 14px; color: #334155; line-height: 1.8;">
            <strong>Provider Name:</strong> {{provider_name}}<br>
            <strong>Registration Fee:</strong> ₹49.00 INR<br>
            <strong>Amount Paid:</strong> ₹{{amount}}<br>
            <strong>Payment ID:</strong> <span style="font-family: monospace;">{{payment_id}}</span><br>
            <strong>Order ID:</strong> <span style="font-family: monospace;">{{order_id}}</span><br>
            <strong>Payment Date:</strong> {{payment_date}}<br>
            <strong>Payment Status:</strong> <span style="color: #166534; font-weight: 600;">VERIFIED SUCCESSFUL</span>
          </td>
        </tr>
      </table>

      ${buildCtaButton('Open Provider Dashboard', '{{dashboard_url}}')}

      <p style="color: #64748B; font-size: 13px;">A formal GST tax invoice receipt is attached to your account billing history.</p>
    `,
    text: `Hello {{provider_name}},\n\nYour provider registration payment of ₹49 was successful.\n\nPayment ID: {{payment_id}}\nOrder ID: {{order_id}}\nDate: {{payment_date}}\nStatus: VERIFIED SUCCESSFUL\n\nDashboard: {{dashboard_url}}`,
  },

  PROVIDER_VERIFIED: {
    subject: 'GayaSeva — Your Service Provider Account Has Been Verified',
    preheader: 'Congratulations! Your GayaSeva provider profile is active and verified.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{provider_name}}</strong>,</p>
      <p style="color: #166534; font-size: 18px; font-weight: 700; margin: 10px 0;">🎉 Congratulations! Your GayaSeva Provider Account is Verified.</p>
      <p>Your provider profile and credentials have been thoroughly reviewed and approved by the GayaSeva administrative team.</p>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F0FDF4; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #BBF7D0;">
        <tr>
          <td style="font-size: 14px; color: #166534; line-height: 1.8;">
            <strong>Provider Name:</strong> {{provider_name}}<br>
            <strong>Provider Type:</strong> {{provider_type}}<br>
            <strong>Service Name:</strong> {{service_name}}<br>
            <strong>Verification Status:</strong> <span style="background-color: #166534; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">VERIFIED & ACTIVE</span>
          </td>
        </tr>
      </table>

      <p>Your listing is now publicly visible to thousands of pilgrims and tourists looking for services in Gaya Ji. You can start receiving service bookings and managing availability right away.</p>

      ${buildCtaButton('Open Provider Dashboard', '{{dashboard_url}}')}
    `,
    text: `Hello {{provider_name}},\n\nYour GayaSeva service provider account has been VERIFIED and activated.\n\nProvider Type: {{provider_type}}\nService: {{service_name}}\nStatus: VERIFIED & ACTIVE\n\nOpen Dashboard: {{dashboard_url}}`,
  },

  PROVIDER_REJECTED: {
    subject: 'GayaSeva — Update on Your Service Provider Registration',
    preheader: 'Important updates regarding your GayaSeva provider profile application.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{provider_name}}</strong>,</p>
      <p>We reviewed your service provider application for GayaSeva. At this stage, your application requires modifications before verification can be approved.</p>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FEF2F2; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #FECACA;">
        <tr>
          <td style="font-size: 14px; color: #991B1B; line-height: 1.8;">
            <strong>Status:</strong> Verification Pending / Action Required<br>
            <strong>Reason / Feedback:</strong> {{reason}}
          </td>
        </tr>
      </table>

      <p><strong>Required Next Step:</strong> Please log in to your provider dashboard, update the required documents or information, and resubmit your profile for re-verification.</p>

      ${buildCtaButton('Open Provider Dashboard', '{{dashboard_url}}')}

      <p style="color: #64748B; font-size: 13px;">If you have any questions regarding this decision, reply to this email to speak with our verification desk.</p>
    `,
    text: `Hello {{provider_name}},\n\nUpdate regarding your provider application:\nStatus: Verification Pending / Action Required\nReason: {{reason}}\n\nPlease update your details and resubmit: {{dashboard_url}}`,
  },

  EMAIL_VERIFICATION: {
    subject: 'GayaSeva — Verify Your Email Address',
    preheader: 'Please confirm your email address to secure your GayaSeva account.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Please confirm your email address to complete your registration and secure your GayaSeva account.</p>

      ${buildCtaButton('Verify My Email', '{{verification_url}}')}

      <p style="font-size: 13px; color: #64748B;">This secure verification link is single-use and will expire in 24 hours. If you did not create a GayaSeva account, you can safely ignore this email.</p>
    `,
    text: `Hello {{user_name}},\n\nPlease verify your email address by visiting this link:\n{{verification_url}}\n\nLink expires in 24 hours.`,
  },

  PASSWORD_RESET: {
    subject: 'GayaSeva — Reset Your Password',
    preheader: 'Secure password reset request for your GayaSeva account.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>We received a request to reset the password for your GayaSeva account.</p>
      <p>Click the button below to create a new secure password:</p>

      ${buildCtaButton('Reset Password', '{{reset_url}}')}

      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFBEB; border-radius: 10px; padding: 16px; margin: 20px 0; border: 1px solid #FDE68A;">
        <tr>
          <td style="font-size: 13px; color: #92400E;">
            🔒 <strong>Security Notice:</strong> This reset link is temporary and can only be used once for the password-reset process. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.
          </td>
        </tr>
      </table>
    `,
    text: `Hello {{user_name}},\n\nWe received a request to reset your GayaSeva password.\n\nClick the link below to set a new password:\n{{reset_url}}\n\nThis link is temporary. If you did not request this, please ignore this email.`,
  },

  BOOKING_CONFIRMED: {
    subject: 'GayaSeva — Booking Confirmation #{{order_id}}',
    preheader: 'Your service booking in Gaya Ji has been confirmed.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Your booking with <strong>GayaSeva</strong> has been successfully confirmed!</p>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAF9; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #E2E8F0;">
        <tr>
          <td style="font-size: 14px; color: #334155; line-height: 1.8;">
            <strong>Booking ID:</strong> #{{order_id}}<br>
            <strong>Service Name:</strong> {{service_name}}<br>
            <strong>Date & Time:</strong> {{booking_date}}<br>
            <strong>Total Amount:</strong> ₹{{amount}}<br>
            <strong>Status:</strong> <span style="color: #166534; font-weight: 600;">CONFIRMED</span>
          </td>
        </tr>
      </table>

      ${buildCtaButton('View Booking Details', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nYour booking #{{order_id}} for {{service_name}} on {{booking_date}} has been confirmed.\nTotal Amount: ₹{{amount}}\n\nDashboard: {{dashboard_url}}`,
  },

  BOOKING_CANCELLED: {
    subject: 'GayaSeva — Booking Cancelled #{{order_id}}',
    preheader: 'Your booking #{{order_id}} has been cancelled.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Your booking #<strong>{{order_id}}</strong> for <strong>{{service_name}}</strong> has been cancelled.</p>
      <p><strong>Reason:</strong> {{reason}}</p>
      ${buildCtaButton('View Booking Status', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nYour booking #{{order_id}} for {{service_name}} was cancelled.\nReason: {{reason}}\n\nDashboard: {{dashboard_url}}`,
  },

  SERVICE_REQUEST_CREATED: {
    subject: 'GayaSeva — Service Request Received #{{order_id}}',
    preheader: 'We have received your custom local service request.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>We have received your service request for <strong>{{service_name}}</strong>.</p>
      <p>Request ID: #{{order_id}}</p>
      ${buildCtaButton('Track Request', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nService request #{{order_id}} for {{service_name}} received.\n\nTrack: {{dashboard_url}}`,
  },

  SERVICE_REQUEST_UPDATED: {
    subject: 'GayaSeva — Service Request Status Update #{{order_id}}',
    preheader: 'The status of your service request has changed.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Update on service request #<strong>{{order_id}}</strong> ({{service_name}}):</p>
      <p><strong>New Status:</strong> <span style="color: #0284C7; font-weight: 700;">{{status}}</span></p>
      ${buildCtaButton('View Request Updates', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nService request #{{order_id}} status updated to {{status}}.\n\nDashboard: {{dashboard_url}}`,
  },

  PAYMENT_SUCCESS: {
    subject: 'GayaSeva — Payment Receipt #{{payment_id}}',
    preheader: 'Payment received. Thank you for using GayaSeva.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Thank you for your payment. Here is your official transaction receipt:</p>

      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAF9; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #E2E8F0;">
        <tr>
          <td style="font-size: 14px; color: #334155; line-height: 1.8;">
            <strong>Payment ID:</strong> {{payment_id}}<br>
            <strong>Order ID:</strong> {{order_id}}<br>
            <strong>Amount Paid:</strong> ₹{{amount}} {{currency}}<br>
            <strong>Date:</strong> {{payment_date}}<br>
            <strong>Status:</strong> <span style="color: #166534; font-weight: 600;">SUCCESS</span>
          </td>
        </tr>
      </table>

      ${buildCtaButton('View Payment History', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nPayment Receipt #{{payment_id}}\nAmount: ₹{{amount}}\nOrder ID: {{order_id}}\nDate: {{payment_date}}\nStatus: SUCCESS`,
  },

  PAYMENT_FAILED: {
    subject: 'GayaSeva — Payment Transaction Failed #{{order_id}}',
    preheader: 'Your payment transaction could not be processed.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Your payment for order #<strong>{{order_id}}</strong> (₹{{amount}}) could not be completed.</p>
      <p><strong>Reason:</strong> {{reason}}</p>
      ${buildCtaButton('Retry Payment', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nPayment failed for order #{{order_id}}.\nReason: {{reason}}\n\nRetry: {{dashboard_url}}`,
  },

  COMPLAINT_CREATED: {
    subject: 'GayaSeva — Support Ticket Created #{{ticket_id}}',
    preheader: 'Our support team has logged your query.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Your support request has been logged under Ticket #<strong>{{ticket_id}}</strong>.</p>
      <p>Topic: {{subject_summary}}</p>
      ${buildCtaButton('View Ticket', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nSupport Ticket #{{ticket_id}} created.\nTopic: {{subject_summary}}\n\nDashboard: {{dashboard_url}}`,
  },

  COMPLAINT_UPDATED: {
    subject: 'GayaSeva — Support Ticket Update #{{ticket_id}}',
    preheader: 'An update was posted on your support ticket.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p>Update on Support Ticket #<strong>{{ticket_id}}</strong>:</p>
      <p><strong>Status:</strong> {{status}}</p>
      <p><strong>Response:</strong> {{resolution_note}}</p>
      ${buildCtaButton('View Conversation', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nTicket #{{ticket_id}} update:\nStatus: {{status}}\nNote: {{resolution_note}}`,
  },

  SECURITY_ALERT: {
    subject: 'GayaSeva Security Alert — Important Account Notice',
    preheader: 'Important security notification for your GayaSeva account.',
    html: `
      <p style="margin-top: 0;">Hello <strong>{{user_name}}</strong>,</p>
      <p style="color: #991B1B; font-weight: 700;">⚠️ Security Notification</p>
      <p>{{alert_description}}</p>
      <p><strong>Required Action:</strong> {{action_required}}</p>
      ${buildCtaButton('Go to Security Settings', '{{dashboard_url}}')}
    `,
    text: `Hello {{user_name}},\n\nSECURITY ALERT:\n{{alert_description}}\n\nRequired Action: {{action_required}}\n\nSecurity Settings: {{dashboard_url}}`,
  },
};

/**
 * Render complete email with variables substituted
 */
export function renderEmailTemplate(
  eventKey: EmailEventKey,
  variables: Record<string, any> = {},
  customTemplate?: Partial<EmailTemplateRecord>
): RenderedEmail {
  const builtin = DEFAULT_BUILTIN_TEMPLATES[eventKey] || DEFAULT_BUILTIN_TEMPLATES.USER_REGISTERED;

  const rawSubject = customTemplate?.subject || builtin.subject;
  const rawPreheader = customTemplate?.preheader || builtin.preheader;
  const rawHtmlBody = customTemplate?.html_body || builtin.html;
  const rawTextBody = customTemplate?.text_body || builtin.text;

  const subject = substituteVariables(rawSubject, variables);
  const preheader = substituteVariables(rawPreheader, variables);
  const bodyHtml = substituteVariables(rawHtmlBody, variables);
  const text = substituteVariables(rawTextBody, variables);

  const fullHtml = wrapInMasterTemplate(bodyHtml, preheader);
  const finalHtml = substituteVariables(fullHtml, variables);

  return {
    subject,
    html: finalHtml,
    text,
  };
}

export function getDefaultTemplatesList(): EmailTemplateRecord[] {
  const now = new Date().toISOString();
  return Object.keys(EMAIL_EVENTS).map((key, index) => {
    const eventKey = key as EmailEventKey;
    const def = EMAIL_EVENTS[eventKey];
    const builtin = DEFAULT_BUILTIN_TEMPLATES[eventKey];

    return {
      id: `tpl_${eventKey.toLowerCase()}`,
      event_key: eventKey,
      subject: builtin?.subject || def.defaultSubject,
      preheader: builtin?.preheader || def.preheader,
      html_body: builtin?.html || '',
      text_body: builtin?.text || '',
      active: true,
      version: 1,
      created_at: now,
      updated_at: now,
      updated_by: 'system',
    };
  });
}
