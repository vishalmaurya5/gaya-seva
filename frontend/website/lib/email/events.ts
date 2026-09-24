/**
 * GayaSeva Email Events Registry & Metadata
 * Production-ready event definitions for transactional emails.
 */

export type EmailEventKey =
  | 'USER_REGISTERED'
  | 'PROVIDER_REGISTERED'
  | 'PROVIDER_PAYMENT_SUCCESS'
  | 'PROVIDER_VERIFIED'
  | 'PROVIDER_REJECTED'
  | 'CUSTOMER_REGISTERED'
  | 'EMAIL_VERIFICATION'
  | 'PASSWORD_RESET'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'SERVICE_REQUEST_CREATED'
  | 'SERVICE_REQUEST_UPDATED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'COMPLAINT_CREATED'
  | 'COMPLAINT_UPDATED'
  | 'SECURITY_ALERT';

export interface EmailEventDefinition {
  key: EmailEventKey;
  name: string;
  category: 'ACCOUNT' | 'PROVIDER' | 'PAYMENT' | 'BOOKING' | 'SUPPORT' | 'SECURITY';
  defaultSubject: string;
  preheader: string;
  requiredVariables: string[];
  description: string;
}

export const EMAIL_EVENTS: Record<EmailEventKey, EmailEventDefinition> = {
  USER_REGISTERED: {
    key: 'USER_REGISTERED',
    name: 'Customer Registration Welcome',
    category: 'ACCOUNT',
    defaultSubject: 'Welcome to GayaSeva — Your Gaya Journey Starts Here',
    preheader: 'Thank you for registering with GayaSeva. Explore authentic local services in Gaya.',
    requiredVariables: ['user_name', 'account_email'],
    description: 'Sent immediately when a new customer registers an account.',
  },
  CUSTOMER_REGISTERED: {
    key: 'CUSTOMER_REGISTERED',
    name: 'Customer Account Created',
    category: 'ACCOUNT',
    defaultSubject: 'Welcome to GayaSeva — Your Gaya Journey Starts Here',
    preheader: 'Your account is ready. Discover trusted pandits, stays, and pick & drop services.',
    requiredVariables: ['user_name', 'account_email'],
    description: 'Alias for USER_REGISTERED customer welcome email.',
  },
  PROVIDER_REGISTERED: {
    key: 'PROVIDER_REGISTERED',
    name: 'Provider Application Received',
    category: 'PROVIDER',
    defaultSubject: 'Welcome to GayaSeva — Your Service Provider Registration is Received',
    preheader: 'We have received your application. Our team will review your details shortly.',
    requiredVariables: ['provider_name', 'provider_type', 'service_name', 'status', 'date'],
    description: 'Sent when a new service provider completes registration application.',
  },
  PROVIDER_PAYMENT_SUCCESS: {
    key: 'PROVIDER_PAYMENT_SUCCESS',
    name: 'Provider Registration Payment Success',
    category: 'PAYMENT',
    defaultSubject: 'GayaSeva — Provider Registration Payment Successful',
    preheader: 'Your registration payment of ₹49 was verified successfully.',
    requiredVariables: ['provider_name', 'amount', 'payment_id', 'order_id', 'payment_date'],
    description: 'Sent after server verifies provider registration ₹49 fee payment.',
  },
  PROVIDER_VERIFIED: {
    key: 'PROVIDER_VERIFIED',
    name: 'Provider Account Verified',
    category: 'PROVIDER',
    defaultSubject: 'GayaSeva — Your Service Provider Account Has Been Verified',
    preheader: 'Congratulations! Your GayaSeva provider profile is active and verified.',
    requiredVariables: ['provider_name', 'provider_type', 'service_name'],
    description: 'Sent when an administrator approves provider verification.',
  },
  PROVIDER_REJECTED: {
    key: 'PROVIDER_REJECTED',
    name: 'Provider Verification Update Required',
    category: 'PROVIDER',
    defaultSubject: 'GayaSeva — Update on Your Service Provider Registration',
    preheader: 'Important details regarding your provider application review.',
    requiredVariables: ['provider_name', 'reason'],
    description: 'Sent when administrator requests modifications or rejects verification.',
  },
  EMAIL_VERIFICATION: {
    key: 'EMAIL_VERIFICATION',
    name: 'Email Address Verification',
    category: 'ACCOUNT',
    defaultSubject: 'GayaSeva — Verify Your Email Address',
    preheader: 'Please confirm your email address to secure your GayaSeva account.',
    requiredVariables: ['user_name', 'verification_url'],
    description: 'Sent to verify user email address with secure HTTPS link.',
  },
  PASSWORD_RESET: {
    key: 'PASSWORD_RESET',
    name: 'Password Reset Request',
    category: 'SECURITY',
    defaultSubject: 'GayaSeva — Reset Your Password',
    preheader: 'Secure password reset request for your GayaSeva account.',
    requiredVariables: ['user_name', 'reset_url'],
    description: 'Sent when user requests a password reset link.',
  },
  BOOKING_CONFIRMED: {
    key: 'BOOKING_CONFIRMED',
    name: 'Booking Confirmation',
    category: 'BOOKING',
    defaultSubject: 'GayaSeva — Booking Confirmation #{{order_id}}',
    preheader: 'Your service booking in Gaya Ji has been confirmed.',
    requiredVariables: ['user_name', 'service_name', 'booking_date', 'order_id', 'amount'],
    description: 'Sent when a customer booking is confirmed.',
  },
  BOOKING_CANCELLED: {
    key: 'BOOKING_CANCELLED',
    name: 'Booking Cancellation',
    category: 'BOOKING',
    defaultSubject: 'GayaSeva — Booking Cancelled #{{order_id}}',
    preheader: 'Your booking has been cancelled.',
    requiredVariables: ['user_name', 'service_name', 'order_id', 'reason'],
    description: 'Sent when a booking is cancelled.',
  },
  SERVICE_REQUEST_CREATED: {
    key: 'SERVICE_REQUEST_CREATED',
    name: 'Service Request Created',
    category: 'BOOKING',
    defaultSubject: 'GayaSeva — Service Request Received #{{order_id}}',
    preheader: 'We have received your local service request.',
    requiredVariables: ['user_name', 'service_name', 'order_id'],
    description: 'Sent when a custom service request is created.',
  },
  SERVICE_REQUEST_UPDATED: {
    key: 'SERVICE_REQUEST_UPDATED',
    name: 'Service Request Status Update',
    category: 'BOOKING',
    defaultSubject: 'GayaSeva — Service Request Status Update #{{order_id}}',
    preheader: 'The status of your service request has changed.',
    requiredVariables: ['user_name', 'service_name', 'order_id', 'status'],
    description: 'Sent when service request status updates.',
  },
  PAYMENT_SUCCESS: {
    key: 'PAYMENT_SUCCESS',
    name: 'Payment Receipt',
    category: 'PAYMENT',
    defaultSubject: 'GayaSeva — Payment Receipt #{{payment_id}}',
    preheader: 'Payment received. Thank you for using GayaSeva.',
    requiredVariables: ['user_name', 'amount', 'currency', 'payment_id', 'order_id', 'payment_date'],
    description: 'Sent after successful transaction payment verification.',
  },
  PAYMENT_FAILED: {
    key: 'PAYMENT_FAILED',
    name: 'Payment Failed',
    category: 'PAYMENT',
    defaultSubject: 'GayaSeva — Payment Transaction Failed #{{order_id}}',
    preheader: 'Your recent payment transaction could not be processed.',
    requiredVariables: ['user_name', 'amount', 'order_id', 'reason'],
    description: 'Sent when payment verification fails or drops.',
  },
  COMPLAINT_CREATED: {
    key: 'COMPLAINT_CREATED',
    name: 'Support Ticket Created',
    category: 'SUPPORT',
    defaultSubject: 'GayaSeva — Support Ticket Created #{{ticket_id}}',
    preheader: 'Our support team has logged your query.',
    requiredVariables: ['user_name', 'ticket_id', 'subject_summary'],
    description: 'Sent when customer or provider files a complaint/support request.',
  },
  COMPLAINT_UPDATED: {
    key: 'COMPLAINT_UPDATED',
    name: 'Support Ticket Update',
    category: 'SUPPORT',
    defaultSubject: 'GayaSeva — Support Ticket Update #{{ticket_id}}',
    preheader: 'An update was posted on your support ticket.',
    requiredVariables: ['user_name', 'ticket_id', 'status', 'resolution_note'],
    description: 'Sent when support staff updates ticket resolution status.',
  },
  SECURITY_ALERT: {
    key: 'SECURITY_ALERT',
    name: 'Account Security Alert',
    category: 'SECURITY',
    defaultSubject: 'GayaSeva Security Alert — Important Account Notice',
    preheader: 'Important security notification for your account.',
    requiredVariables: ['user_name', 'alert_description', 'action_required'],
    description: 'Sent on suspicious login, password change, or security event.',
  },
};
