import { ResumeData, ResumeTheme } from '../types';

export const RESUME_THEMES: ResumeTheme[] = [
  {
    id: 'minimalist-pro',
    name: 'Minimalist Professional',
    globalStyles: {
      fontFamily: 'System',
      headerColor: '#111827',
      headerSize: 'xl',
      headerFontWeight: 'bold',
      subHeaderColor: '#374151',
      bodyColor: '#4b5563',
      bodySize: 'sm',
      dateColor: '#9ca3af',
      accentColor: '#111827',
      backgroundColor: '#ffffff'
    },
    sectionStyles: { headerVariant: 'minimal', borderColor: '#e5e7eb', showLine: true }
  },
  {
    id: 'executive-slate',
    name: 'Executive Slate',
    globalStyles: {
      fontFamily: 'System',
      headerColor: '#0f172a',
      headerSize: 'xl',
      headerFontWeight: 'bold',
      subHeaderColor: '#334155',
      bodyColor: '#475569',
      bodySize: 'sm',
      dateColor: '#64748b',
      accentColor: '#2563eb',
      backgroundColor: '#f8fafc'
    },
    sectionStyles: { headerVariant: 'underlined', borderColor: '#2563eb', showLine: true }
  },
  {
    id: 'tech-professional',
    name: 'Tech Professional',
    globalStyles: {
      fontFamily: 'System',
      headerColor: '#000000',
      headerSize: 'xl',
      headerFontWeight: 'bold',
      subHeaderColor: '#1e293b',
      bodyColor: '#334155',
      bodySize: 'sm',
      dateColor: '#94a3b8',
      accentColor: '#0ea5e9',
      backgroundColor: '#ffffff'
    },
    sectionStyles: { headerVariant: 'accent', borderColor: '#0ea5e9', backgroundColor: '#f0f9ff' }
  },
  {
    id: 'startup-modern',
    name: 'Startup Modern',
    globalStyles: {
      fontFamily: 'System',
      headerColor: '#111827',
      headerSize: 'xl',
      headerFontWeight: 'bold',
      subHeaderColor: '#374151',
      bodyColor: '#4b5563',
      bodySize: 'sm',
      dateColor: '#9ca3af',
      accentColor: '#6366f1',
      backgroundColor: '#ffffff'
    },
    sectionStyles: { headerVariant: 'pill', accentColor: '#6366f1', color: '#ffffff', borderRadius: '8px' }
  }
];

export const INITIAL_RESUME: ResumeData = {
  personalInfo: {
    fullName: "Alex Doe",
    jobTitle: "Senior Software Engineer",
    email: "alex.doe@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "alexdoe.dev",
    linkedin: "linkedin.com/in/alexdoe"
  },
  summary: "Results-driven Software Engineer with 5+ years of experience in full-stack development. Proven track record of delivering scalable web applications and optimizing system performance. Skilled in React, Node.js, and Cloud Infrastructure.",
  experience: [
    {
      id: '1',
      title: "Senior Frontend Engineer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "Present",
      current: true,
      description: "• Led a team of 5 developers to rebuild the core customer dashboard, improving load times by 40%.\n• Implemented a new CI/CD pipeline reducing deployment time by 50%.\n• Collaborated with UX designers to implement a new design system used across 3 products."
    },
    {
      id: '2',
      title: "Software Developer",
      company: "Innovate Corp",
      location: "Austin, TX",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      description: "• Developed and maintained RESTful APIs serving 1M+ daily requests.\n• Optimized database queries resulting in a 30% reduction in server costs.\n• Mentored junior developers and conducted code reviews."
    }
  ],
  education: [
    { id: '1', degree: "B.S. Computer Science", school: "University of Technology", location: "Austin, TX", startDate: "2014-09", endDate: "2018-05" }
  ],
  skills: ["JavaScript (ES6+)", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL"],
  projects: [{ id: '1', name: "E-commerce Platform", description: "A full-stack e-commerce solution with real-time inventory management.", link: "github.com/alexdoe/shop" }],
  certificates: [{ id: '1', name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2023-01", link: "aws.amazon.com/verify/123" }],
  awards: [{ id: '1', name: "Employee of the Year", issuer: "Tech Solutions Inc.", date: "2022-12", description: "Recognized for outstanding contributions to the core product redesign." }],
  languages: ["English (Native)", "Spanish (Professional)"],
  interests: ["Open Source", "Photography", "Hiking"],
  photoUrl: "",
  customSections: [{ id: 'custom-1', title: 'Volunteering', content: '• Red Cross Volunteer\n• Local Food Bank Assistant', type: 'list' }],
};

export const COLORS = {
  primary: '#4f46e5',
  primaryDark: '#4338ca',
  primaryLight: '#e0e7ff',
  secondary: '#0f172a',
  accent: '#6366f1',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  white: '#ffffff',
  black: '#000000',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
  gray950: '#020617',
};
