import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const LandingPage = dynamic(() => import('landing/LandingPage'), { ssr: false });

export default function HomePage() {
  const router = useRouter();

  return <LandingPage router={router} />;
}
