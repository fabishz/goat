"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Crown, Trophy, GitCompare, Vote, User, Menu, X, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentCategoryId } = useAppStore();

  const navItems = [
    { path: '/', label: 'Home', icon: Crown },
    { path: '/categories', label: 'Rankings', icon: Trophy },
    {
      path: currentCategoryId ? `/categories/${currentCategoryId}/compare` : '/categories',
      label: 'Compare',
      icon: GitCompare
    },
    {
      path: currentCategoryId ? `/categories/${currentCategoryId}/compare` : '/categories',
      label: 'Vote',
      icon: Vote
    },
    {
      path: currentCategoryId ? `/categories/${currentCategoryId}/debates` : '/categories',
      label: 'Debates',
      icon: MessageSquare
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="text-accent"
            >
              <Crown className="w-8 h-8" />
            </motion.div>
            <span className="font-serif text-xl font-bold gold-text">
              GOAT Rankings
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.label} href={item.path}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        'relative px-4 py-2 font-medium transition-colors',
                        isActive
                          ? 'text-accent'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                          initial={false}
                        />
                      )}
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-accent/30 hover:border-accent hover:bg-accent/10">
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/vote">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow">
                Vote Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start',
                        isActive && 'bg-accent/10 text-accent'
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border flex gap-2">
                <Link href="/dashboard" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/vote" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-accent text-accent-foreground">
                    Vote Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
