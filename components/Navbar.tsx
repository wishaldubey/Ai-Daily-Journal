'use client';

import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { BookOpenText, LogOut, PenLine } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpenText className="h-6 w-6" />
            <span className="text-xl font-semibold">Daily Journal</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/new-entry">
              <Button variant="outline" size="sm">
                <PenLine className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}