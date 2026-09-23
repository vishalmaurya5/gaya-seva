'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, FileText, AlertTriangle, CheckCircle2, Lock, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-xs sm:text-sm text-gray-800 font-sans">
      {/* Header Banner */}
      <div className="bg-[#2A180B] text-white p-8 rounded-3xl shadow-xl border border-[#F58220]/30 space-y-3">
        <div className="flex items-center gap-2 text-[#F6C343] font-semibold text-xs uppercase tracking-wider">
          <Scale className="w-4 h-4 text-[#F58220]" />
          <span>LEGAL AGREEMENT &amp; TERMS OF SERVICE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Gaya Seva — Terms &amp; Conditions</h1>
        <p className="text-xs text-[#F8F6EF]/80">
          Last Updated: 23 September 2026 • Governed by the Laws &amp; Constitution of India
        </p>
      </div>

      {/* Important Legal Notice Box */}
      <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-5 space-y-2 text-amber-900">
        <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Notice &amp; Acceptance</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-900/90">
          Welcome to Gaya Seva (&quot;Gaya Seva&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;). Gaya Seva is a digital platform intended to help visitors discover places, religious services, accommodation, transportation, food, tourism services, healthcare information and other local services in Gaya and surrounding areas.
        </p>
        <p className="text-xs font-semibold text-amber-950">
          By accessing or using our website, registering an account, submitting a listing, contacting a service provider, or using any service made available through Gaya Seva, you agree to these Terms &amp; Conditions. If you do not agree with these Terms, please do not use the website.
        </p>
      </div>

      {/* Terms Body */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            1. Nature of the Platform
          </h2>
          <p>Gaya Seva primarily operates as an information, discovery and connection platform.</p>
          <p>We may provide information about:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-orange-50/50 p-4 rounded-xl border border-orange-100">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> Temples and religious places</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> Pind Daan and religious service providers</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> Hotels and accommodation</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> Tour and travel operators</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> Taxi, auto and e-rickshaw providers</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> Restaurants and food services</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> Tourist attractions and Guides</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> Hospitals, clinics and pharmacies</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> ATMs, banks and essential facilities</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0"/> Other local businesses and services</li>
          </ul>
          <p className="text-xs text-gray-600 italic">
            Unless expressly stated otherwise, Gaya Seva is not the owner, operator, employer, agent, representative or service provider of the third-party businesses listed on the platform. A listing on Gaya Seva does not automatically mean that Gaya Seva endorses, guarantees or recommends that provider.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            2. Third-Party Service Providers
          </h2>
          <p>Service providers may independently register and create profiles on Gaya Seva. These may include Pandits, hotels, drivers, tour operators, guides, restaurants, shops and other businesses. The agreement for any service is generally between the visitor/customer and the service provider.</p>
          <p className="font-semibold text-gray-900">Gaya Seva is not responsible for:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>The quality of a third-party service</li>
            <li>The conduct of a service provider or customer</li>
            <li>Pricing agreed between parties</li>
            <li>Availability of a service, delays or cancellations</li>
            <li>Personal disputes, property damage, loss of belongings, or injuries</li>
            <li>Misrepresentation by a provider or failure to provide a promised service</li>
            <li>Refunds or payments made directly between users and providers</li>
          </ul>
          <p className="text-xs text-amber-900 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            Users should independently verify important information before making payments or entering into an agreement.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            3. Provider Registration
          </h2>
          <p>A service provider may register subject to applicable registration requirements. Providers must provide accurate and current information.</p>
          <p className="font-semibold text-red-900">A provider must NOT:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Create a fake business profile or impersonate another person or business</li>
            <li>Use another person&apos;s phone number without authorization</li>
            <li>Submit false documents or publish misleading prices</li>
            <li>Claim qualifications they do not possess</li>
            <li>Publish false reviews or misrepresent services</li>
            <li>Upload copyrighted material without permission</li>
            <li>Use Gaya Seva for unlawful activities</li>
          </ul>
          <p>Gaya Seva may request documents or additional information for verification. We may approve, reject, suspend, modify or remove a provider profile at our discretion where permitted by law.</p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            4. Verification (&quot;Gaya Seva Verified&quot; Badge)
          </h2>
          <p>
            A <span className="font-semibold text-emerald-700">&quot;Gaya Seva Verified&quot;</span> badge means that Gaya Seva has completed the verification process applicable to that listing at the relevant time.
          </p>
          <p>Verification does not constitute a guarantee of service quality, safety, professional competence, future conduct, pricing, availability, or legal compliance beyond the scope of the verification performed. Verification status may be suspended or withdrawn if information becomes inaccurate or if concerns arise.</p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            5. Prohibited Activities
          </h2>
          <p>Users and providers must not use Gaya Seva for unlawful, fraudulent, abusive or harmful purposes. Prohibited activities include, without limitation:</p>
          <div className="bg-red-50/70 p-4 rounded-xl border border-red-200 text-xs text-red-950 space-y-1.5">
            <p>• Fraud, cheating, identity theft, or impersonation</p>
            <p>• Harassment, threats, extortion, blackmail, sexual exploitation, or human trafficking</p>
            <p>• Illegal gambling, sale/promotion of illegal drugs, sale of prohibited weapons, or money laundering</p>
            <p>• Phishing, hacking, malware distribution, or unauthorized access to accounts/systems</p>
            <p>• Fake bookings intended to cause loss, fake reviews, manipulation of ratings, spam, or scams</p>
            <p>• Misleading advertisements, copyright/trademark infringement, or uploading unlawful content</p>
            <p>• Any activity prohibited by applicable Indian law</p>
          </div>
          <p className="text-xs text-gray-600">
            Gaya Seva may restrict, suspend or terminate accounts and listings involved in prohibited activities and may cooperate with law-enforcement authorities where legally required or permitted.
          </p>
        </section>

        {/* Section 6 & 7 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            6. User-Generated Content &amp; 7. Reviews &amp; Ratings
          </h2>
          <p>
            Users and providers may submit photos, reviews, descriptions, business information, comments, videos, and other content. By submitting content, you represent that you have the right to submit it, it is accurate, does not violate applicable law, does not infringe another person&apos;s rights, and is not defamatory or misleading.
          </p>
          <p>
            You grant Gaya Seva a non-exclusive, royalty-free, worldwide licence to host, reproduce, display, format and distribute such content for operating, improving and promoting the platform, subject to applicable law and our Privacy Policy.
          </p>
          <p className="font-semibold text-gray-900">Reviews &amp; Ratings Rules:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Reviews should represent genuine experiences.</li>
            <li>Users must not purchase/sell reviews or create multiple accounts to manipulate ratings.</li>
            <li>Users must not post reviews for competitors without genuine experience, threaten providers in exchange for reviews, or post defamatory content.</li>
            <li>Gaya Seva may remove or restrict reviews that violate these Terms or applicable law.</li>
          </ul>
        </section>

        {/* Section 8, 9 & 10 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            8. Prices &amp; Bookings | 9. Religious Services | 10. Healthcare Information
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <p>
              <strong>Prices, Payments &amp; Bookings:</strong> Unless specifically stated otherwise, Gaya Seva does not control prices charged by third-party providers. Prices, availability, taxes, cancellation policies and commercial terms should be confirmed directly with the provider.
            </p>
            <p>
              <strong>Religious Services Disclaimer:</strong> Information relating to Pind Daan, Shraddha, Puja and other religious practices is provided for informational and discovery purposes. Gaya Seva does not determine religious validity, ritual requirements or the appropriate religious procedure for an individual. Users should discuss religious requirements directly with their chosen Pandit or qualified religious authority. Gaya Seva does not guarantee the outcome of any religious ritual or service.
            </p>
            <p>
              <strong>Healthcare Information Disclaimer:</strong> Healthcare listings and information are provided for discovery and convenience. Gaya Seva does not provide medical diagnosis, treatment or medical advice through its directory. Users should contact qualified medical professionals and emergency services directly when appropriate.
            </p>
          </div>
        </section>

        {/* Section 11, 12, 13 & 14 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            11. Accuracy, External Links, Security &amp; Termination
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
            <li><strong>Accuracy of Information:</strong> We attempt to keep information useful and current, but local business information can change. Users should confirm important details directly with the provider.</li>
            <li><strong>External Links:</strong> Gaya Seva may contain links to third-party websites or maps. Gaya Seva does not control those external websites and is not responsible for their content or security.</li>
            <li><strong>Account Security:</strong> Users are responsible for maintaining the confidentiality of their login credentials and must immediately notify Gaya Seva of any unauthorized access.</li>
            <li><strong>Suspension &amp; Termination:</strong> Gaya Seva may suspend, restrict or terminate access where reasonably necessary because of Terms violations, fraud, illegal activity, security concerns, false info, court orders, or platform abuse.</li>
          </ul>
        </section>

        {/* Section 15, 16, 17, 18 & 19 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A2E1A] border-b border-amber-100 pb-2">
            15. IP | 16. Limitation of Liability | 17. Indemnity | 18. Changes | 19. Governing Law
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <p><strong>Intellectual Property:</strong> The Gaya Seva name, logo, website design, original text, graphics, and software are protected by applicable IP laws. Scraping, unauthorized copying or commercial exploitation is strictly prohibited.</p>
            <p><strong>Limitation of Liability:</strong> To the maximum extent permitted by applicable law, Gaya Seva and its owners/affiliates will not be responsible for indirect, incidental, special, consequential or punitive losses arising from third-party services, user interactions, cancellations, travel delays, or personal injury/property loss caused by third parties.</p>
            <p><strong>Indemnification:</strong> You agree to indemnify and hold harmless Gaya Seva from claims, losses, liabilities, and expenses arising from your violation of these Terms, unlawful conduct, submitted content, or misrepresentation.</p>
            <p><strong>Governing Law &amp; Jurisdiction:</strong> These Terms shall be governed by the laws applicable in India. Subject to applicable law, disputes shall be subject to the jurisdiction of the competent courts having jurisdiction over Gaya, Bihar, India.</p>
          </div>
        </section>

        {/* Divider for Constitutional Clauses */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-amber-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-amber-800 font-bold tracking-wider">Constitutional &amp; Statutory Framework</span></div>
        </div>

        {/* Constitutional & Legal Compliance Clauses */}
        <section className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200 space-y-4">
          <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-base border-b border-amber-200 pb-2">
            <Scale className="w-5 h-5 text-[#F58220]" />
            <span>Constitutional and Legal Compliance Framework</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Gaya Seva operates in India and shall function subject to the Constitution of India, applicable Central and State laws, rules, regulations, judicial orders and lawful directions of competent authorities. Nothing in these Terms is intended to restrict or waive any right that cannot lawfully be restricted or waived.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs text-gray-800">
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <h4 className="font-bold text-[#4A2E1A]">1. Equality and Non-Discrimination (Art. 14)</h4>
              <p className="text-gray-600">Gaya Seva aims to provide its platform without unlawful discrimination. Users and providers must not use the platform to promote unlawful discrimination or denial of services.</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <h4 className="font-bold text-[#4A2E1A]">2. Freedom of Speech &amp; Expression (Art. 19(1)(a))</h4>
              <p className="text-gray-600">Recognises lawful rights to express opinions and reviews. However, content remains subject to restrictions against unlawful content, fraud, defamation, and incitement.</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <h4 className="font-bold text-[#4A2E1A]">3. Freedom of Trade &amp; Profession (Art. 19(1)(g))</h4>
              <p className="text-gray-600">Providers independently maintain required licenses and permits. Registration on Gaya Seva does not constitute a government licence or professional certification.</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <h4 className="font-bold text-[#4A2E1A]">4. Freedom of Religion (Art. 25)</h4>
              <p className="text-gray-600">Respects freedom of conscience and religion. Gaya Seva does not prescribe, certify or guarantee the religious validity of any ritual, Pind Daan, or Shraddha service.</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <h4 className="font-bold text-[#4A2E1A]">5. Personal Liberty &amp; Privacy (Art. 21)</h4>
              <p className="text-gray-600">Processes personal data in accordance with DPDP Act 2023, DPDP Rules 2025 and Privacy Policy. Prohibits harassment, stalking or threat to safety.</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <h4 className="font-bold text-[#4A2E1A]">6. Lawful Restrictions &amp; Due Diligence</h4>
              <p className="text-gray-600">Measures implemented under IT Rules &amp; applicable central/state statutory provisions to protect platform integrity, security, and statutory compliance.</p>
            </div>
          </div>

          <div className="text-xs text-amber-950 bg-white p-3.5 rounded-xl border border-amber-300 space-y-1">
            <h4 className="font-bold text-[#4A2E1A]">7. No Waiver of Legal Rights &amp; Mandatory Legal Prevalence</h4>
            <p className="text-gray-700">
              Nothing contained in these Terms shall be interpreted as waiving a user&apos;s statutory or constitutional rights, authorizing unlawful activity, or preventing a competent court from exercising powers. Where a provision conflicts with a mandatory provision of applicable Indian law, the mandatory legal provision shall prevail to the extent of the conflict.
            </p>
          </div>

          <div className="text-xs space-y-1 text-gray-700">
            <h4 className="font-bold text-[#4A2E1A]">8. Compliance With Applicable Indian Law</h4>
            <p>
              Users, visitors, providers, and businesses must comply with all laws applicable to their activities, including Information Technology Act &amp; IT Rules, Digital Personal Data Protection Act 2023, Consumer Protection Act, Motor Vehicles Act, Food Safety &amp; Standards Act, Clinical Establishments regulations, and local municipal licensing requirements.
            </p>
          </div>
        </section>

        {/* Section 20: Grievance Officer & Contact */}
        <section className="bg-[#2A180B] text-white p-6 rounded-2xl border border-[#F58220]/40 space-y-4">
          <div className="flex items-center gap-2 text-[#F6C343] font-serif font-bold text-base">
            <HelpCircle className="w-5 h-5 text-[#F58220]" />
            <span>20. Grievance Officer &amp; Official Contact</span>
          </div>
          <p className="text-xs text-[#F8F6EF]/90">
            For complaints relating to listings, unlawful content, privacy issues, account disputes, or IT Rules intermediary grievance redressal, please contact our designated Grievance Desk:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-[#F6C343] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">General &amp; Listing Support:</p>
                <a href="mailto:support@gayaseva.org" className="text-[#F6C343] underline">support@gayaseva.org</a>
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
                <p className="font-bold text-white">Official Helpline:</p>
                <a href="tel:+918544491413" className="text-[#F6C343]">+91 85444 91413</a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#F6C343] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Registered Address:</p>
                <p className="text-white/80">Vishnupad Temple Corridor Zone, Gaya Ji, Bihar - 823001, India</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 21 */}
        <section className="text-center pt-2 text-xs text-gray-500 font-medium">
          <p>21. Acceptance: By continuing to use Gaya Seva, you acknowledge that you have read and understood these Terms &amp; Conditions and agree to comply with them and applicable law.</p>
        </section>

      </div>
    </div>
  );
}

