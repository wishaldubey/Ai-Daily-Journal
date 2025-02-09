'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import JournalEntryCard from '@/components/JournalEntryCard';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { DatePicker } from '@/components/DatePicker';

interface JournalEntry {
  id: string;
  date: string;
  userInput: string;
  aiStory: string;
  imageUrl?: string;
}

export default function Home() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;

      try {
        const entriesRef = collection(db, `users/${user.uid}/journalEntries`);
        let q = query(entriesRef, orderBy('date', 'desc'));
        
        if (selectedDate) {
          const dateString = format(selectedDate, 'yyyy-MM-dd');
          q = query(entriesRef, where('date', '==', dateString));
        }
        
        const querySnapshot = await getDocs(q);
        const entriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as JournalEntry));
        
        setEntries(entriesData);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user, selectedDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5e9] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8" style={{
          backgroundImage: "linear-gradient(to right, #f8f5e9 2px, transparent 2px), linear-gradient(to bottom, #f8f5e9 2px, transparent 2px)",
          backgroundSize: "30px 30px"
        }}>
          <h1 className="text-4xl font-serif text-amber-900 mb-6 text-center">Your Journal Entries</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <DatePicker
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                placeholderText="Filter by date..."
              />
            </div>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(undefined)}
                className="text-amber-600 hover:text-amber-800"
              >
                Clear filter
              </button>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-serif text-amber-800 mb-4">Welcome to Your Daily Journal</h2>
              <p className="text-amber-600 mb-4">
                Start your journey by adding your first journal entry.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}