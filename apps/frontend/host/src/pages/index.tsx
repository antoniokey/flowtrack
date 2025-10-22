import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import('landing/LandingPage'), { ssr: false });

export default function HomePage() {
  return (
    <LandingPage />
  );
}
