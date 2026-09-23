'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, AlertCircle, Mail, Phone, MapPin, UserCheck, Scale } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-xs sm:text-sm text-gray-800 font-sans">
      {/* Header Banner */}
      <div className="bg-[#2A180B] text-white p-8 rounded-3xl shadow-xl border border-[#F58220]/30 space-y-3">
        <div className="flex items-center gap-2 text-[#F6C343] font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#F58220]" />
          <span>DPDP ACT 2023 &amp; CONSTITUTIONAL PRIVACY SHIELD</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Gaya Seva — Privacy Policy</h1>
        <p className="text-xs text-[#F8F6EF]/80">
          Last Updated: 23 September 2026 • Compliant with DPDP Act 2023, DPDP Rules 2025 &amp; IT Rules
        </p>
      </div>

      {/* Preamble Box */}
      <div className="bg-emerald-50/80 border border-emerald-300/80 rounded-2xl p-5 space-y-2 text-emerald-950">
        <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Statutory Protection &amp; Notice</span>
        </div>
        <p className="text-xs leading-relaxed text-emerald-900">
          This Privacy Policy explains how Gaya Seva (&quot;Gaya Seva&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, stores and protects personal information when you use our website, create an account, register as a service provider, contact a provider, submit a listing, submit a review or otherwise interact with our platform.
        </p>
        <p className="text-xs font-medium text-emerald-950">
          We intend to process personal data in accordance with applicable Indian data-protection and information-technology laws. The <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> establishes requirements concerning notice, consent and processing of digital personal data, and the <strong>Digital Personal Data Protection Rules, 2025</strong> provide additional requirements and an implementation framework.
        </p>
      </div>

      {/* Privacy Policy Body */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8 leading-relaxed">

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            1. Information We Collect
          </h2>
          <p>Depending on how you use Gaya Seva, we may collect:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-1">
              <h4 className="font-bold text-[#4A2E1A] flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-amber-600"/> Account Information</h4>
              <p className="text-gray-700">Name, mobile number, email address, password/authentication info, and account type (Yatri / Provider).</p>
            </div>
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-1">
              <h4 className="font-bold text-[#4A2E1A] flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-600"/> Provider Information</h4>
              <p className="text-gray-700">Business name, contact/WhatsApp number, address, service category, vehicle/operating info, profile photos, and verification documents.</p>
            </div>
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-1">
              <h4 className="font-bold text-[#4A2E1A] flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-amber-600"/> Visitor &amp; Enquiries</h4>
              <p className="text-gray-700">Enquiry details, public reviews, request information, and direct call/WhatsApp initiation data.</p>
            </div>
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-1">
              <h4 className="font-bold text-[#4A2E1A] flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-amber-600"/> Technical Information</h4>
              <p className="text-gray-700">IP address, browser type, device information, activity logs, cookies, and approximate technical location.</p>
            </div>
          </div>
        </section>

        {/* Section 2 & 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            2. Purpose of Processing &amp; 3. Consent Principles
          </h2>
          <p>
            We use personal data to create and manage accounts, publish provider profiles, facilitate direct pilgrim-to-provider communications, respond to enquiries, verify credentials, improve search recommendations, prevent fraud, maintain cybersecurity, and comply with legal obligations.
          </p>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2 text-xs text-amber-950">
            <h4 className="font-bold text-[#4A2E1A]">Consent &amp; Withdrawal under DPDP Act 2023</h4>
            <p>
              Where consent is required as the legal basis for processing, we will seek consent in a clear and understandable manner. You may withdraw consent at any time through your account settings or by contacting our Privacy Cell. Withdrawal of consent may affect our ability to provide certain features where processing is necessary.
            </p>
          </div>
        </section>

        {/* Section 4, 5 & 6 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            4. Public Provider Info | 5. Data Sharing | 6. Direct Provider Contact
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <p><strong>Public Provider Information:</strong> Information intended for a public business profile (business name, category, service area, public phone, photos, operating hours, reviews) will be publicly displayed. Providers should not submit private or sensitive personal information for public display.</p>
            <p><strong>Sharing of Information:</strong> We share data only where necessary with hosting infrastructure, analytics, verification services, payment gateways, and legal authorities where required by law. We do not sell personal data for monetary consideration.</p>
            <p><strong>Service Provider Direct Communications:</strong> When a visitor uses Call, WhatsApp, or enquiry buttons, direct communication occurs with the provider. Information shared directly is subject to the provider&apos;s independent practices.</p>
          </div>
        </section>

        {/* Section 7, 8, 9 & 10 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            7. Cookies | 8. Location | 9. Security | 10. Data Retention
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <p><strong>Cookies &amp; Location:</strong> We use cookies for authentication, session security, and preferences. Geolocation permissions are requested strictly for displaying nearby places, ride navigation, and local services.</p>
            <p><strong>Data Security:</strong> We employ reasonable technical and organizational security measures (encrypted storage, HTTPS, access logs) to prevent unauthorized access, loss, alteration, or disclosure of data.</p>
            <p><strong>Data Retention:</strong> We retain personal information only for as long as reasonably necessary to fulfill processing purposes, maintain records, resolve disputes, prevent fraud, and comply with statutory laws.</p>
          </div>
        </section>

        {/* Section 11 & 12 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            11. User Rights &amp; 12. Children&apos;s Privacy
          </h2>
          <p>Subject to applicable law, users possess statutory rights under the DPDP Act 2023, including:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-xs">
            <li>Right to access summary of personal data processed</li>
            <li>Right to correction, completion, and updating of inaccurate data</li>
            <li>Right to erasure / deletion of personal data when no longer required</li>
            <li>Right of grievance redressal provided by Data Fiduciary</li>
            <li>Right to nominate an individual in event of death or incapacity</li>
          </ul>
          <p className="text-xs text-gray-600">
            Gaya Seva is not intentionally designed to collect personal information from children without appropriate parental/guardian consent where required by law.
          </p>
        </section>

        {/* Section 13, 14, 15 & 16 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            13. External Links | 14. UGC Disclosures | 15. Fraud | 16. Security Incidents
          </h2>
          <div className="bg-red-50/70 p-4 rounded-xl border border-red-200 text-xs text-red-950 space-y-1.5">
            <h4 className="font-bold text-red-950">Sensitive Data Notice for User Submissions (Section 14)</h4>
            <p>Do NOT upload or publish: Passwords, OTPs, Bank PINs, Credit/Debit Card Security Codes, Aadhaar numbers (unless through explicit, lawful verification forms), or unverified private details of third parties.</p>
          </div>
          <p className="text-xs text-gray-700">
            <strong>Security Incidents (Section 16):</strong> If a security incident involving personal data occurs, Gaya Seva will take immediate steps required under applicable law, including containment, investigation, and statutory notifications to affected individuals and authorities.
          </p>
        </section>

        {/* Divider for Constitutional Framework */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-amber-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-amber-800 font-bold tracking-wider">Constitutional Privacy &amp; Legal Framework</span></div>
        </div>

        {/* Constitutional Privacy Clause */}
        <section className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200 space-y-4">
          <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-base border-b border-amber-200 pb-2">
            <Scale className="w-5 h-5 text-[#F58220]" />
            <span>Constitutional Privacy and Legal Compliance Clause</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Gaya Seva respects the constitutional values of privacy, personal liberty, equality and freedom applicable under the Constitution of India and processes personal data in accordance with applicable Indian data-protection and information-technology laws.
          </p>
          <p className="text-xs text-amber-950 font-semibold bg-white p-3 rounded-xl border border-amber-300">
            The Supreme Court of India has recognized Privacy as a constitutionally protected fundamental right under Article 21 of the Constitution (Justice K.S. Puttaswamy v. Union of India), subject to the applicable legal framework.
          </p>
          <div className="space-y-2 text-xs text-gray-700">
            <p><strong>Conflict With Applicable Law:</strong> If any provision of this Privacy Policy is inconsistent with a mandatory requirement of applicable law (including DPDP Act 2023 or DPDP Rules 2025), the mandatory legal requirement shall prevail to the extent of that inconsistency.</p>
          </div>
        </section>

        {/* Section 18: Grievance Officer & Contact */}
        <section className="bg-[#2A180B] text-white p-6 rounded-2xl border border-[#F58220]/40 space-y-4">
          <div className="flex items-center gap-2 text-[#F6C343] font-serif font-bold text-base">
            <Mail className="w-5 h-5 text-[#F58220]" />
            <span>18. Data Protection Officer &amp; Privacy Contact</span>
          </div>
          <p className="text-xs text-[#F8F6EF]/90">
            For privacy queries, data access requests, consent withdrawal, or privacy complaints under DPDP Act 2023, reach out to our designated Privacy Cell:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-[#F6C343] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Privacy Cell Email:</p>
                <a href="mailto:privacy@gayaseva.org" className="text-[#F6C343] underline">privacy@gayaseva.org</a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-[#F6C343] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Grievance Officer Email:</p>
                <a href="mailto:grievance@gayaseva.org" className="text-[#F6C343] underline">grievance@gayaseva.org</a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-[#F6C343] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Helpline Phone:</p>
                <a href="tel:+918544491413" className="text-[#F6C343]">+91 85444 91413</a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#F6C343] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Registered Entity Office:</p>
                <p className="text-white/80">GayaSeva Digital Platform, Vishnupad Temple Corridor, Gaya, Bihar - 823001, India</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 19 & 20 */}
        <section className="text-center pt-2 text-xs text-gray-500 font-medium">
          <p>19. Governing Law: This Privacy Policy shall be governed by the laws of India. 20. By continuing to use Gaya Seva, you acknowledge that you have read this Privacy Policy.</p>
        </section>

      </div>
    </div>
  );
}

