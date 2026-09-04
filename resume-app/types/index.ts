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
  bodySize?: string;
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

export type TemplateType = string;

export type PaperSize = 'a4' | 'letter' | 'legal';

export interface PaperSizeConfig {
  id: PaperSize;
  name: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  css: string;
}

export type AppStep = 'welcome' | 'template' | 'editor' | 'builder' | 'templateBuilder';

export interface SavedResume {
  id: string;
  name: string;
  template: string;
  data: ResumeData;
  updatedAt: number;
  createdAt: number;
  customTemplateConfig?: CustomTemplateConfig;
}

// ─── Template Builder Types ───

export type HeaderLayoutType = 'full-width' | 'centered' | 'left-accent' | 'split' | 'boxed' | 'gradient' | 'minimal';

export interface HeaderConfig {
  layout: HeaderLayoutType;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  showPhoto: boolean;
  showJobTitle: boolean;
  showContactRow: boolean;
  contactLayout: 'row' | 'grid' | 'icons';
}

export interface SectionOrderItem {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certificates' | 'awards' | 'languages' | 'interests' | 'custom';
  label: string;
  visible: boolean;
  customTitle?: string;
}

export interface CustomTemplateConfig {
  id: string;
  name: string;
  header: HeaderConfig;
  sections: SectionOrderItem[];
  globalStyles: {
    fontFamily: string;
    bodySize: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    subtextColor: string;
    borderColor: string;
  };
  sectionStyle: 'underline' | 'background' | 'border-left' | 'pill' | 'minimal' | 'numbered';
  chipStyle: 'rounded' | 'square' | 'pill' | 'outlined' | 'filled';
  itemStyle: 'default' | 'bordered' | 'card' | 'timeline' | 'compact';
}
