import SingupScreen from './screen/singup-screen';
import { Metadata } from 'next';
import { constructMetadata } from '@/configs';

export const metadata: Metadata = constructMetadata({
  title: 'Signup - Dozevo',
  description: 'Signup to your Dozevo account',
  canonical: '/signup',
});

export default function SignupPage() {
  return <SingupScreen />;
}
