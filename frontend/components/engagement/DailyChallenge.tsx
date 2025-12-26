'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Target, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface DailyChallengeProps {
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    type: 'vote' | 'view' | 'profile';
    target: number;
    current: number;
    reward: number;
    completed: boolean;
  }>;
  onComplete?: (challengeId: string) => void;
}

export function DailyChallenge({ challenges, onComplete }: DailyChallengeProps) {
  const activeChallenge = useMemo(() => {
    return challenges.find(c => !c.completed) || challenges[0];
  }, [challenges]);

  const progressPercentage = activeChallenge
    ? Math.min(100, (activeChallenge.current / activeChallenge.target) * 100)
    : 0;

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return <Target className="h-5 w-5 text-tm-green" />;
      case 'view':
        return <Trophy className="h-5 w-5 text-tm-green" />;
      case 'profile':
        return <CheckCircle className="h-5 w-5 text-tm-green" />;
      default:
        return <Target className="h-5 w-5 text-tm-green" />;
    }
  };

  const getChallengeLink = (type: string) => {
    switch (type) {
      case 'vote':
        return '/players';
      case 'view':
        return '/rumors';
      case 'profile':
        return '/profile';
      default:
        return '/';
    }
  };

  if (!activeChallenge) {
    return null;
  }

  return (
    <Card className="border-gray-200 bg-gradient-to-br from-tm-green/5 to-white">
      <CardHeader className="bg-tm-green text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-2">
            <Target className="h-5 w-5" />
            <CardTitle>چالش روزانه</CardTitle>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            امروز
          </Badge>
        </div>
        <CardDescription className="text-white/90 mt-2">
          {activeChallenge.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-reverse space-x-3">
            <div className="p-2 bg-tm-green/10 rounded-lg">
              {getChallengeIcon(activeChallenge.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{activeChallenge.title}</h3>
              <p className="text-sm text-gray-600">
                {activeChallenge.current} / {activeChallenge.target} تکمیل شده
              </p>
            </div>
            {activeChallenge.completed ? (
              <Badge className="bg-tm-green text-white">
                <CheckCircle className="h-3 w-3 ml-1" />
                تکمیل شد
              </Badge>
            ) : (
              <Badge variant="outline" className="border-tm-green text-tm-green">
                +{activeChallenge.reward} امتیاز
              </Badge>
            )}
          </div>

          {!activeChallenge.completed && (
            <>
              <Progress value={progressPercentage} className="h-2" />
              <Link href={getChallengeLink(activeChallenge.type)}>
                <Button className="w-full bg-tm-green hover:bg-tm-green/90 text-white tm-button">
                  شروع چالش
                </Button>
              </Link>
            </>
          )}

          {activeChallenge.completed && (
            <div className="text-center py-2">
              <p className="text-sm text-gray-600">
                🎉 چالش امروز تکمیل شد! فردا چالش جدیدی منتظرته
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

