export type LeadStatus = 'new' | 'called' | 'booked' | 'follow_up' | 'cancelled';

export type ServiceType = 
  | 'implant' 
  | 'jaw_surgery' 
  | 'wisdom_tooth' 
  | 'botox_tmj' 
  | 'facial_contouring'
  | 'general_consultation';

export type LeadSource = 
  | 'website' 
  | 'instagram_dm' 
  | 'bale_bot' 
  | 'telegram_bot' 
  | 'google_ads' 
  | 'yektanet';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  service: ServiceType;
  serviceNameFa: string;
  source: LeadSource;
  sourceNameFa: string;
  date: string;
  timeAgo: string;
  status: LeadStatus;
  notes: string;
  chiefComplaint: string;
  priority: 'high' | 'medium' | 'normal';
  hasXray: boolean;
  xrayUrl?: string;
  battlecard: {
    patientConcern: string;
    talkingPoint: string;
    doctorHighlight: string;
    specialOfferOrFee: string;
  };
  smsHistory: {
    id: string;
    date: string;
    type: 'location' | 'confirm' | 'reminder' | 'custom';
    text: string;
  }[];
}

export interface KeywordPerformance {
  id: string;
  keyword: string;
  platform: 'google_ads' | 'yektanet';
  matchType: 'Exact' | 'Phrase' | 'Broad' | 'Native';
  impressions: number;
  clicks: number;
  calls: number;
  cpcToman: number;
  totalCostToman: number;
  conversionRate: number;
  active: boolean;
  category: string;
}

export interface AdSystemConfig {
  masterSwitchActive: boolean;
  yektanetBalanceToman: number;
  googleAdsBalanceAed: number;
  aedToTomanRate: number;
  yektanetAlertThresholdToman: number;
  googleAdsAlertThresholdAed: number;
  autoScheduleEnabled: boolean;
  activeStartHour: number; // e.g. 16 (4 PM)
  activeEndHour: number;   // e.g. 20 (8 PM)
  workDays: string[];
  autoOffMidnight: boolean;
  lastToggledAt: string;
}

export interface InstagramStorySlide {
  id: string;
  order: number;
  timeOfDay: string; // e.g. "۱۰:۳۰ صبح" | "۱۵:۰۰ ظهر" | "۲۱:۱۵ شب"
  storyType: 'quiz' | 'qna' | 'behind_the_scenes' | 'case_study' | 'tip' | 'cta_booking';
  storyTypeLabel: string;
  headline: string;
  visualDescription: string;
  textOverlay: string;
  interactiveSticker?: {
    type: 'poll' | 'question_box' | 'slider' | 'link' | 'countdown';
    prompt: string;
    options?: string[];
  };
  callToAction?: string;
  hashtagsOrMentions?: string[];
}

export interface DayScheduleItem {
  dayName: 'شنبه' | 'یکشنبه' | 'دوشنبه' | 'سه‌شنبه' | 'چهارشنبه' | 'پنجشنبه' | 'جمعه';
  dayTitle: string;
  themeFocus: string;
  targetCategory: string;
  post: InstagramPostSuggestion;
  stories: InstagramStorySlide[];
  status: 'ready' | 'draft' | 'published';
}

export interface InstagramPostSuggestion {
  id: string;
  topic: string;
  format: 'reels' | 'carousel' | 'story' | 'single';
  bestPublishDay: string;
  bestPublishTime: string;
  targetCategory: string;
  hookHeadline: string;
  captionBody: string;
  callToAction: string;
  hashtags: string[];
  visualPrompt: string;
  projectedEngagement: string;
  status: 'suggested' | 'approved' | 'scheduled' | 'published';
  sourceTrend?: string;
  soundSuggestion?: string;
  firstComment?: string;
}

export interface ScrapedTrendItem {
  id: string;
  title: string;
  creatorHandle: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  viralityScore: number; // 0-100
  sourceTag: string;
  summary: string;
  hookIdea: string;
  whyItWorked: string;
  dateScraped: string;
  convertedToPostId?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  status: 'published' | 'scheduled' | 'draft';
  seoScore: number;
  targetKeyword: string;
  readTimeMin: number;
  views: number;
  slug?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  featuredImage?: string;
}

export interface OnlineAppointment {
  id: string;
  patientName: string;
  phone: string;
  service: string;
  requestedDate: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedAt: string;
  source: string;
  notes?: string;
  trackingCode?: string;
}

export interface DoctorProfile {
  name: string;
  title: string;
  specialty: string;
  medicalLicense: string;
  medicalLicenseNumber?: string;
  bio: string;
  portraitUrl: string;
  avatar?: string;
  phone?: string;
  mobile?: string;
  phoneNumbers: string[];
  clinicAddress: string;
  address?: string;
  instagramHandle: string;
  instagramUrl: string;
  telegramUrl: string;
  websiteUrl: string;
  latitude?: number;
  longitude?: number;
}

export interface ClinicHours {
  saturdayToWednesday: string;
  thursday: string;
  friday: string;
  emergencyPhone: string;
  note: string;
  notes?: string;
  statusBadge: string;
  schedule?: Record<string, string>;
}

export interface ClinicService {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  recoveryDays: string;
  estimatedTime?: string;
  iconName?: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  patientAgeGender?: string;
  procedureDuration?: string;
  description: string;
}

export interface ReviewItem {
  id: string;
  patientName: string;
  procedure: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verified: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BudgetChannel {
  id: string;
  name: string;
  nameFa: string;
  percentage: number;
  allocatedBudgetToman: number;
  cplToman: number; // Cost Per Lead
  expectedLeads: number;
  expectedBookings: number;
  color: string;
}

export type BroadcastPlatform = 'telegram' | 'bale';

export interface ChannelInlineButton {
  id: string;
  label: string;
  url?: string;
  botCommand?: string;
  type: 'consultation' | 'hours' | 'booking' | 'call' | 'custom';
}

export interface ChannelPostItem {
  id: string;
  title: string;
  content: string;
  mediaType: 'image' | 'video_3d' | 'album' | 'none';
  mediaUrl?: string;
  mediaFileName?: string;
  targetChannels: BroadcastPlatform[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'published' | 'scheduled' | 'draft';
  inlineButtons: ChannelInlineButton[];
  viewsCount: {
    telegram: number;
    bale: number;
  };
  publishedAt?: string;
  category: 'case_study' | '3d_animation' | 'doctor_message' | 'treatment_story' | 'working_hours';
}

export interface ChannelHubConfig {
  telegramChannelName: string;
  telegramChannelHandle: string;
  telegramSubscribers: number;
  telegramConnected: boolean;
  baleChannelName: string;
  baleChannelHandle: string;
  baleSubscribers: number;
  baleConnected: boolean;
  proxyStatus: 'direct_ir_server' | 'connected';
  autoAppendBotButtons: boolean;
  botUsernameTelegram: string;
  botUsernameBale: string;
}

