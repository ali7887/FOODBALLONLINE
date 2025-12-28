'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';

interface Team {
  _id: string;
  name: string;
  persianName?: string;
  logo?: string;
}

interface MatchMenu {
  food: string;
  spiceLevel: number;
  image?: string;
  description?: string;
  prepTime?: number;
  votes?: number;
}

interface FeaturedMatchMenuProps {
  match?: {
    _id: string;
    homeClub: Team;
    awayClub: Team;
    matchMenu?: MatchMenu;
  };
}

export function FeaturedMatchMenu({ match }: FeaturedMatchMenuProps) {
  if (!match || !match.matchMenu) {
    return null;
  }

  return (
    <section className="py-16 bg-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="منوی بازی امروز"
            subtitle="غذایی که با این بازی میچسبه"
            icon="🍽️"
            centered
          />

          {/* Feature Card */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Food Image */}
              <div className="relative h-64 md:h-full min-h-[300px]">
                {match.matchMenu.image ? (
                  <Image
                    src={match.matchMenu.image}
                    alt={match.matchMenu.food}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                    <span className="text-8xl">🍽️</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Spice Level Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-full flex items-center gap-1">
                  {Array.from({ length: match.matchMenu.spiceLevel }).map((_, i) => (
                    <span key={i} className="text-lg">🌶️</span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  {match.homeClub.logo ? (
                    <div className="w-8 h-8 relative">
                      <Image src={match.homeClub.logo} alt="" fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span>🏟️</span>
                    </div>
                  )}
                  <span className="text-gray-400">VS</span>
                  {match.awayClub.logo ? (
                    <div className="w-8 h-8 relative">
                      <Image src={match.awayClub.logo} alt="" fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span>🏟️</span>
                    </div>
                  )}
                </div>

                <h3 className="text-3xl font-bold mb-3" dir="rtl">
                  {match.matchMenu.food}
                </h3>

                {match.matchMenu.description && (
                  <p className="text-gray-600 leading-relaxed mb-6" dir="rtl">
                    {match.matchMenu.description}
                  </p>
                )}

                <div className="space-y-4">
                  {match.matchMenu.prepTime && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock size={16} />
                      <span dir="rtl">زمان آماده‌سازی: {match.matchMenu.prepTime} دقیقه</span>
                    </div>
                  )}

                  {match.matchMenu.votes !== undefined && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Users size={16} />
                      <span dir="rtl">{match.matchMenu.votes} نفر این را پسندیدند</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                  <Link href={`/matches/${match._id}/menu`} className="flex-1">
                    <Button className="w-full py-3 bg-tm-green text-white rounded-lg font-bold hover:bg-tm-green/90 transition">
                      دستور پخت
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition"
                    dir="rtl"
                  >
                    پیشنهاد خودم
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

