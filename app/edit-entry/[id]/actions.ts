'use server';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateStory } from '@/lib/gemini';
import { revalidatePath } from 'next/cache';

// Fetch Journal Entry
export async function fetchEntryData(id: string, user: any) {
  if (!user) return null;

  try {
    const entryRef = doc(db, `users/${user.uid}/journalEntries/${id}`);
    const entrySnap = await getDoc(entryRef);

    return entrySnap.exists() ? (entrySnap.data() as { userInput: string; aiStory: string }) : null;
  } catch (error) {
    console.error('Error fetching entry:', error);
    return null;
  }
}

// Update Journal Entry
export async function handleUpdateEntry(id: string, userInput: string, user: any) {
  if (!user) return;

  try {
    const aiStory = await generateStory(userInput);
    const entryRef = doc(db, `users/${user.uid}/journalEntries/${id}`);

    await updateDoc(entryRef, { userInput, aiStory });

    revalidatePath('/');
  } catch (error) {
    console.error('Error updating entry:', error);
    throw new Error('Failed to update journal entry');
  }
}
