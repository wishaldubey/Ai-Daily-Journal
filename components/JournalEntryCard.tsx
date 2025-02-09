'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Image } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  date: string;
  userInput: string;
  aiStory: string;
  imageUrl?: string;
}

export default function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      const entryRef = doc(db, `users/${user.uid}/journalEntries/${entry.id}`);
      await deleteDoc(entryRef);
      toast.success('Entry deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{
      backgroundImage: "linear-gradient(to right, #f8f5e9 1px, transparent 1px), linear-gradient(to bottom, #f8f5e9 1px, transparent 1px)",
      backgroundSize: "20px 20px"
    }}>
      <CardHeader className="border-b border-amber-100">
        <CardTitle className="flex items-center justify-between text-amber-900">
          <span className="font-serif">{format(new Date(entry.date), 'MMMM d, yyyy')}</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/edit-entry/${entry.id}`)}
              className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this journal entry? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <div className="space-y-4">
          {entry.imageUrl && (
            <div className="mb-4">
              <img src={entry.imageUrl} alt="Journal entry" className="w-full h-48 object-cover rounded-lg" />
            </div>
          )}
          <div>
            <h3 className="font-serif text-lg text-amber-900 mb-2">Your Entry</h3>
            <p className="text-amber-800">{entry.userInput}</p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-amber-900 mb-2">AI Story</h3>
            <p className="text-amber-800 italic">{entry.aiStory}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}