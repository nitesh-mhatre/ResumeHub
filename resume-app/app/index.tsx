import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import WelcomeScreen from '../components/WelcomeScreen';
import TemplateSelector from '../components/TemplateSelector';
import ResumeEditor from '../components/ResumeEditor';
import { ResumeData, TemplateType, AppStep } from '../types';
import { INITIAL_RESUME } from '../constants';

export default function HomeScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('modern');

  const handleStartFresh = () => {
    setResumeData(INITIAL_RESUME);
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
    setCurrentStep('template');
  };

  const handleTemplateSelect = (template: TemplateType) => {
    setActiveTemplate(template);
    setCurrentStep('editor');
  };

  const handleEditorNext = () => {
    router.push({
      pathname: '/builder',
      params: { template: activeTemplate, resumeData: JSON.stringify(resumeData) },
    });
  };

  if (currentStep === 'welcome') {
    return <WelcomeScreen onStartFresh={handleStartFresh} onUploadData={handleUploadData} />;
  }

  if (currentStep === 'template') {
    return <TemplateSelector currentTemplate={activeTemplate} onSelect={handleTemplateSelect} onBack={() => setCurrentStep('welcome')} />;
  }

  if (currentStep === 'editor') {
    return <ResumeEditor data={resumeData} onChange={setResumeData} onNext={handleEditorNext} onBack={() => setCurrentStep('template')} />;
  }

  return null;
}
