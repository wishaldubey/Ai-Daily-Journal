'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateStory } from '@/lib/gemini';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function NewEntryPage() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const aiStory = await generateStory(userInput);

      const entryRef = doc(db, `users/${user.uid}/journalEntries/${today}`);
      await setDoc(entryRef, {
        date: today,
        userInput,
        aiStory,
      });

      toast.success('Journal entry created successfully');
      router.push('/');
    } catch (error) {
      console.error('Error creating entry:', error);
      toast.error('Failed to create journal entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Card className="bg-white shadow-xl" style={{
        backgroundImage: "linear-gradient(to right, #f8f5e9 2px, transparent 2px), linear-gradient(to bottom, #f8f5e9 2px, transparent 2px)",
        backgroundSize: "30px 30px"
      }}>
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-amber-900 text-center">New Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-serif text-amber-900">
                What's on your mind today?
              </label>
              <Textarea
                placeholder="Share your thoughts, experiences, or feelings..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={6}
                required
                className="resize-none border-amber-200 focus:border-amber-400 focus:ring-amber-400"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creating Entry...' : 'Create Entry'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}