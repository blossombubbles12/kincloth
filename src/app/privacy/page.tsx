import { Metadata } from 'next';
import { LegalPageView } from '@/components/LegalPageView';

export const metadata: Metadata = {
  title: 'Privacy Policy | KinCloth',
  description: 'How we handle, store, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <LegalPageView title="Privacy Policy" lastUpdated="April 28, 2026">
      <h2>1. The Information We Collect</h2>
      <p>When you interact with KinCloth, we gather only what's necessary to process your orders, prevent fraud, and keep you informed about new drops. This includes your name, email address, shipping destination, and encrypted payment details (handled securely by Stripe, never stored on our servers).</p>
      
      <h2>2. How Your Data Is Used</h2>
      <p>We use your data for one reason: to provide you with the best possible streetwear experience. We do not sell, rent, or lease your personal information to third parties. Your data is used exclusively to fulfill orders, send you shipping updates, and (if you opted in) alert you about limited drops before they sell out.</p>
      
      <h2>3. Cookies & Tracking</h2>
      <p>Our platform uses essential cookies to keep your shopping bag active and remember your preferences. We also use analytics to understand which pieces are getting the most attention, allowing us to plan future drops accordingly. You can disable non-essential cookies via your browser settings at any time.</p>
      
      <h2>4. Data Security</h2>
      <p>We employ enterprise-grade encryption (256-bit AES) to protect your data in transit and at rest. While no system is 100% impenetrable, we adhere to strict, zero-trust security protocols to ensure your information remains secure.</p>
      
      <h2>5. Your Rights</h2>
      <p>You own your data. At any time, you can request a full export of the personal information we hold, or request that we permanently delete your account and associated data. To do so, drop us a line via our <a href="/contact">Contact Page</a>.</p>
    </LegalPageView>
  );
}
