import TrackingElements from "./TrackingElements";

interface TrackingPageProps {
  params: Promise<{ number: string }>;
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { number } = await params;
  return <TrackingElements trackingNumber={number} />;
}
