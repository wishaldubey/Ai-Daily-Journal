'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { fetchEntryData, handleUpdateEntry } from './actions'; // Import server actions
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditEntryPage({ params }: { params: { id: string } }) {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadEntry = async () => {
      setInitialLoading(true);
      if (!user) {
        setInitialLoading(false);
        return;
      }

      try {
        const entry = await fetchEntryData(params.id, user);
        if (entry) {
          setUserInput(entry.userInput);
        } else {
          toast.error('Entry not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching entry:', error);
        toast.error('Failed to fetch entry');
        router.push('/');
      } finally {
        setInitialLoading(false);
      }
    };

    loadEntry();
  }, [user, params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await handleUpdateEntry(params.id, userInput, user);
      toast.success('Journal entry updated successfully');
      router.push('/');
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error('Failed to update journal entry');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Update your entry</label>
              <Textarea
                placeholder="Share your thoughts, experiences, or feelings..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={6}
                required
                className="resize-none"
              />
            </div>
            <Button type="submit" disabled={loading || !userInput.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Updating Entry...' : 'Update Entry'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
