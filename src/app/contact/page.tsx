import { Metadata } from 'next';
import { ContactPageView } from '@/components/ContactPageView';

export const metadata: Metadata = {
  title: 'Holla At Us | Contact KinCloth',
  description: 'Get in touch with KinCloth for support, press, or general inquiries.',
};

export default function ContactPage() {
  return <ContactPageView />;
}
