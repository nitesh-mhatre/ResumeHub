export interface SectionStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  fontWeight?: 'normal' | 'medium' | 'bold' | 'black';
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderRadius?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  showIcon?: boolean;
  showLine?: boolean;
  underline?: boolean;
  layoutVariant?: 'default' | 'compact' | 'grid' | 'timeline' | 'graphic' | 'bubble' | 'cards';
  headerVariant?: 'default' | 'pill' | 'bordered' | 'underlined' | 'accent' | 'minimal' | 'shadow' | 'gradient';
  accentColor?: string;
  photoShape?: 'square' | 'round' | 'triangle' | 'hexagon' | 'pentagon' | 'heart';
  lineHeight?: number;
}

export interface GlobalStyle {
  fontFamily?: string;
  headerColor?: string;
  headerSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  headerFontWeight?: 'normal' | 'medium' | 'bold' | 'black';
  subHeaderColor?: string;
  subHeaderSize?: 'xs' | 'sm' | 'base' | 'lg';
  subHeaderFontWeight?: 'normal' | 'medium' | 'bold' | 'black';
  bodyColor?: string;
  bodySize?: 'xs' | 'sm' | 'base';
  dateColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  lineHeight?: number;
}

export interface ResumeTheme {
  id: string;
  name: string;
  globalStyles: GlobalStyle;
  sectionStyles: SectionStyle;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  awards: AwardItem[];
  languages: string[];
  interests: string[];
  photoUrl?: string;
  photoShape?: 'square' | 'round' | 'triangle' | 'hexagon' | 'pentagon' | 'heart';
  customSections?: CustomSection[];
  layout?: LayoutItem[];
  sectionStyles?: { [sectionId: string]: SectionStyle };
  globalStyles?: GlobalStyle;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list';
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface AwardItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

export type TemplateType =
  | 'modern' | 'professional' | 'minimal' | 'creative' | 'executive' | 'ats' | 'compact' | 'technical' | 'bold'
  | 'academic' | 'startup' | 'swiss' | 'artistic' | 'corporate' | 'tech-dark' | 'fashion' | 'media' | 'legal' | 'medical' | 'infographic'
  | 'monochrome' | 'playful' | 'structure' | 'elegant' | 'timeline' | 'urban' | 'nature' | 'glitch' | 'retro' | 'magazine' | 'horizontal'
  | 'cards' | 'bubbles' | 'geometric' | 'borderless' | 'vintage' | 'centered' | 'asymmetric' | 'contrast' | 'customizable'
  | 'classic' | 'modern-executive' | 'executive-v2' | 'minimalist-v2' | 'creative-v2' | 'nitesh'
  | 'pro-clean' | 'pro-exec' | 'pro-two-col' | 'pro-sidebar' | 'pro-minimal';

export type AppStep = 'welcome' | 'template' | 'editor' | 'builder';
