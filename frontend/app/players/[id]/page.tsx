import { PlayerDetailPage } from '@/components/pages/PlayerDetailPage';

export default function Page({ params }: { params: { id: string } }) {
  return <PlayerDetailPage playerId={params.id} />;
}

