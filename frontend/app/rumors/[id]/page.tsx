import { RumorDetailPage } from '@/components/pages/RumorDetailPage';

export default function Page({ params }: { params: { id: string } }) {
  return <RumorDetailPage rumorId={params.id} />;
}

