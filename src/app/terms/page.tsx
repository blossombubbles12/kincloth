import { Metadata } from 'next';
import { LegalPageView } from '@/components/LegalPageView';

export const metadata: Metadata = {
  title: 'Terms of Service | KinCloth',
  description: 'The rules of engagement when shopping with KinCloth.',
};

export default function TermsPage() {
  return (
    <LegalPageView title="Terms of Service" lastUpdated="April 28, 2026">
      <h2>1. Agreement to Terms</h2>
      <p>By accessing or purchasing from KinCloth ("we", "us", "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you are prohibited from using our site. We reserve the right to update these terms at any time without prior notice.</p>

      <h2>2. Product Availability & Drops</h2>
      <p>All products are subject to availability. Our items are released in "Drops" with strictly limited quantities. Once a piece is sold out, it is permanently archived. Adding an item to your bag does not reserve it; a purchase is only confirmed once checkout is successfully completed.</p>

      <h2>3. Pricing & Payments</h2>
      <p>All prices are listed in USD. We reserve the right to modify prices at our discretion. Payments must be made in full at the time of purchase. We are not responsible for any international transaction fees or currency conversion rates applied by your bank.</p>

      <h2>4. Shipping & Risk of Loss</h2>
      <p>We ship globally. Delivery times are estimates and not guaranteed. The risk of loss and title for items pass to you upon our delivery to the carrier. We are not liable for stolen packages once marked as delivered.</p>

      <h2>5. Returns & Refunds</h2>
      <p>We stand by our product. You have 30 days from delivery to request a return for unworn, unwashed items with original tags attached. Refunds will be issued to the original payment method. Final sale items (including Archives) are non-refundable. For detailed instructions, visit our <a href="/contact">Contact Page</a>.</p>

      <h2>6. Intellectual Property</h2>
      <p>All content, designs, graphics, and logos on this site are the exclusive property of KinCloth. Unauthorized reproduction, distribution, or resale of our products or designs will be met with immediate legal action.</p>
    </LegalPageView>
  );
}
