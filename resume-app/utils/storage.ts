import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedResume, ResumeData } from '../types';
import { generateId } from './helpers';

const STORAGE_KEY = '@resume_hub_saved_resumes';
const MAX_RESUMES = 5;

export async function getSavedResumes(): Promise<SavedResume[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const resumes: SavedResume[] = JSON.parse(json);
    return resumes.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export async function saveResume(
  data: ResumeData,
  template: string,
  existingId?: string
): Promise<SavedResume> {
  const resumes = await getSavedResumes();
  const now = Date.now();

  if (existingId) {
    const idx = resumes.findIndex((r) => r.id === existingId);
    if (idx !== -1) {
      resumes[idx] = {
        ...resumes[idx],
        data,
        template,
        updatedAt: now,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
      return resumes[idx];
    }
  }

  if (resumes.length >= MAX_RESUMES) {
    throw new Error(`You can save up to ${MAX_RESUMES} resumes. Please delete one first.`);
  }

  const newResume: SavedResume = {
    id: generateId(),
    name: data.personalInfo.fullName || 'Untitled Resume',
    template,
    data,
    createdAt: now,
    updatedAt: now,
  };

  resumes.unshift(newResume);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  return newResume;
}

export async function deleteResume(id: string): Promise<void> {
  const resumes = await getSavedResumes();
  const filtered = resumes.filter((r) => r.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export async function getResumeCount(): Promise<number> {
  const resumes = await getSavedResumes();
  return resumes.length;
}
