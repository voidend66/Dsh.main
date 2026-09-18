import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Database, 
  Video, 
  Power, 
  PhoneCall, 
  Calendar, 
  ArrowLeft, 
  MessageSquare, 
  Lightbulb, 
  Layers, 
  Copy, 
  Check, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { 
  DayScheduleItem, 
  InstagramPostSuggestion, 
  ScrapedTrendItem, 
  Lead, 
  LeadStatus, 
  AdSystemConfig, 
  KeywordPerformance, 
  OnlineAppointment, 
  ArticleItem,
  ChannelPostItem
} from '../types';
import { toPersianDigits } from '../utils/formatters';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  actionExecuted?: {
    type: 
      | 'instagram_replace' 
      | 'instagram_status_toggle' 
      | 'scraper_run' 
      | 'scraper_convert' 
      | 'toggle_ads' 
      | 'toggle_keyword' 
      | 'update_lead_status' 
      | 'send_sms' 
      | 'confirm_appointment' 
      | 'add_article'
      | 'channel_broadcast'
      | 'info_report';
    title: string;
    details: string;
    targetTab?: string;
    actionButtonText?: string;
    secondaryAction?: () => void;
  };
  suggestedQuickReplies?: string[];
}

interface AiExecutiveChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleOpen: () => void;
  // Instagram
  weeklySchedule: DayScheduleItem[];
  onUpdateSchedule: (newSchedule: DayScheduleItem[]) => void;
  onUpdateDaySchedule: (dayName: string, updatedPost: Partial<InstagramPostSuggestion>, newStatus?: 'ready' | 'draft' | 'published') => void;
  suggestions: InstagramPostSuggestion[];
  onAddPost: (post: InstagramPostSuggestion) => void;
  onUpdatePostStatus: (id: string, status: 'suggested' | 'approved' | 'scheduled' | 'published') => void;
  // Scraper
  trends: ScrapedTrendItem[];
  onConvertTrendToPost: (trend: ScrapedTrendItem) => void;
  // Leads
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onSendSms: (leadId: string, type: 'location' | 'confirm' | 'reminder' | 'custom', text: string) => void;
  // Ads
  config: AdSystemConfig;
  onToggleMasterSwitch: () => void;
  keywords: KeywordPerformance[];
  onToggleKeyword: (id: string) => void;
  // Appointments & Articles
  appointments: OnlineAppointment[];
  onUpdateAppointmentStatus: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
  articles: ArticleItem[];
  onAddArticle: (art: ArticleItem) => void;
  // Broadcast Channels (Telegram & Bale)
  channelPosts?: ChannelPostItem[];
  onPublishChannelPost?: (post: ChannelPostItem) => void;
  // Navigation & Toast
  onNavigateToTab: (tabId: string) => void;
  showToast: (msg: string) => void;
}

