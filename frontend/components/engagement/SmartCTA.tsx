'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vote, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface SmartCTAProps {
  userStats: {
    hasVoted: boolean;
    hasBadge: boolean;
    hasActivity: boolean;
  };
}

export function SmartCTA({ userStats }: SmartCTAProps) {
  // Determine which CTA to show based on user stats
  const getCTA = () => {
    if (!userStats.hasVoted) {
      return {
        icon: Vote,
        title: 'اولین رأی خود را ثبت کن!',
        description: 'با رأی دادن به ارزش بازاری بازیکنان، امتیاز بگیر و در جدول رتبه‌بندی بالا برو',
        link: '/players',
        buttonText: 'شروع رأی دادن',
        color: 'bg-tm-green',
      };
    }

    if (!userStats.hasBadge) {
      return {
        icon: Award,
        title: 'نشان جدید در دسترس است!',
        description: 'با انجام فعالیت‌ها، نشان‌های جدید کسب کن و دستاوردهایت رو افزایش بده',
        link: '/profile',
        buttonText: 'مشاهده نشان‌ها',
        color: 'bg-tm-lightGreen',
      };
    }

    if (!userStats.hasActivity) {
      return {
        icon: TrendingUp,
        title: 'فعالیت‌های جدید را ببین!',
        description: 'شایعات نقل‌وانتقالات را بررسی کن و روی احتمال‌ها رأی بده',
        link: '/rumors',
        buttonText: 'مشاهده شایعات',
        color: 'bg-tm-green',
      };
    }

    return null;
  };

  const cta = getCTA();

  if (!cta) {
    return null;
  }

  const Icon = cta.icon;

  return (
    <Card className="border-tm-green border-2 bg-gradient-to-br from-tm-green/10 to-white">
      <CardContent className="p-6">
        <div className="flex items-center space-x-reverse space-x-4">
          <div className={`p-3 rounded-lg ${cta.color} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">{cta.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{cta.description}</p>
            <Link href={cta.link}>
              <Button className={`${cta.color} hover:opacity-90 text-white tm-button`}>
                {cta.buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

