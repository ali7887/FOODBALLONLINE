'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, TrendingUp, Trophy, User, LogOut, Menu, X, Search, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function NavLink({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: any }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-1.5 text-sm font-medium transition-colors',
        isActive ? 'text-tm-green font-semibold' : 'text-gray-700 hover:text-tm-green'
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </Link>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
    onClose();
    if (typeof window !== 'undefined') {
      alert('با موفقیت از حساب کاربری خارج شدید 👋');
    }
  };

  return (
    <div className="md:hidden border-t border-gray-200 bg-white py-4">
      <nav className="flex flex-col gap-4 px-4">
        <NavLink href="/" icon={Home}>
          خانه
        </NavLink>
        <NavLink href="/players" icon={Users}>
          بازیکنان
        </NavLink>
        <NavLink href="/rumors" icon={TrendingUp}>
          شایعات
        </NavLink>
        <NavLink href="/leaderboard" icon={Trophy}>
          جدول امتیازات
        </NavLink>
        {isAuthenticated && (
          <>
            <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-tm-green">
              <User className="h-4 w-4" />
              <span>پروفایل</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span>خروج</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    if (typeof window !== 'undefined') {
      alert('با موفقیت از حساب کاربری خارج شدید 👋');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white border-b border-gray-200'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="flex items-center gap-1">
              <span className="text-2xl">⚽</span>
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-tm-green">Foodball</span>
              <span className="text-xs text-gray-500">فوتبال با طعم</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/" icon={Home}>
              خانه
            </NavLink>
            <NavLink href="/players" icon={Users}>
              بازیکنان
            </NavLink>
            <NavLink href="/rumors" icon={TrendingUp}>
              شایعات
            </NavLink>
            <NavLink href="/leaderboard" icon={Trophy}>
              جدول امتیازات
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block"
              aria-label="جستجو"
            >
              <Search size={20} className="text-gray-600" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-tm-green text-white">
                          {user?.displayName?.[0] || user?.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown size={16} className="text-gray-600 hidden md:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>پروفایل من</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 ml-2" />
                      <span>خروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Toggle */}
                <button
                  className="md:hidden p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="منوی موبایل"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="default" size="sm" className="bg-tm-green hover:bg-tm-green/90">
                      ورود
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="sm">
                      ثبت‌نام
                    </Button>
                  </Link>
                </div>
                <button
                  className="md:hidden p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="منوی موبایل"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
      </div>
    </header>
  );
}
