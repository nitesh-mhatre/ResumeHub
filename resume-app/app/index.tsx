import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from '../components/WelcomeScreen';
import TemplateSelector from '../components/TemplateSelector';
import ResumeEditor from '../components/ResumeEditor';
import { ResumeData, TemplateType, AppStep, SavedResume } from '../types';
import { INITIAL_RESUME } from '../constants';
import { getSavedResumes, saveResume, deleteResume } from '../utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  // Check onboarding state
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const done = await AsyncStorage.getItem('@resume_hub_onboarding_done');
        if (!done) {
          router.replace('/onboarding');
          return;
        }
      } catch {}
      setOnboardingChecked(true);
    };
    checkOnboarding();
  }, []);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('modern');
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [editingId, setEditingId] = useState<string | undefined>();

  const loadResumes = useCallback(async () => {
    const resumes = await getSavedResumes();
    setSavedResumes(resumes);
  }, []);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleStartFresh = () => {
    setResumeData(INITIAL_RESUME);
    setActiveTemplate('modern');
    setEditingId(undefined);
    setCurrentStep('template');
  };

  const handleUploadData = (data: ResumeData) => {
    setResumeData({
      ...INITIAL_RESUME,
      ...data,
      projects: data.projects || [],
      certificates: data.certificates || [],
      awards: data.awards || [],
      languages: data.languages || [],
      interests: data.interests || [],
      customSections: data.customSections || [],
    });
    setEditingId(undefined);
    setCurrentStep('template');
  };

  const handleLoadSaved = (resume: SavedResume) => {
    setResumeData(resume.data);
    setActiveTemplate(resume.template);
    setEditingId(resume.id);
    router.push({
      pathname: '/builder',
      params: { template: resume.template, resumeData: JSON.stringify(resume.data), savedId: resume.id },
    });
  };

  const handleDuplicate = () => {
    if (savedResumes.length === 0) return;
    const latest = savedResumes[0]; // Already sorted by updatedAt desc
    setResumeData({ ...latest.data });
    setActiveTemplate(latest.template);
    setEditingId(undefined); // Don't set editingId — this is a new copy
    setCurrentStep('template');
  };

  const handleDeleteSaved = async (id: string) => {
    await deleteResume(id);
    await loadResumes();
  };

  const handleTemplateSelect = (template: TemplateType) => {
    setActiveTemplate(template);
    setCurrentStep('editor');
  };

  const handleEditorNext = () => {
    router.push({
      pathname: '/builder',
      params: {
        template: activeTemplate,
        resumeData: JSON.stringify(resumeData),
        ...(editingId ? { savedId: editingId } : {}),
      },
    });
  };

  if (!onboardingChecked) return null;

  if (currentStep === 'welcome') {
    return (
      <WelcomeScreen
        onStartFresh={handleStartFresh}
        onDuplicate={handleDuplicate}
        onUploadData={handleUploadData}
        savedResumes={savedResumes}
        onLoadSaved={handleLoadSaved}
        onDeleteSaved={handleDeleteSaved}
      />
    );
  }

  if (currentStep === 'template') {
    return <TemplateSelector currentTemplate={activeTemplate} onSelect={handleTemplateSelect} onBack={() => setCurrentStep('welcome')} />;
  }

  if (currentStep === 'editor') {
    return <ResumeEditor data={resumeData} onChange={setResumeData} onNext={handleEditorNext} onBack={() => setCurrentStep('template')} />;
  }

  return null;
}