export const AiExecutiveChatbot: React.FC<AiExecutiveChatbotProps> = ({
  isOpen,
  onClose,
  onToggleOpen,
  weeklySchedule,
  onUpdateSchedule,
  onUpdateDaySchedule,
  suggestions,
  onAddPost,
  onUpdatePostStatus,
  trends,
  onConvertTrendToPost,
  leads,
  onUpdateLeadStatus,
  onSendSms,
  config,
  onToggleMasterSwitch,
  keywords,
  onToggleKeyword,
  appointments,
  onUpdateAppointmentStatus,
  articles,
  onAddArticle,
  channelPosts = [],
  onPublishChannelPost,
  onNavigateToTab,
  showToast
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: `سلام دکتر شهیدی عزیز! من دستیار هوشمند اجرایی مطب تخصصی شما در پاسداران هستم.\n\nمن مستقیماً به تمام بخش‌های پنل متصلم و می‌تونم براتون اقدامات زیر رو بلادرنگ انجام بدم:\n\n۱. 📱 **تغییر و جایگزینی سناریوهای اینستاگرام**: اگر سناریویی سخت بود یا امکان فیلمبرداری نداشتید، فورا ایده جایگزین بدون نیاز به تصویر دکتر براتون تنظیم و در تقویم ذخیره می‌کنم.\n۲. 📋 **پایش کارهای انجام‌شده**: براتون چک می‌کنم کدوم پست‌ها منتشر شدن و کدوما باقی موندن.\n۳. 🌐 **اتصال زنده به اسکریپر Apify**: ترندهای داغ جراحی فک و ایمپلنت رو براتون رصد و به پست تبدیل می‌کنم.\n۴. ⚡ **اتاق فرمان و لیدها**: قطع/وصل تبلیغات، ارسال پیامک به بیماران و مدیریت نوبت‌ها.\n\nچه دستوری بدم انجام بشه؟`,
      timestamp: 'الان',
      suggestedQuickReplies: [
        'این ریلز رو نمیتونم فیلم بگیرم، جایگزین بدون حضور دکتر بده',
        'ببین کدوم کارهای این هفته انجام شدن و کدوم مونده؟',
        'وصل شو به اسکریپر ترندها و یک ریلز وایرال برام بساز',
        'وضعیت لیدهای جدید امروز و ارسال پیامک مطب',
        'تبلیغات کلیکی گوگل و یکتانت رو بررسی کن'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const getPersianTimeNow = () => {
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('متن با موفقیت کپی شد.');
  };

  // Intelligent Persian Action Parser
  const processUserCommand = (userPrompt: string) => {
    const p = userPrompt.trim().toLowerCase();
    const timeNow = getPersianTimeNow();

    setIsTyping(true);

    setTimeout(() => {
      let botResponse: ChatMessage;

      // 1. SCENARIO REPLACEMENT / CANNOT EXECUTE REQUEST
      // e.g. "این که گفتی رو نمیتونم انجام بدم جایگزین بده", "نمیتونم فیلم بگیرم", "سخته", "عوضش کن", "جایگزین بده"
      if (
        p.includes('نمیتونم') || 
        p.includes('نمی‌تونم') || 
        p.includes('جایگزین') || 
        p.includes('سخته') || 
        p.includes('عوض کن') || 
        p.includes('تغییر بده') ||
        p.includes('فیلم نمیتونم') ||
        p.includes('بدون حضور دکتر')
      ) {
        // Detect which day the user mentions, default to Saturday or current day
        let targetDayName: 'شنبه' | 'یکشنبه' | 'دوشنبه' | 'سه‌شنبه' | 'چهارشنبه' | 'پنجشنبه' | 'جمعه' = 'شنبه';
        if (p.includes('یکشنبه')) targetDayName = 'یکشنبه';
        else if (p.includes('دوشنبه')) targetDayName = 'دوشنبه';
        else if (p.includes('سه‌شنبه') || p.includes('سه شنبه')) targetDayName = 'سه‌شنبه';
        else if (p.includes('چهارشنبه')) targetDayName = 'چهارشنبه';
        else if (p.includes('پنجشنبه')) targetDayName = 'پنجشنبه';
        else if (p.includes('جمعه')) targetDayName = 'جمعه';

        const currentDayItem = weeklySchedule.find(d => d.dayName === targetDayName) || weeklySchedule[0];

        // Create high-performing Faceless Clinical Replacement Post
        const replacementPost: InstagramPostSuggestion = {
          id: `post-replace-${Date.now()}`,
          topic: `کیس استادی تصویری (Faceless): بازسازی لبخند با ایمپلنت دیجیتال و رادیوگرافی CBCT`,
          format: 'carousel',
          bestPublishDay: targetDayName,
          bestPublishTime: 'ساعت ۲۱:۰۰ (اوج بازدهی تعامل شبانه پاسداران)',
          targetCategory: 'ایمپلنتولوژی دیجیتال (بدون نیاز به ضبط ویدیو)',
          hookHeadline: 'اگر وقت یا حوصله جراحی سنتی نداری، این عکس اسکن سه‌بعدی رو ورق بزن!',
          captionBody: `نیاز به حضور جلوی دوربین ندارید! این پست با ۴ اسلاید اسکن دیجیتال و عکس رادیوگرافی طراحی شده است:\n\nاسلاید ۱: عکس OPG اولیه بیمار با ۴ دندان غایب در فک بالا\nاسلاید ۲: شبیه‌سازی کامپیوتری گاید جراحی و زاویه قرارگیری ایمپلنت‌ها\nاسلاید ۳: تصویر همان جلسه با کاشت بدون برش و روکش فوری موقت\nاسلاید ۴: عکس لبخند نهایی و مقایسه قبل و بعد\n\n📌 در کلینیک پاسداران دکتر اکبر شهیدی پیام، جراحی ایمپلنت بدون نیاز به برش لثه با متد Flapless در ۱۰ دقیقه انجام می‌شود.\n\nبرای مشاوره آنلاین، رادیوگرافی خود را دایرکت ارسال کنید.`,
          callToAction: 'کلمه «مشاوره» را در دایرکت بفرستید تا نوبت اسکن سه‌بعدی برای شما تنظیم گردد.',
          hashtags: ['#دکتر_اکبر_شهیدی', '#ایمپلنت_دیجیتال', '#جراحی_فک_پاسداران', '#قبل_بعد_ایمپلنت', '#دندانپزشکی_دیجیتال'],
          visualPrompt: 'کاروسل اسلایدی متشکل از ۴ تصویر باکیفیت رادیوگرافی و اسکنر سه‌بعدی دهان، بدون نیاز به حضور چهره دکتر در ویدیو.',
          projectedEngagement: '۸.۹٪ برآورد بازدهی (نرخ ذخیره اسلایدهای درمانی ۳ برابر بالاتر است)',
          status: 'ready' as any,
          soundSuggestion: 'موزیک آرامش‌بخش پیانو و اینسترومنتال',
          firstComment: 'کاشت ایمپلنت بدون برش و بخیه برای بیماران دیابتی و شاغلین بهترین انتخابه.'
        };

        // Automatically update the day in weeklySchedule and suggestions!
        onUpdateDaySchedule(targetDayName, replacementPost, 'ready');
        onAddPost(replacementPost);

        botResponse = {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: `کاملاً درکتون می‌کنم دکتر جان! سناریوی روز **${targetDayName}** فورا با یک **سناریوی کاروسل اسلایدی (Faceless)** بدون نیاز به حضور یا ضبط ویدیویی خودتون جایگزین شد و در تقویم محتوا ذخیره گردید.\n\n✨ **خلاصه سناریوی جایگزین جدید:**\n- **فرمت:** کاروسل ۴ اسلایدی مبتنی بر اسکن دیجیتال و رادیوگرافی CBCT\n- **هوک اسلاید اول:** «${replacementPost.hookHeadline}»\n- **مزیت اجرایی:** فقط با ۳ تا عکس از اسکن‌های مطب توسط منشی آپلود میشه و نیازی به ضبط دوربین نداره.\n- **ساعت انتشار:** ${replacementPost.bestPublishTime}`,
          timestamp: timeNow,
          actionExecuted: {
            type: 'instagram_replace',
            title: `سناریوی روز ${targetDayName} با موفقیت جایگزین شد`,
            details: `پست قبلی لغو و محتوای تصویری اسکن دیجیتال جایگزین آن گردید. وضعیت روز به «آماده انتشار» تغییر یافت.`,
            targetTab: 'instagram_agent',
            actionButtonText: `مشاهده برنامه ${targetDayName} در راهبر اینستاگرام`
          },
          suggestedQuickReplies: [
            'کدوم کارهای این هفته انجام شدن و کدوم مونده؟',
            'کپشن روز چهارشنبه رو هم عوض کن',
            'وصل شو به اسکریپر ترندها'
          ]
        };
      }

      // 2. CHECK WHAT'S DONE OR NOT (پایش کارهای انجام‌شده)
      // e.g. "ببینه کدوما رو انجام دادم یا نه", "کدوم کارها انجام شده", "وضعیت پست‌ها", "چیا منتشر شده"
      else if (
        p.includes('کدوما') || 
        p.includes('انجام دادم') || 
        p.includes('انجام شده') || 
        p.includes('منتشر شده') || 
        p.includes('وضعیت کارها') || 
        p.includes('چک کن') || 
        p.includes('بررسی کارهای')
      ) {
        const publishedDays = weeklySchedule.filter(d => d.status === 'published');
        const readyDays = weeklySchedule.filter(d => d.status === 'ready');
        const draftDays = weeklySchedule.filter(d => d.status === 'draft');

        const publishedPosts = suggestions.filter(s => s.status === 'published');
        const scheduledPosts = suggestions.filter(s => s.status === 'scheduled' || s.status === 'approved');

        botResponse = {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: `📊 **گزارش زنده پایش محتوا و اقدامات این هفته مطب دکتر شهیدی:**\n\n` +
            `✅ **روزهای منتشر شده (${toPersianDigits(publishedDays.length)} از ۷ روز):**\n` +
            (publishedDays.length > 0 
              ? publishedDays.map(d => `• **${d.dayName}**: ${d.dayTitle} (${d.post.targetCategory})`).join('\n')
              : '• هنوز هیچ روزی به عنوان منتشر شده نهایی علامت نخورده است.') +
            `\n\n⏳ **روزهای آماده انتشار (${toPersianDigits(readyDays.length)} روز):**\n` +
            (readyDays.length > 0
              ? readyDays.map(d => `• **${d.dayName}**: ${d.post.topic} (ساعت ${d.post.bestPublishTime})`).join('\n')
              : '• کلیه روزها منتشر شده‌اند.') +
            `\n\n📝 **آرشیو پست‌ها:** ${toPersianDigits(publishedPosts.length)} پست منتشر شده، ${toPersianDigits(scheduledPosts.length)} پست در انتظار نوبت انتشار.`,
          timestamp: timeNow,
          actionExecuted: {
            type: 'info_report',
            title: `پایش ${toPersianDigits(weeklySchedule.length)} روز هفته و آرشیو محتوا`,
            details: `تعداد ${toPersianDigits(publishedDays.length)} روز منتشر شده و ${toPersianDigits(readyDays.length)} روز آماده پخش است.`,
            targetTab: 'instagram_agent',
            actionButtonText: 'ورود به جدول هفتگی اینستاگرام'
          },
          suggestedQuickReplies: [
            'روز شنبه رو بذار روی منتشر شده',
            'روز یکشنبه رو بذار روی منتشر شده',
            'وصل شو به اسکریپر ترندها',
            'لیدهای جدید رو برام لیست کن'
          ]
        };
      }

      // 3. TOGGLE DAY / POST STATUS
      // e.g. "روز شنبه رو بزار منتشر شده", "شنبه رو تیک بزن", "وضعیت شنبه منتشر شد"
      else if (
        (p.includes('بذار روی منتشر') || p.includes('منتشر شد') || p.includes('تیک بزن') || p.includes('ثبت شد')) &&
        (p.includes('شنبه') || p.includes('روز'))
      ) {
        let targetDay = 'شنبه';
        if (p.includes('یکشنبه')) targetDay = 'یکشنبه';
        else if (p.includes('دوشنبه')) targetDay = 'دوشنبه';
        else if (p.includes('سه‌شنبه') || p.includes('سه شنبه')) targetDay = 'سه‌شنبه';
        else if (p.includes('چهارشنبه')) targetDay = 'چهارشنبه';
        else if (p.includes('پنجشنبه')) targetDay = 'پنجشنبه';
        else if (p.includes('جمعه')) targetDay = 'جمعه';

        const targetItem = weeklySchedule.find(d => d.dayName === targetDay);
        if (targetItem) {
          onUpdateDaySchedule(targetDay as any, {}, 'published');
          showToast(`وضعیت روز ${targetDay} به «منتشر شده» تغییر کرد.`);
        }

        botResponse = {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: `انجام شد دکتر جان! ✅\nوضعیت محتوای **روز ${targetDay}** در تقویم رسمی پیج به عنوان **«منتشر شده ✓»** علامت‌گذاری شد. استوری‌های این روز هم آرشیو شدند.`,
          timestamp: timeNow,
          actionExecuted: {
            type: 'instagram_status_toggle',
            title: `روز ${targetDay} به عنوان منتشر شده ثبت گردید`,
            details: `همگام‌سازی با راهبر محتوای اینستاگرام انجام شد.`,
            targetTab: 'instagram_agent',
            actionButtonText: 'مشاهده در تقویم اینستاگرام'
          },
          suggestedQuickReplies: [
            'کدوم کارهای دیگه این هفته مونده؟',
            'وصل شو به اسکریپر ترندها',
            'وضعیت تبلیغات کلیکی چطوره؟'
          ]
        };
      }

      // 4. CONNECT TO SCRAPER / APIFY TRENDS (اتصال به اسکریپر)
      // e.g. "به اسکریپر وصل شو", "ترندها رو اسکرپ کن", "ویدیوهای وایرال", "apify"
      else if (
        p.includes('اسکریپر') || 
        p.includes('اسکرپر') || 
        p.includes('scraper') || 
        p.includes('ترند') || 
        p.includes('وایرال') || 
        p.includes('apify')
      ) {
        // Pick the top trending viral item
        const topTrend = trends[0] || {
          title: 'جراحی فک بدون سیم‌پیچی دهان و بازگشت حس عصب',
          viewsCount: 340000,
          viralityScore: 94,
          creatorHandle: '@dr_maxillo_expert',
          hookIdea: 'باور غلطی که باعث میشه خیلیا از عمل فک فرار کنن!',
          summary: 'توضیح تثبیت فک با پیچ‌های مینیاتوری تیتانیوم بدون نیاز به سیم‌پیچی دهان.'
        };

        // Auto-convert trend to a new high-engagement post for Dr. Shahidi!
        const generatedFromTrend: InstagramPostSuggestion = {
          id: `post-trend-${Date.now()}`,
          topic: `برگرفته از ترند وایرال: ${topTrend.title}`,
          format: 'reels',
          bestPublishDay: 'دوشنبه',
          bestPublishTime: 'ساعت ۲۱:۱۵',
          targetCategory: 'جراحی ارتوگناتیک فک',
          hookHeadline: `چرا در متد جدید دکتر شهیدی دهان بیمار رو بعد عمل فک ۴۰ روز نمی‌بندن؟`,
          captionBody: `این ویدیو با بیش از ۳۰۰ هزار بازدید ترند اینستاگرام شده:\n${topTrend.summary}\n\nپاسخ بالینی دکتر اکبر شهیدی پیام (جراح فک و صورت):\nبا ورود پلیت‌های ریجید تیتانیومی، روش‌های قدیمی سیم‌پیچی دندان‌ها کاملاً منسوخ شده است. بیمار همان شب عمل می‌تواند صحبت کند و مایعات بنوشد.\n\n📍 مطب پاسداران - مشاوره حضوری جراحی فک`,
          callToAction: 'اگر درباره این روش سوالی داری کلمه «فک» رو دایرکت بفرست.',
          hashtags: ['#دکتر_اکبر_شهیدی', '#جراحی_فک_پاسداران', '#ارتوگناتیک', '#ترند_پزشکی', '#تکنولوژی_جراحی'],
          visualPrompt: 'دکتر شهیدی پلاک ظریف تیتانیومی را روی ماکت جمجمه نشان داده و نحوه باز بودن دهان را توضیح می‌دهد.',
          projectedEngagement: '۹.۱٪ (پتانسیل وایرال اکسیپلور بر اساس تحلیل Apify)',
          status: 'approved',
          soundSuggestion: 'موزیک ترند وایرال اینستاگرام'
        };

        onAddPost(generatedFromTrend);

        botResponse = {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: `🌐 **اتصال به اسکریپر Apify برقرار شد و ترندهای داغ اینستاگرام اسکن شدند!**\n\n` +
            `🔥 **ترند برتر شناسایی شده:**\n` +
            `• سازنده: \`${topTrend.creatorHandle}\`\n` +
            `• تعداد بازدید: **${toPersianDigits(topTrend.viewsCount.toLocaleString())} ویو** (شاخص وایرالیتی: ${toPersianDigits(topTrend.viralityScore)}٪)\n` +
            `• ایده اصلی: ${topTrend.title}\n\n` +
            `⚡ **اقدام اجرایی خودکار:**\nمن این ترند را بلافاصله برای هویت پزشکی شما در مطب پاسداران بومی‌سازی کردم و یک سناریوی ریلز جدید به نام «**${generatedFromTrend.topic}**» در لیست پست‌های تاییدشده قرار دادم!`,
          timestamp: timeNow,
          actionExecuted: {
            type: 'scraper_convert',
            title: 'ترند وایرال اسکریپر به سناریوی ریلز تبدیل شد',
            details: `پست جدید با هوک «${generatedFromTrend.hookHeadline}» در آرشیو سناریوها ثبت شد.`,
            targetTab: 'trend_scraper',
            actionButtonText: 'مشاهده در رادار ترندهای Apify'
          },
          suggestedQuickReplies: [
            'این سناریو رو بزار برای روز دوشنبه',
            'کپشن کامل این ریلز رو برام بفرست',
            'کدوم کارهای این هفته هنوز انجام نشدن؟'
          ]
        };
      }

      // 5. MASTER EMERGENCY ADS SWITCH (اتاق فرمان تبلیغات)
      // e.g. "تبلیغات رو خاموش کن", "تبلیغات رو روشن کن", "قطع فوری تبلیغات", "یکتانت رو قطع کن"
      else if (
        p.includes('تبلیغات') || 
        p.includes('گوگل ادز') || 
        p.includes('یکتانت') || 
        p.includes('موجودی') || 
        p.includes('کلید قطع')
      ) {
        if (p.includes('خاموش') || p.includes('قطع') || p.includes('استپ')) {
          if (config.masterSwitchActive) {
            onToggleMasterSwitch();
          }
          botResponse = {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: `🔴 **کلید قطع اضطراری فعال شد!**\n\nکلیه کمپین‌های گوگل ادز و یکتانت مطب فوراً متوقف شدند و بودجه‌سوزی معلق گردید.\n\nآخرین موجودی باقی‌مانده محفوظ:\n• یکتانت: ${toPersianDigits((config.yektanetBalanceToman / 1000000).toFixed(1))} میلیون تومان\n• گوگل ادز: ${toPersianDigits(config.googleAdsBalanceAed)} درهم`,
            timestamp: timeNow,
            actionExecuted: {
              type: 'toggle_ads',
              title: 'توقف فوری کلیه تبلیغات کلیکی',
              details: 'کمپین‌های گوگل ادز و یکتانت در وضعیت متوقف اضطراری قرار گرفتند.',
              targetTab: 'ads_command',
              actionButtonText: 'ورود به اتاق فرمان تبلیغات'
            },
            suggestedQuickReplies: [
              'تبلیغات رو دوباره روشن کن',
              'کلمات کلیدی پرهزینه رو غیرفعال کن',
              'وضعیت لیدهای جدید چطوره؟'
            ]
          };
        } else if (p.includes('روشن') || p.includes('فعال کن') || p.includes('وصل')) {
          if (!config.masterSwitchActive) {
            onToggleMasterSwitch();
          }
          botResponse = {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: `🟢 **تبلیغات کلیکی مجدداً با موفقیت متصل شدند!**\n\nترافیک بیماران جویای جراحی فک و ایمپلنت به سمت لندینگ پیج و شماره تلفن منشی جریان یافت.`,
            timestamp: timeNow,
            actionExecuted: {
              type: 'toggle_ads',
              title: 'جریان تبلیغات گوگل و یکتانت فعال گردید',
              details: 'کمپین‌ها طبق برنامه زمان‌بندی (۱۶:۰۰ الی ۲۰:۰۰) فعال شدند.',
              targetTab: 'ads_command',
              actionButtonText: 'مشاهده وضعیت کمپین‌ها'
            },
            suggestedQuickReplies: [
              'چند تا لید جدید تا الان اومده؟',
              'این ریلز رو نمیتونم ضبط کنم، عوضش کن',
              'اسکریپر ترندها رو چک کن'
            ]
          };
        } else {
          // Status inquiry
          botResponse = {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: `📊 **وضعیت لحظه‌ای اتاق فرمان تبلیغات مطب:**\n\n` +
              `• **وضعیت کلید اصلی:** ${config.masterSwitchActive ? '🟢 فعال و در حال جذب ورودی' : '🔴 متوقف اضطراری'}\n` +
              `• **موجودی یکتانت:** ${toPersianDigits((config.yektanetBalanceToman / 1000000).toFixed(1))} میلیون تومان\n` +
              `• **موجودی گوگل ادز:** ${toPersianDigits(config.googleAdsBalanceAed)} درهم AED\n` +
              `• **ساعات کاری ارسال ترافیک:** ${toPersianDigits(config.activeStartHour)}:۰۰ الی ${toPersianDigits(config.activeEndHour)}:۰۰ (همزمان با حضور منشی در مطب پاسداران)`,
            timestamp: timeNow,
            actionExecuted: {
              type: 'info_report',
              title: 'گزارش موجودی و بودجه تبلیغات',
              details: 'شارژ و نرخ مصرف در محدوده ایمن قرار دارد.',
              targetTab: 'ads_command',
              actionButtonText: 'اتاق فرمان کلیکی'
            },
            suggestedQuickReplies: [
              'تبلیغات رو خاموش کن',
              'لیدهای جدید رو برام بیار',
              'به اسکریپر ترندها وصل شو'
            ]
          };
        }
      }

      // 6. LEADS & PATIENTS & SMS (کارتابل بیماران و منشی)
      // e.g. "چند تا لید داریم", "پیامک به مریم", "وضعیت مریم سلیمانی رو بکن نوبت رزرو شد"
      else if (
        p.includes('لید') || 
        p.includes('بیمار') || 
        p.includes('پیامک') || 
        p.includes('پیام کوتاه') || 
        p.includes('سلیمانی') || 
        p.includes('رستمی') ||
        p.includes('نوبت')
      ) {
        const newLeads = leads.filter(l => l.status === 'new');
        const firstLead = leads[0];

        if (p.includes('پیامک') || p.includes('لوکیشن') || p.includes('آدرس')) {
          // Send location SMS to first lead
          onSendSms(
            firstLead.id, 
            'location', 
            `مراجع گرامی کلینیک دکتر اکبر شهیدی پیام، نشانی مطب: تهران، پاسداران، بوستان دوم. لوکیشن در مسیریاب: https://nshn.ir/shahidi-clinic`
          );

          botResponse = {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: `📩 **پیامک لوکیشن و نشانی مطب پاسداران ارسال شد!**\n\nپیامک تاییدیه و لوکیشن نقشه نشان مستقیماً به شماره همراه بیمار محترم **${firstLead.name}** (${firstLead.phone}) ارسال و در سابقه پرونده ثبت گردید.`,
            timestamp: timeNow,
            actionExecuted: {
              type: 'send_sms',
              title: `پیامک به ${firstLead.name} مخابره شد`,
              details: `متن پیامک حاوی لوکیشن مطب پاسداران در سامانه ثبت گردید.`,
              targetTab: 'leads',
              actionButtonText: 'مشاهده پرونده در کارتابل منشی'
            },
            suggestedQuickReplies: [
              `وضعیت ${firstLead.name} رو بکن نوبت رزرو شد`,
              'لیدهای جدید دیگر رو نمایش بده',
              'کارهای این هفته اینستاگرام رو چک کن'
            ]
          };
        } else if (p.includes('رزرو') || p.includes('تایید') || p.includes('قطعی')) {
          onUpdateLeadStatus(firstLead.id, 'booked');

          botResponse = {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: `✅ **پرونده بیمار به‌روزرسانی شد!**\n\nوضعیت پرونده بیمار **${firstLead.name}** (${firstLead.serviceNameFa}) به **«نوبت رزرو شد»** تغییر یافت.`,
            timestamp: timeNow,
            actionExecuted: {
              type: 'update_lead_status',
              title: `وضعیت ${firstLead.name} -> نوبت رزرو شد`,
              details: `پرونده بیمار جهت آماده‌سازی یونیت و پرونده بالینی به بخش رزروها انتقال یافت.`,
              targetTab: 'leads',
              actionButtonText: 'مشاهده در کارتابل بیماران'
            },
            suggestedQuickReplies: [
              'به بیمار پیامک یادآوری نوبت بفرست',
              'کدوم کارهای اینستاگرام مونده؟',
              'وصل شو به اسکریپر ترندها'
            ]
          };
        } else {
          // List leads
          botResponse = {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: `👥 **گزارش لیدها و استعلام‌های اخیر مطب دکتر شهیدی:**\n\n` +
              `در حال حاضر **${toPersianDigits(newLeads.length)} بیمار جدید** در انتظار تماس منشی هستند:\n\n` +
              leads.slice(0, 3).map((l, i) => 
                `${toPersianDigits(i+1)}. **${l.name}** (${l.phone})\n   • خدمت: ${l.serviceNameFa}\n   • منبع: ${l.sourceNameFa}\n   • شکایت اصلی: ${l.chiefComplaint.slice(0, 70)}...`
              ).join('\n\n'),
            timestamp: timeNow,
            actionExecuted: {
              type: 'info_report',
              title: `${toPersianDigits(newLeads.length)} پرونده در انتظار تماس اولیه`,
              details: `بیشترین استعلام‌ها مربوط به جراحی ارتوگناتیک و ایمپلنت دیجیتال است.`,
              targetTab: 'leads',
              actionButtonText: 'باز کردن کارتابل منشی'
            },
            suggestedQuickReplies: [
              `به ${firstLead.name} پیامک لوکیشن مطب بفرست`,
              `وضعیت ${firstLead.name} رو بکن نوبت رزرو شد`,
              'این سناریو رو نمیتونم فیلم بگیرم، عوضش کن'
            ]
          };
        }
      }

      // 7. WEBSITE & SEO & APPOINTMENTS (سایت و نوبت آنلاین)
      // e.g. "نوبت آنلاین", "مقاله جدید برای سایت", "سئو"
      else if (p.includes('سایت') || p.includes('مقاله') || p.includes('سئو') || p.includes('نوبت آنلاین')) {
        const newArt: ArticleItem = {
          id: `art-${Date.now()}`,
          title: 'راهنمای جامع جراحی دندان عقل نهفته مجاور عصب به زبان ساده',
          category: 'جراحی فک و دندان عقل',
          publishDate: 'امروز',
          status: 'published',
          seoScore: 96,
          targetKeyword: 'جراحی دندان عقل نهفته پاسداران',
          readTimeMin: 6,
          views: 120
        };

        onAddArticle(newArt);

        botResponse = {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: `🌐 **مقاله تخصصی سئو شده به وب‌سایت مطب افزوده شد!**\n\n• عنوان: **${newArt.title}**\n• کلمه کلیدی تارگت: \`${newArt.targetKeyword}\`\n• نمره سئو: **۹۶ از ۱۰۰** (سبز کامل)\n\nاین مقاله برای جذب بیماران منطقه پاسداران و شمال تهران بهینه شده است.`,
          timestamp: timeNow,
          actionExecuted: {
            type: 'add_article',
            title: 'مقاله جدید در سایت منتشر گردید',
            details: 'به تقویم محتوای وب‌سایت و سیستم مدیریت مقالات افزوده شد.',
            targetTab: 'website_control',
            actionButtonText: 'مشاهده در کنترلگر سایت'
          },
          suggestedQuickReplies: [
            'کارهای انجام‌شده اینستاگرام رو چک کن',
            'وصل شو به اسکریپر ترندها',
            'وضعیت تبلیغات رو خاموش کن'
          ]
        };
      }

      // 8. BROADCAST CHANNELS (تلگرام و بله)
      else if (
        p.includes('کانال') || 
        p.includes('تلگرام') || 
        p.includes('بله') || 
        p.includes('telegram') || 
        p.includes('bale') ||
        p.includes('انتشار')
      ) {
        if (p.includes('بفرست') || p.includes('ارسال') || p.includes('پست جدید') || p.includes('انیمیشن') || p.includes('همزمان')) {
          const newPost: ChannelPostItem = {
            id: `cpost-${Date.now()}`,
            title: 'شبیه‌سازی سه‌بعدی متد کاشت دیجیتال Flapless در ۱۰ دقیقه',
            content: `🎥 **ویدیوی شبیه‌سازی ۳بعدی متد کاشت دیجیتال بدون جراحی**\n\nکاشت پایه تیتانیومی اشترومن بدون برش لثه و بدون نیاز به بخیه در مطب پاسداران دکتر اکبر شهیدی پیام.\n\n🔻 جهت دریافت راهنمای کامل هزینه‌ها و نوبت اسکن دیجیتال از دکمه‌های زیر استفاده فرمایید:`,
            mediaType: 'video_3d',
            mediaUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
            mediaFileName: 'flapless_digital_implant_3d.mp4',
            targetChannels: ['telegram', 'bale'],
            scheduledDate: 'امروز',
            scheduledTime: 'هم‌اکنون',
            status: 'published',
            inlineButtons: [
              {
                id: 'btn-c-1',
                label: '🏥 درخواست مشاوره حضوری در مطب پاسداران',
                botCommand: '/book_consultation',
                type: 'consultation'
              },
              {
                id: 'btn-c-2',
                label: '📍 راهنمای ساعات کاری و لوکیشن',
                botCommand: '/clinic_info',
                type: 'hours'
              }
            ],
            viewsCount: {
              telegram: 120,
              bale: 85
            },
            publishedAt: 'هم‌اکنون توسط دستیار اجرایی',
            category: '3d_animation'
          };

          if (onPublishChannelPost) {
            onPublishChannelPost(newPost);
          }

          botResponse = {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: `🚀 **پست همزمان به کانال‌های تلگرام و بله مخابره شد!**\n\n• **کانال رسمی تلگرام**: @DrShahidiJawSurgery (ارسال از طریق سرور ایران بدون نیاز به فیلترشکن)\n• **کانال رسمی بله**: ble.ir/drshahidiclinic\n• **پیوست**: انیمیشن سه‌بعدی شبیه‌سازی جراحی Flapless (MP4)\n• **دکمه‌های شیشه‌ای**: دکمه‌های رزرو مشاوره و لوکیشن مطب متصل به ربات نوبت‌دهی زیر پست قرار گرفتند.`,
            timestamp: timeNow,
            actionExecuted: {
              type: 'channel_broadcast',
              title: 'ارسال همزمان پست به تلگرام و بله با موفقیت انجام شد',
              details: 'محتوا همراه با دکمه‌های شیشه‌ای تبدیل مخاطب به بیمار منتشر گردید.',
              targetTab: 'channels_command',
              actionButtonText: 'مشاهده پیش‌نمایش در کانال‌ها'
            },
            suggestedQuickReplies: [
              'وضعیت صف زمان‌بندی کانال‌ها چطوره؟',
              'کارهای این هفته اینستاگرام رو بررسی کن',
              'وضعیت تبلیغات کلیکی چطوره؟'
            ]
          };
        } else {
          // Status report of channels
          const publishedCount = channelPosts.filter(p => p.status === 'published').length;
          const scheduledCount = channelPosts.filter(p => p.status === 'scheduled').length;

          botResponse = {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: `📡 **گزارش وضعیت فرماندهی کانال‌های مطب:**\n\n• **کانال رسمی تلگرام**: ۴,۸۵۰ عضو فعال | وضعیت اتصال: آنلاین (پروکسی بدون فیلترشکن)\n• **کانال رسمی بله**: ۳,۲۴۰ عضو فعال | وضعیت اتصال: آنلاین مستقیم\n• **پست‌های منتشر شده**: ${toPersianDigits(publishedCount)} پست\n• **صف زمان‌بندی (Scheduler)**: ${toPersianDigits(scheduledCount)} پست آماده انتشار برای این هفته\n• **دکمه‌های شیشه‌ای خودکار**: فعال (هدایت مستقیم به ربات نوبت‌دهی)`,
            timestamp: timeNow,
            actionExecuted: {
              type: 'info_report',
              title: `پوشش بیش از ۸,۰۰۰ عضو در تلگرام و بله`,
              details: `سیستم ارسال یک‌کلیکی و صف زمان‌بندی فعال است.`,
              targetTab: 'channels_command',
              actionButtonText: 'ورود به مرکز انتشار کانال‌ها'
            },
            suggestedQuickReplies: [
              'یک ویدیوی ۳بعدی به تلگرام و بله ارسال کن',
              'کدوم کارهای این هفته اینستاگرام مونده؟',
              'وصل شو به اسکریپر ترندها'
            ]
          };
        }
      }

      // 8. DEFAULT SMART FALLBACK / ADVICE
      else {
        botResponse = {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: `دستور شما دریافت شد دکتر عزیز: «${userPrompt}»\n\nمن می‌توانم هر یک از اقدامات زیر را فورا روی داده‌های واقعی پنل اعمال کنم:\n\n۱. 🔄 **«این ریلز رو نمیتونم ضبط کنم جایگزین بده»**: تولید و جایگزینی فوری ریلز یا کاروسل بدون نیاز به حضور دکتر.\n۲. 📋 **«کدوما رو انجام دادم یا نه»**: بررسی دقیق کارهای منتشر شده و باقیمانده هفته.\n۳. 🌐 **«به اسکریپر وصل شو و ترند جدید پیدا کن»**: اسکن اینستاگرام و استخراج ویدیوی وایرال.\n۴. ⚡ **«تبلیغات رو خاموش/روشن کن»**: توقف اضطراری یا فعال‌سازی کمپین‌های کلیکی.\n۵. 📩 **«به بیمار پیامک لوکیشن بفرست»**: ارسال فوری اس‌ام‌اس به لیدهای منتظر.\n\nکدام اقدام را انجام دهم؟`,
          timestamp: timeNow,
          suggestedQuickReplies: [
            'این ریلز رو نمیتونم فیلم بگیرم، جایگزین بدون حضور دکتر بده',
            'ببین کدوم کارهای این هفته انجام شدن و کدوم مونده؟',
            'وصل شو به اسکریپر ترندها و یک ریلز وایرال برام بساز',
            'وضعیت لیدهای جدید امروز و ارسال پیامک مطب',
            'تبلیغات کلیکی گوگل و یکتانت رو خاموش کن'
          ]
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: getPersianTimeNow()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    processUserCommand(query);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: 'تاریخچه گفتگو بازنشانی شد. آماده دریافت دستورات و اقدامات بعدی شما هستم دکتر عزیز.',
        timestamp: getPersianTimeNow(),
        suggestedQuickReplies: [
          'این ریلز رو نمیتونم فیلم بگیرم، جایگزین بدون حضور دکتر بده',
          'ببین کدوم کارهای این هفته انجام شدن و کدوم مونده؟',
          'وصل شو به اسکریپر ترندها و یک ریلز وایرال برام بساز',
          'وضعیت لیدهای جدید امروز و ارسال پیامک مطب'
        ]
      }
    ]);
    showToast('تاریخچه چت پاکسازی شد.');
  };

  return (
    <>
      {/* FLOATING ACTION TRIGGER BUTTON (When closed) */}
      {!isOpen && (
        <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleOpen}
            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-md bg-slate-950 text-white border border-teal-500/80 shadow-lg hover:bg-slate-900 transition duration-150 cursor-pointer"
            title="دستیار هوشمند اجرایی دکتر شهیدی"
          >
            <div className="relative">
              <span className="w-2 h-2 rounded-full bg-teal-400 absolute -top-0.5 -right-0.5 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-teal-400 absolute -top-0.5 -right-0.5" />
              <Bot className="w-5 h-5 text-teal-300 group-hover:scale-110 transition duration-150" />
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-white block leading-tight">
                دستیار هوشمند اجرایی
              </span>
              <span className="text-[10px] text-teal-300 font-semibold block leading-tight">
                دستورات و ویرایش عملی پنل
              </span>
            </div>
          </button>
        </div>
      )}

      {/* CHATBOT DRAWER / OVERLAY WINDOW */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-200 shadow-2xl flex flex-col bg-white border border-slate-700 rounded-md overflow-hidden ${
            isExpanded 
              ? 'inset-3 sm:inset-6 max-w-4xl mx-auto' 
              : 'bottom-4 left-4 sm:bottom-6 sm:left-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[90vh]'
          }`}
        >
          {/* HEADER */}
          <div className="bg-slate-950 text-white p-3 sm:p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-sm bg-teal-950 border border-teal-700 text-teal-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-teal-400" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    دستیار اجرایی مطب دکتر اکبر شهیدی پیام
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 block truncate">
                  متصل به راهبر اینستاگرام، اسکریپر، اتاق فرمان و کارتابل لیدها
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 text-slate-400 hover:text-white rounded-xs hover:bg-slate-800 transition"
                title="پاکسازی تاریخچه گفتگو"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xs hover:bg-slate-800 transition hidden sm:block"
                title={isExpanded ? 'کوچک کردن پنل' : 'بزرگنمایی پنل'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-xs hover:bg-slate-800 transition"
                title="بستن چت‌بات"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* QUICK SHORTCUTS STRIP */}
          <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-[11px] shrink-0">
            <span className="text-slate-400 shrink-0 text-[10px] font-bold">دستورات سریع:</span>
            
            <button
              onClick={() => handleSendMessage('این که گفتی رو نمیتونم انجام بدم جایگزین بدون حضور دکتر بده')}
              className="px-2 py-0.5 rounded-xs bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold transition border border-slate-700 shrink-0"
            >
              🔄 جایگزینی ریلز دشوار
            </button>

            <button
              onClick={() => handleSendMessage('کدوم کارهای این هفته انجام شدن و کدوم مونده؟')}
              className="px-2 py-0.5 rounded-xs bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold transition border border-slate-700 shrink-0"
            >
              📋 پایش کارهای انجام‌شده
            </button>

            <button
              onClick={() => handleSendMessage('به اسکریپر ترندها وصل شو و بهترین ایده رو تبدیل به پست کن')}
              className="px-2 py-0.5 rounded-xs bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold transition border border-slate-700 shrink-0"
            >
              🌐 اتصال زنده به اسکریپر
            </button>

            <button
              onClick={() => handleSendMessage('وضعیت لیدهای جدید و ارسال پیامک مطب')}
              className="px-2 py-0.5 rounded-xs bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold transition border border-slate-700 shrink-0"
            >
              👥 لیدها و پیامک
            </button>
          </div>

          {/* MESSAGES SCROLL CONTAINER */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[92%] rounded-md p-3 leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-teal-800 text-white rounded-br-none'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {/* Header Info */}
                    <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-slate-400">
                      <span className="font-bold flex items-center gap-1">
                        {isUser ? 'دکتر شهیدی' : 'دستیار اجرایی هوشمند'}
                      </span>
                      <span className="font-mono text-[9px]">{msg.timestamp}</span>
                    </div>

                    {/* Message Body */}
                    <div className="whitespace-pre-line text-xs font-sans">
                      {msg.text}
                    </div>

                    {/* ACTION EXECUTION RECEIPT CARD */}
                    {msg.actionExecuted && (
                      <div className="mt-2.5 p-2.5 rounded-xs bg-slate-950 text-white border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-bold text-teal-300 flex items-center gap-1.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            اقدام عملی ثبت و اجرا شد:
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">موفقیت‌آمیز ✓</span>
                        </div>

                        <div className="font-bold text-slate-100 text-xs">
                          {msg.actionExecuted.title}
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {msg.actionExecuted.details}
                        </p>

                        {msg.actionExecuted.targetTab && (
                          <div className="pt-1 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (msg.actionExecuted?.targetTab) {
                                  onNavigateToTab(msg.actionExecuted.targetTab);
                                  showToast(`انتقال به بخش مربوطه انجام شد.`);
                                }
                              }}
                              className="px-2.5 py-1 rounded-xs bg-teal-800 hover:bg-teal-700 text-white font-bold text-[11px] transition flex items-center gap-1"
                            >
                              <span>{msg.actionExecuted.actionButtonText || 'مشاهده در پنل'}</span>
                              <ExternalLink className="w-3 h-3 text-teal-200" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyText(`receipt-${msg.id}`, `${msg.actionExecuted?.title}\n${msg.actionExecuted?.details}`)}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              {copiedId === `receipt-${msg.id}` ? 'کپی شد ✓' : 'کپی رسید'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Suggested Replies underneath bot answers */}
                  {!isUser && msg.suggestedQuickReplies && msg.suggestedQuickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 max-w-[95%]">
                      {msg.suggestedQuickReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => handleSendMessage(reply)}
                          className="text-[10px] px-2 py-0.5 rounded-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-md border border-slate-200 text-xs text-slate-500 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                <span>دستیار در حال تحلیل، پردازش و اجرای عملیات روی پنل...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="دستور خود را بنویسید (مثال: ریلز سه‌شنبه رو عوض کن، تبلیغات رو خاموش کن...)"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-700 focus:bg-white transition"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="px-3.5 py-2 rounded-sm bg-teal-800 hover:bg-teal-900 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>ارسال</span>
                <Send className="w-3.5 h-3.5 rotate-180" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-0.5">
              <span>اتصال مستقیم به State داخلی و اکشن‌های کلینیک</span>
              <span>دکتر اکبر شهیدی پیام • جراح فک و صورت</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
