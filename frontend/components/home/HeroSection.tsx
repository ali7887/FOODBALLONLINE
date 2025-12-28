'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, TrendingUp, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Team {
  _id: string;
  name: string;
  persianName?: string;
  logo?: string;
  city?: string;
}

interface MatchMenu {
  food: string;
  spiceLevel: number;
  image?: string;
  description?: string;
}

interface HeroSectionProps {
  match?: {
    _id: string;
    homeClub: Team;
    awayClub: Team;
    matchDate: Date | string;
    venue?: string;
    matchTime?: string;
    matchMenu?: MatchMenu;
    hype?: 'high' | 'medium' | 'low';
  };
}

function PredictionButton({
  label,
  value,
  isSelected,
  onClick,
}: {
  label: string;
  value: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'py-3 px-4 rounded-lg font-medium transition-all duration-150',
        isSelected
          ? 'bg-tm-green text-white shadow-lg scale-105'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      )}
      dir="rtl"
    >
      {label}
    </button>
  );
}

export function HeroSection({ match }: HeroSectionProps) {
  const [prediction, setPrediction] = useState<'home' | 'away' | 'draw' | null>(null);

  // If no match, show welcome message
  if (!match) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-tm-green/10 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-6xl">⚽</span>
              <span className="text-6xl">🍽️</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4" dir="rtl">
              به فودبال آنلاین خوش آمدید
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto" dir="rtl">
              پلتفرم داده‌های فوتبال ایران با طعم کباب و پیتزا! بازیکنان را دنبال کن، نقل‌وانتقالات را ببین و برای صدر جدول بجنگ 🏆
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/players">
                <Button size="lg" className="bg-tm-green hover:bg-tm-green/90 text-white">
                  مشاهده بازیکنان
                </Button>
              </Link>
              <Link href="/rumors">
                <Button size="lg" variant="outline" className="border-tm-green text-tm-green hover:bg-tm-green/10">
                  شایعات نقل‌وانتقالات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const matchDate = typeof match.matchDate === 'string' ? new Date(match.matchDate) : match.matchDate;
  const homeTeam = match.homeClub;
  const awayTeam = match.awayClub;

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-tm-green/10 via-white to-yellow-50"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 py-12 md:py-20 relative">
        <div className="max-w-5xl mx-auto">
          {/* Match Badge */}
          {match.hype === 'high' && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold animate-pulse">
                <Flame size={16} />
                <span>بازی داغ امروز</span>
                <Flame size={16} />
              </div>
            </div>
          )}

          {/* Match Info */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2 flex-wrap">
              <Clock size={16} />
              <span>{matchDate.toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              {match.matchTime && (
                <>
                  <span>•</span>
                  <span dir="ltr">{match.matchTime}</span>
                </>
              )}
              {match.venue && (
                <>
                  <span>•</span>
                  <MapPin size={16} />
                  <span>{match.venue}</span>
                </>
              )}
            </div>
          </div>

          {/* Teams Face-off */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center mb-8">
            {/* Home Team */}
            <div className="text-center md:text-right">
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto md:mr-0 mb-3">
                {homeTeam.logo ? (
                  <Image
                    src={homeTeam.logo}
                    alt={homeTeam.persianName || homeTeam.name}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🏟️</span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2" dir="rtl">
                {homeTeam.persianName || homeTeam.name}
              </h2>
              {homeTeam.city && (
                <p className="text-sm md:text-base text-gray-600" dir="rtl">
                  {homeTeam.city}
                </p>
              )}
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-tm-green to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl md:text-2xl">VS</span>
              </div>
              {match.matchTime && (
                <div className="text-xs md:text-sm text-gray-500 font-mono" dir="ltr">
                  {match.matchTime}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="text-center md:text-left">
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto md:ml-0 mb-3">
                {awayTeam.logo ? (
                  <Image
                    src={awayTeam.logo}
                    alt={awayTeam.persianName || awayTeam.name}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🏟️</span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2" dir="rtl">
                {awayTeam.persianName || awayTeam.name}
              </h2>
              {awayTeam.city && (
                <p className="text-sm md:text-base text-gray-600" dir="rtl">
                  {awayTeam.city}
                </p>
              )}
            </div>
          </div>

          {/* Quick Prediction */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200">
            <h3 className="text-center text-lg font-bold mb-4" dir="rtl">
              پیش‌بینی سریع کنید
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <PredictionButton
                label={homeTeam.persianName || homeTeam.name}
                value="home"
                isSelected={prediction === 'home'}
                onClick={() => setPrediction('home')}
              />
              <PredictionButton
                label="مساوی"
                value="draw"
                isSelected={prediction === 'draw'}
                onClick={() => setPrediction('draw')}
              />
              <PredictionButton
                label={awayTeam.persianName || awayTeam.name}
                value="away"
                isSelected={prediction === 'away'}
                onClick={() => setPrediction('away')}
              />
            </div>

            {prediction && (
              <Button className="w-full mt-4 py-3 bg-tm-green text-white rounded-lg font-bold hover:bg-tm-green/90 transition">
                ثبت پیش‌بینی
              </Button>
            )}
          </div>

          {/* Match Menu Teaser */}
          {match.matchMenu && (
            <div className="mt-6 text-center">
              <Link
                href={`/matches/${match._id}/menu`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-50 border border-yellow-300 rounded-full hover:bg-yellow-100 transition group"
              >
                <span className="text-2xl">🍽️</span>
                <div className="text-right">
                  <p className="text-sm font-bold" dir="rtl">
                    {match.matchMenu.food}
                  </p>
                  <p className="text-xs text-gray-600">
                    {Array.from({ length: match.matchMenu.spiceLevel }).map((_, i) => (
                      <span key={i}>🌶️</span>
                    ))}
                  </p>
                </div>
                <TrendingUp size={16} className="text-tm-green group-hover:translate-x-1 transition" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

