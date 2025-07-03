import SingupScreen from './screen/singup-screen';
import { Metadata } from 'next';
import { constructMetadata } from '@/configs';

export const metadata: Metadata = constructMetadata({
  title: 'Signup - Notiqo',
  description: 'Signup to your Notiqo account',
  canonical: '/signup',
});

export default function SignupPage() {
  return <SingupScreen />;
}
