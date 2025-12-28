'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usersApi } from '@/lib/api/users';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserStatsGrid } from '@/components/profile/UserStatsGrid';
import { UserBadgesGrid } from '@/components/profile/UserBadgesGrid';
import { UserActivityList } from '@/components/profile/UserActivityList';
import type { UserPublicProfile } from '@/types/user';
import { useRouter } from 'next/navigation';

interface UserProfilePageProps {
  username: string;
}

export function UserProfilePage({ username }: UserProfilePageProps) {
  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await usersApi.getPublicProfile({ username });
      setProfile(response.profile);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        router.push('/404');
      }
    } finally {
      setLoading(false);
    }
  }, [username, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container space-y-6">
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-reverse space-x-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <Card className="border-gray-200">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-gray-600">کاربر پیدا نشد</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container space-y-6">
        {/* Profile Header */}
        <ProfileHeader profile={profile} />

        {/* Stats Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">آمار</h2>
          <UserStatsGrid stats={profile.stats} />
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">نشان‌ها</h2>
          <UserBadgesGrid badges={profile.badges} />
        </div>

        {/* Recent Activities */}
        <div>
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-900">فعالیت‌های اخیر</CardTitle>
              <CardDescription>آخرین فعالیت‌های {profile.displayName || profile.username}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <UserActivityList
                username={username}
                initialActivities={profile.recentActivities}
                showFilter={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

