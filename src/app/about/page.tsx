import { Metadata } from 'next';
import { AboutPageView } from '@/components/AboutPageView';

export const metadata: Metadata = {
  title: 'About KinCloth | We Set The Standard',
  description: 'KinCloth is a culture-driven streetwear brand focused on well-fitted essentials and statement pieces. Built for those who lead, never follow.',
};

export default function AboutPage() {
  return <AboutPageView />;
}
