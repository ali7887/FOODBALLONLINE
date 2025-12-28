import { UserProfilePage } from '@/components/pages/UserProfilePage';

export default function Page({ params }: { params: { username: string } }) {
  return <UserProfilePage username={params.username} />;
}

