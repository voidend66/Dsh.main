import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Video, 
  Copy, 
  Check, 
  Lightbulb, 
  Flame,
  Plus,
  Layers,
  HelpCircle,
  Link as LinkIcon,
  Smile,
  Hash,
  MessageSquare,
  Music,
  Share2,
  CalendarDays,
  Target,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { InstagramPostSuggestion, DayScheduleItem, InstagramStorySlide } from '../../types';
import { initialWeeklySchedule } from '../../data/initialData';
import { toPersianDigits } from '../../utils/formatters';

interface InstagramAgentTabProps {
  suggestions: InstagramPostSuggestion[];
  weeklySchedule?: DayScheduleItem[];
  onAddPost: (post: InstagramPostSuggestion) => void;
  onUpdatePostStatus: (id: string, status: 'suggested' | 'approved' | 'scheduled' | 'published') => void;
  onUpdateDayStatus?: (dayName: string, status: 'ready' | 'draft' | 'published') => void;
}

export const InstagramAgentTab: React.FC<InstagramAgentTabProps> = ({
  suggestions,
  weeklySchedule: externalWeeklySchedule,
  onAddPost,
  onUpdatePostStatus,
  onUpdateDayStatus
}) => {
  // Use internal state synced with initial/external weekly schedule
  const [schedule, setSchedule] = useState<DayScheduleItem[]>(
    externalWeeklySchedule && externalWeeklySchedule.length > 0 
      ? externalWeeklySchedule 
      : initialWeeklySchedule
  );

  React.useEffect(() => {
    if (externalWeeklySchedule && externalWeeklySchedule.length > 0) {
      setSchedule(externalWeeklySchedule);
    }
  }, [externalWeeklySchedule]);

  const [activeView, setActiveView] = useState<'day_by_day' | 'story_hub' | 'week_grid' | 'all_posts'>('day_by_day');
  const [selectedDayName, setSelectedDayName] = useState<string>('شنبه');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customSubject, setCustomSubject] = useState('');
  const [selectedStoryFilter, setSelectedStoryFilter] = useState<string>('all');

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedDay = schedule.find(d => d.dayName === selectedDayName) || schedule[0];

  const handleToggleDayStatus = (dayName: string) => {
    setSchedule(prev => prev.map(day => {
      if (day.dayName === dayName) {
        const newStatus = day.status === 'published' ? 'ready' : day.status === 'ready' ? 'published' : 'ready';
        if (onUpdateDayStatus) onUpdateDayStatus(dayName, newStatus);
        return { ...day, status: newStatus };
      }
      return day;
    }));
  };

  const handleGenerateCustomPost = () => {
    if (!customSubject.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const newPost: InstagramPostSuggestion = {
        id: `post-${Date.now()}`,
        topic: customSubject,
        format: 'reels',
        bestPublishDay: selectedDayName,
        bestPublishTime: 'ساعت ۲۱:۱۵ (اوج اسکرول شبانه مخاطبان پزشکی تهران)',
        targetCategory: 'جراحی فک و صورت',
        hookHeadline: `راز درمان قطعی «${customSubject}» که هیچ‌وقت در اینترنت بهت نگفتن!`,
        captionBody: `یکی از پرتکرارترین مراجعات ما در کلینیک پاسداران مربوط به ${customSubject} است.\n\nدر متد جراحی نوین دکتر اکبر شهیدی پیام:\n۱. بررسی دقیق اسکن دیجیتال سه‌بعدی بدون قالب‌گیری سنتی.\n۲. درمان ایمن و بدون نقاهت طولانی با تجهیزات تیتانیومی نوین.\n۳. بدون درد و با بازگشت سریع به فعالیت‌های روزمره.\n\n📍 مطب تخصصی دکتر شهیدی - تهران، پاسداران\nجهت دریافت نوبت ویزیت یا آنالیز رادیوگرافی، دایرکت پیام دهید.`,
        callToAction: 'کلمه «مشاوره» را در دایرکت بفرستید تا تصاویر قبل و بعد برای شما ارسال شود.',
        hashtags: ['#دکتر_اکبر_شهیدی', '#جراح_فک_پاسداران', '#جراحی_فک_و_صورت', '#پاسداران', '#کلینیک_پزشکی'],
        visualPrompt: 'دکتر شهیدی در مطب با لباس فرم پزشکی، ماکت تشریحی را در دست داشته و رو به دوربین توضیح می‌دهد.',
        projectedEngagement: '۸.۲٪ نرخ تعامل برآورد شده',
        status: 'approved',
        soundSuggestion: 'موزیک لایت و اعتمادساز اینسترومنتال',
        firstComment: 'هر سوالی درباره این روش جراحی دارید همینجا کامنت کنید 👇'
      };

      onAddPost(newPost);
      setIsGenerating(false);
      setCustomSubject('');
      setActiveView('all_posts');
    }, 700);
  };

  // Pre-configured Story Campaigns for Story Hub
  const storySequences = [
    {
      id: 'seq-jaw',
      title: 'کمپین استوری ۵ اسلایدی: جراحی فک بدون ترس و بدون سیم‌پیچی دهان',
      category: 'جراحی ارتوگناتیک',
      objective: 'باطل کردن باور غلط سیم‌پیچی دهان و افزایش مراجعات مشاوره فک',
      slides: [
        {
          num: 1,
          time: '۱۰:۳۰ صبح',
          headline: 'باور غلط یا واقعیت؟',
          sticker: 'استیکر نظرسنجی (Poll)',
          text: 'هنوزم فکر می‌کنی بعد جراحی فک، دهان رو ۴۰ روز با سیم می‌بندن و باید با نی سوپ بخوری؟',
          action: 'بله فکر می‌کردم / نه می‌دونم عوض شده'
        },
        {
          num: 2,
          time: '۱۱:۰۰ صبح',
          headline: 'تکنولوژی تثبیت تیتانیومی',
          sticker: 'عکس ویدیویی کوتاه',
          text: 'در متد دکتر شهیدی، فک با پلیت‌های مینیاتوری تیتانیوم فیکس میشه. یعنی همون شب حرف می‌زنید و دهان بازه!',
          action: 'نمایش پلاک ظریف در دست دکتر'
        },
        {
          num: 3,
          time: '۱۴:۳۰ ظهر',
          headline: 'قبل و بعد بیمار ارتوگناتیک',
          sticker: 'استیکر اسلایدر ایموجی 😍',
          text: 'تغییر تقارن چهره و بازگشت تنفس راحت مراجع عزیزمون ۳ ماه بعد از جراحی دو فک ✨',
          action: 'اسلایدر میزان رضایت'
        },
        {
          num: 4,
          time: '۱۷:۰۰ عصر',
          headline: 'پوشش بیمه تکمیلی',
          sticker: 'باکس سوال (Q&A)',
          text: 'جراحی ارتوگناتیک یک عمل درمانی است و مدارک جهت دریافت وجه از بیمه تکمیلی تحویل بیمار داده می‌شود.',
          action: 'باکس: سوالت راجع به هزینه یا بیمه چیه؟'
        },
        {
          num: 5,
          time: '۲۱:۱۵ شب',
          headline: 'فراخوان نوبت مشاوره حضوری',
          sticker: 'استیکر لینک (Link)',
          text: 'فقط ۳ نوبت مشاوره آنالیز سه‌بعدی فک برای این هفته باقی مانده است. نوبت خود را رزرو کنید.',
          action: 'لینک رزرو آنلاین نوبت دکتر شهیدی'
        }
      ]
    },
    {
      id: 'seq-implant',
      title: 'کمپین استوری ۴ اسلایدی: ایمپلنت دیجیتال فوری Flapless بدون برش و بخیه',
      category: 'ایمپلنتولوژی',
      objective: 'جذب بیماران شاغل، دیابتی‌ها و افراد با ترس شدید از دندانپزشکی',
      slides: [
        {
          num: 1,
          time: '۱۰:۰۰ صبح',
          headline: 'قالب‌گیری سنتی در برابر اسکن دیجیتال',
          sticker: 'استیکر کوییز ۲ گزینه‌ای',
          text: 'چقدر از خمیرهای بدمزه و حالت تهوع قالب‌گیری دندان متنفری؟',
          action: 'خیلی زیاد! / تا حالا تجربه نکردم'
        },
        {
          num: 2,
          time: '۱۳:۴۵ ظهر',
          headline: 'جراحی بدون تیغ جراحی یعنی چی؟',
          sticker: 'ویدیوی پرینت ۳ بعدی گاید',
          text: 'با گاید جراحی اختصاصی، پایه ایمپلنت در کمتر از ۱۰ دقیقه بدون برش لثه و بدون بخیه کاشته میشه.',
          action: 'نمایش کاشت تمیز بدون خونریزی'
        },
        {
          num: 3,
          time: '۱۸:۰۰ عصر',
          headline: 'روکش فوری در همان روز',
          sticker: 'استیکر اسلایدر قلبی',
          text: 'لبخند جدید در همان روز برای بیمارانی که دندان‌های جلو را از دست داده‌اند!',
          action: 'اسلایدر امتیازدهی'
        },
        {
          num: 4,
          time: '۲۱:۳۰ شب',
          headline: 'ارسال عکس دندان به دایرکت',
          sticker: 'استیکر Direct Message',
          text: 'عکس دهان یا رادیوگرافی OPG رو دایرکت بفرستید تا دکتر شهیدی زمان‌بندی ایمپلنت رو بهتون بگه.',
          action: 'دایرکت دهید'
        }
      ]
    },
    {
      id: 'seq-tmj',
      title: 'کمپین استوری ۳ اسلایدی: درمان سردرد صبحگاهی و دندان‌قروچه با بوتاکس فک',
      category: 'مفصل گیجگاهی TMJ',
      objective: 'آگاهی‌بخشی درباره بوتاکس درمانی و جذب بیماران با استرس شغلی',
      slides: [
        {
          num: 1,
          time: '۱۱:۳۰ صبح',
          headline: 'علت سردردهای مبهم اول صبح',
          sticker: 'نظرسنجی چند گزینه‌ای',
          text: 'آیا صبح‌ها موقع بیدار شدن احساس می‌کنی فکت خسته‌ست یا شقیقه‌هات تیر می‌کشه؟',
          action: 'دقیقاً همینطوره / خیر'
        },
        {
          num: 2,
          time: '۱۶:۰۰ عصر',
          headline: 'آزادسازی عضلات ماستر در ۵ دقیقه',
          sticker: 'توضیح کوتاه تصویری',
          text: 'تزریق سرپایی دوز کنترل‌شده بوتاکس توسط جراح فک، فشار روی مفصل TMJ را فوراً مهار می‌کنه.',
          action: 'تسکین درد بدون داروهای مسکن سنگین'
        },
        {
          num: 3,
          time: '۲۱:۰۰ شب',
          headline: 'باکس سوالات صوتی دکتر شهیدی',
          sticker: 'باکس سوال (Question Box)',
          text: 'اگر فکت صدا میده یا موقع خمیازه قفل میشه، سوالت رو بنویس تا پاسخ بدم.',
          action: 'باکس سوالات فعال'
        }
      ]
    }
  ];

  const totalStoriesInWeek = schedule.reduce((acc, d) => acc + d.stories.length, 0);

  return (
    <div className="space-y-4">
      
      {/* 1. AGENT IDENTITY & STRATEGY BANNER */}
      <div className="bg-slate-950 rounded-md p-4 sm:p-5 text-white border border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-xs text-[11px] font-bold bg-teal-950 text-teal-300 border border-teal-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                راهبر جامع محتوای هفتگی و استوری‌ها (Weekly Content & Story Hub)
              </span>
              <span className="text-[11px] text-slate-400">
                پیج رسمی دکتر اکبر شهیدی پیام • منطقه پاسداران
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-black text-white">
              برنامه‌ریزی اجرایی دقیق روز به روز: از ساعت انتشار و سناریو تا کپشن، هشتگ‌ها و استوری‌ها
            </h2>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">
              برنامه هوشمند ۷ روزه شنبه تا جمعه با تفکیک دقیق ساعت طلایی انتشار هر ریلز، متن کامل کپشن، هشتگ‌های تخصصی جراحی فک و ایمپلنت، و پکیج استوری‌های تعاملی ۳ وعده‌ای (صبح، ظهر، شب).
            </p>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 mt-3 text-xs flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-slate-900 border border-slate-800 text-slate-300">
                <CalendarDays className="w-3.5 h-3.5 text-teal-400" />
                <span>برنامه کامل: <strong className="text-white font-mono">{toPersianDigits(7)}</strong> روز هفته</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-slate-900 border border-slate-800 text-slate-300">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>استوری‌های طراحی شده: <strong className="text-white font-mono">{toPersianDigits(totalStoriesInWeek)}</strong> استوری</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-slate-900 border border-slate-800 text-slate-300">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>میانگین تعامل پیش‌بینی شده: <strong className="text-emerald-400 font-mono">۷.۶٪</strong></span>
              </div>
            </div>
          </div>

          {/* Quick AI Trigger Box */}
          <div className="bg-slate-900 p-3 rounded-md border border-slate-800 shrink-0 text-xs space-y-2 min-w-[280px]">
            <div className="font-bold flex items-center gap-1.5 text-slate-200 text-xs">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              تولید هوشمند سناریو و کپشن جدید:
            </div>
            <input
              type="text"
              placeholder="مثال: جراحی فک نامتقارن، ایمپلنت بدون درد..."
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
            <button
              onClick={handleGenerateCustomPost}
              disabled={isGenerating || !customSubject.trim()}
              className="w-full py-1.5 rounded-sm bg-teal-800 hover:bg-teal-700 disabled:opacity-50 font-bold text-white transition flex items-center justify-center gap-1.5 text-xs border border-teal-700"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  در حال تنظیم سناریو، کپشن و هشتگ...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  ساخت محتوای فوری
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION BAR - 4 CORE MODES */}
      <div className="bg-white rounded-md p-2.5 sm:p-3 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveView('day_by_day')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1.5 border ${
              activeView === 'day_by_day'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            برنامه روز‌به‌روز شنبه تا جمعه
          </button>

          <button
            onClick={() => setActiveView('story_hub')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1.5 border ${
              activeView === 'story_hub'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            پنل راهبردی استوری‌ها ({toPersianDigits(totalStoriesInWeek)})
          </button>

          <button
            onClick={() => setActiveView('week_grid')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1.5 border ${
              activeView === 'week_grid'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-sky-500" />
            دید جامع هفته (جدول ماتریسی)
          </button>

          <button
            onClick={() => setActiveView('all_posts')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1.5 border ${
              activeView === 'all_posts'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-500" />
            آرشیو سناریوهای پست ({toPersianDigits(suggestions.length)})
          </button>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>پایش زمانی بر اساس منطقه زمانی تهران (+۳:۳۰)</span>
        </div>
      </div>

      {/* 3. VIEW 1: DAY-BY-DAY DETAILED MASTER PLAN */}
      {activeView === 'day_by_day' && (
        <div className="space-y-3">
          
          {/* Day Selector Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
            {schedule.map((d) => {
              const isSelected = d.dayName === selectedDayName;
              return (
                <button
                  key={d.dayName}
                  onClick={() => setSelectedDayName(d.dayName)}
                  className={`p-2 rounded-sm text-right transition border flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-black text-xs">{d.dayName}</span>
                    <span className={`text-[9px] px-1 py-0.2 rounded-xs font-bold ${
                      d.status === 'published'
                        ? 'bg-emerald-100 text-emerald-900'
                        : isSelected
                        ? 'bg-teal-900 text-teal-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {d.status === 'published' ? 'منتشر شد' : 'آماده'}
                    </span>
                  </div>
                  <span className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {d.targetCategory}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Day Canvas */}
          <div className="bg-white rounded-md border border-slate-200 shadow-xs p-4 sm:p-5">
            
            {/* Day Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-xs bg-teal-800 text-white font-black text-xs">
                    {selectedDay.dayName}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-950">
                    {selectedDay.dayTitle}
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-xs font-semibold border border-slate-200">
                    {selectedDay.targetCategory}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-teal-700" />
                  <strong>هدف استراتژیک روز:</strong> {selectedDay.themeFocus}
                </p>
              </div>

              {/* Status Action */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleDayStatus(selectedDay.dayName)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1.5 border ${
                    selectedDay.status === 'published'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedDay.status === 'published' ? 'وضعیت: منتشر شده ✓' : 'تغییر به منتشر شده'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const fullDayPackage = `=== برنامه محتوایی روز ${selectedDay.dayName} - پیج دکتر اکبر شهیدی ===\n\n📌 پست اصلی (${selectedDay.post.format === 'reels' ? 'ویدیو ریلز' : 'کاروسل'}):\nساعت انتشار: ${selectedDay.post.bestPublishTime}\nموضوع: ${selectedDay.post.topic}\nقلاب ثانیه اول: «${selectedDay.post.hookHeadline}»\n\nمتن کپشن:\n${selectedDay.post.captionBody}\n\nکال تو اکشن: ${selectedDay.post.callToAction}\n\nهشتگ‌ها:\n${selectedDay.post.hashtags.join(' ')}\n\nکامنت اول:\n${selectedDay.post.firstComment || ''}\n\n------------------------------\n📱 استوری‌های امروز (${selectedDay.stories.length} استوری):\n${selectedDay.stories.map((s, i) => `استوری ${i+1} (${s.timeOfDay}):\n- تیتر: ${s.headline}\n- متن روی تصویر: ${s.textOverlay}\n- استیکر: ${s.interactiveSticker?.prompt || 'ندارد'}\n`).join('\n')}`;
                    handleCopy(`package-${selectedDay.dayName}`, fullDayPackage);
                  }}
                  className="px-3 py-1.5 rounded-sm bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition flex items-center gap-1.5 border border-teal-900"
                >
                  {copiedKey === `package-${selectedDay.dayName}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      پکیج روز کپی شد ✓
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      کپی کامل پکیج روز (پست + استوری‌ها)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* TWO COLUMNS: POST MAIN MODULE vs STORY MODULE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
              
              {/* LEFT / MAIN COLUMN: THE DAILY POST (7 COLS) */}
              <div className="lg:col-span-7 space-y-3">
                
                <div className="p-3 bg-slate-50 rounded-sm border border-slate-200">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-teal-800" />
                      پست اصلی روز ({selectedDay.post.format === 'reels' ? 'ریلز ویدیویی اینستاگرام' : 'کاروسل اسلایدی'})
                    </span>

                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-xs border border-slate-200">
                      {selectedDay.post.targetCategory}
                    </span>
                  </div>

                  {/* Golden Publishing Time Alert */}
                  <div className="mt-2.5 p-2 bg-amber-50 rounded-xs border border-amber-200 flex items-center justify-between text-xs">
                    <span className="text-amber-950 font-bold flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      ساعت دقیق انتشار:
                    </span>
                    <span className="text-amber-900 font-bold font-mono text-[11px]">
                      {selectedDay.post.bestPublishTime}
                    </span>
                  </div>

                  {/* Hook Box */}
                  <div className="mt-2.5">
                    <span className="text-[10px] text-rose-800 font-bold block mb-1 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-600" />
                      هوک ثانیه اول ویدیو (قلاب طلایی ۳ ثانیه اول):
                    </span>
                    <div className="p-2.5 rounded-xs bg-rose-50/70 border border-rose-200 text-xs font-black text-rose-950 leading-relaxed">
                      «{selectedDay.post.hookHeadline}»
                    </div>
                  </div>

                  {/* Scenario / Visual Direction */}
                  <div className="mt-2.5 text-xs bg-white p-2.5 rounded-xs border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1 text-[11px]">
                      سناریو و راهنمای تصویربرداری در مطب پاسداران:
                    </span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {selectedDay.post.visualPrompt}
                    </p>
                    {selectedDay.post.soundSuggestion && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[10px] text-slate-500">
                        <Music className="w-3 h-3 text-slate-400" />
                        <span>پیشنهاد موزیک: {selectedDay.post.soundSuggestion}</span>
                      </div>
                    )}
                  </div>

                  {/* Full Caption Box */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800 text-[11px]">
                        متن کامل کپشن (آماده انتشار):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`caption-${selectedDay.dayName}`, selectedDay.post.captionBody)}
                        className="text-teal-800 hover:text-teal-950 text-[11px] font-bold flex items-center gap-1"
                      >
                        {copiedKey === `caption-${selectedDay.dayName}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            کپشن کپی شد ✓
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            کپی متن کپشن
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 bg-white rounded-xs border border-slate-300 text-xs text-slate-800 leading-relaxed max-h-44 overflow-y-auto whitespace-pre-line font-sans select-all">
                      {selectedDay.post.captionBody}
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-2.5 p-2 bg-teal-50 text-teal-950 rounded-xs border border-teal-200 text-xs">
                    <strong className="text-[11px]">کال تو اکشن (CTA):</strong> {selectedDay.post.callToAction}
                  </div>

                  {/* Strategic Hashtags Box */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                        <Hash className="w-3 h-3 text-slate-500" />
                        هشتگ‌های تخصصی استخراج‌شده ({toPersianDigits(selectedDay.post.hashtags.length)} هشتگ):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`tags-${selectedDay.dayName}`, selectedDay.post.hashtags.join(' '))}
                        className="text-teal-800 hover:text-teal-950 text-[11px] font-bold flex items-center gap-1"
                      >
                        {copiedKey === `tags-${selectedDay.dayName}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            هشتگ‌ها کپی شد ✓
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            کپی همه هشتگ‌ها
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 p-2 bg-white rounded-xs border border-slate-200">
                      {selectedDay.post.hashtags.map((t, idx) => (
                        <span key={idx} className="text-[11px] font-mono text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-xs border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pinned First Comment */}
                  {selectedDay.post.firstComment && (
                    <div className="mt-2.5 p-2 bg-slate-100 rounded-xs border border-slate-200 text-xs text-slate-700">
                      <strong className="text-[11px] block text-slate-900 mb-0.5">کامنت اول پین شده (Pinned Comment):</strong>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{selectedDay.post.firstComment}</p>
                    </div>
                  )}

                </div>

              </div>

              {/* RIGHT COLUMN: DAILY STORIES CADENCE (5 COLS) */}
              <div className="lg:col-span-5 space-y-3">
                
                <div className="p-3 bg-slate-50 rounded-sm border border-slate-200">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-600" />
                      بسته استوری‌های روز ({toPersianDigits(selectedDay.stories.length)} استوری تعاملی)
                    </span>

                    <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-1.5 py-0.2 rounded-xs">
                      صبح • ظهر • شب
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 my-2 leading-relaxed">
                    استوری‌های متوالی روزانه برای حفظ تعامل، اعتمادسازی و تبدیل بیننده به بیمار ویزیت‌شده در مطب پاسداران:
                  </p>

                  <div className="space-y-2.5">
                    {selectedDay.stories.map((story, idx) => (
                      <div 
                        key={story.id} 
                        className="bg-white rounded-xs p-2.5 border border-slate-200 shadow-2xs text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-xs bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                              {toPersianDigits(idx + 1)}
                            </span>
                            <span className="font-bold text-slate-900 text-[11px]">{story.headline}</span>
                          </div>

                          <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded-xs border border-teal-200">
                            {story.timeOfDay}
                          </span>
                        </div>

                        {/* Story Visual Concept */}
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-xs border border-slate-100">
                          <strong className="text-slate-800 text-[10px] block">شرح ویدیویی/تصویری:</strong>
                          {story.visualDescription}
                        </div>

                        {/* Story Text Overlay */}
                        <div className="p-2 bg-slate-950 text-white rounded-xs border border-slate-800">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>متن روی تصویر استوری:</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(`story-text-${story.id}`, story.textOverlay)}
                              className="text-teal-400 hover:text-teal-300 flex items-center gap-1"
                            >
                              {copiedKey === `story-text-${story.id}` ? 'کپی شد ✓' : 'کپی متن'}
                            </button>
                          </div>
                          <p className="text-[11px] leading-relaxed font-sans text-slate-100">
                            {story.textOverlay}
                          </p>
                        </div>

                        {/* Interactive Sticker Info */}
                        {story.interactiveSticker && (
                          <div className="p-1.5 bg-amber-50 rounded-xs border border-amber-200 text-[11px] text-amber-950 flex items-start gap-1.5">
                            <Smile className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">استیکر تعاملی اینستاگرام: </span>
                              <span>{story.interactiveSticker.prompt}</span>
                              {story.interactiveSticker.options && (
                                <div className="flex items-center gap-1 mt-1">
                                  {story.interactiveSticker.options.map((opt, oIdx) => (
                                    <span key={oIdx} className="bg-white px-1.5 py-0.2 rounded-xs border border-amber-300 text-[10px]">
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {story.callToAction && (
                          <div className="text-[10px] text-slate-600">
                            <strong>اقدام نهایی:</strong> {story.callToAction}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* 4. VIEW 2: STORY HUB & PLAYBOOKS (پنل راهبردی استوری‌ها) */}
      {activeView === 'story_hub' && (
        <div className="space-y-4">
          
          {/* Story Hub Architecture Banner */}
          <div className="bg-white rounded-md p-4 border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  معماری جریان استوری‌های پزشکی (Story Funnel Architecture)
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  استوری‌ها ابزار اصلی اعتمادسازی و فروش نوبت هستند. فرمول طلایی ۳ مرحله‌ای دکتر شهیدی:
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xs font-bold">
                  صبح: جلب توجه و پشت صحنه
                </span>
                <span className="text-slate-400">←</span>
                <span className="px-2 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-xs font-bold">
                  ظهر: آموزش و کوییز علمی
                </span>
                <span className="text-slate-400">←</span>
                <span className="px-2 py-1 bg-slate-900 text-white rounded-xs font-bold">
                  شب: تبدیل و اعلام نوبت
                </span>
              </div>
            </div>

            {/* Cadence by day */}
            <div className="mt-3">
              <span className="text-xs font-bold text-slate-800 block mb-2">
                برنامه زمان‌بندی روزانه استوری‌های این هفته:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                {schedule.map(d => (
                  <div key={d.dayName} className="p-2.5 bg-slate-50 rounded-sm border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1.5 pb-1 border-b border-slate-200">
                      <span>{d.dayName}</span>
                      <span className="text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded-xs">
                        {toPersianDigits(d.stories.length)} استوری
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      {d.stories.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-700 truncate">
                          <span className="truncate">{toPersianDigits(idx + 1)}. {s.headline}</span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 mr-1">{s.timeOfDay.replace('ساعت ', '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Story Sequences & Campaigns Playbook */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-950 text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                کمپین‌های زنجیره‌ای آماده استوری (Story Sequence Campaigns)
              </h3>
              <span className="text-xs text-slate-500">
                طراحی شده برای هایلایت‌های پیج و ایام کمپین نوبت‌دهی
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {storySequences.map((seq) => (
                <div 
                  key={seq.id}
                  className="bg-white rounded-md border border-slate-200 shadow-xs p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-teal-50 text-teal-900 border border-teal-200">
                        {seq.category}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {toPersianDigits(seq.slides.length)} اسلاید متوالی
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-950 text-xs leading-relaxed mb-1">
                      {seq.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                      <strong>هدف:</strong> {seq.objective}
                    </p>

                    <div className="space-y-2 border-t border-slate-100 pt-2.5">
                      {seq.slides.map(slide => (
                        <div key={slide.num} className="bg-slate-50 p-2 rounded-xs border border-slate-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900 text-[11px]">
                              اسلاید {toPersianDigits(slide.num)} • {slide.headline}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{slide.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-700 leading-relaxed">{slide.text}</p>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-teal-800 pt-1 border-t border-slate-200">
                            <span>{slide.sticker}</span>
                            <span className="text-slate-500 truncate max-w-[140px]">{slide.action}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        const seqText = `${seq.title}\n\n${seq.slides.map(s => `اسلاید ${s.num} (${s.time}):\n${s.text}\nاستیکر: ${s.sticker}\nاقدام: ${s.action}`).join('\n\n')}`;
                        handleCopy(`seq-${seq.id}`, seqText);
                      }}
                      className="w-full py-1.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      {copiedKey === `seq-${seq.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          کل کمپین کپی شد ✓
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          کپی متن کامل زنجیره استوری
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 5. VIEW 3: 7-DAY WEEKLY GRID (ماتریس هفتگی) */}
      {activeView === 'week_grid' && (
        <div className="bg-white rounded-md p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div>
              <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                ماتریس جامع انتشار محتوای هفتگی (شنبه تا جمعه):
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                مشاهده در یک نگاه ساعات طلایی، فرمت پست و زنجیره استوری‌های کل ایام هفته
              </p>
            </div>

            <button
              onClick={() => setActiveView('day_by_day')}
              className="text-xs text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1"
            >
              مشاهده تفصیلی روزها
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-xs">
            {schedule.map((day) => (
              <div 
                key={day.dayName} 
                className="p-2.5 bg-slate-50 rounded-sm border border-slate-200 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 mb-2">
                    <span className="font-black text-slate-900">{day.dayName}</span>
                    <span className="text-[10px] text-teal-800 bg-white px-1.5 py-0.2 rounded-xs border border-slate-200">
                      {day.targetCategory}
                    </span>
                  </div>

                  {/* Post Pill */}
                  <div className="p-2 bg-white rounded-xs border border-slate-300 text-[11px] mb-2 shadow-2xs">
                    <div className="font-bold text-slate-900 truncate">{day.post.topic}</div>
                    <div className="text-[10px] text-teal-800 font-mono mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {day.post.bestPublishTime}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      فرمت: {day.post.format === 'reels' ? 'ویدیو ریلز' : 'کاروسل'}
                    </div>
                  </div>

                  {/* Stories list */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-900 block">
                      استوری‌های روز ({toPersianDigits(day.stories.length)} وعده):
                    </span>
                    {day.stories.map((st, sIdx) => (
                      <div key={sIdx} className="bg-amber-50/70 p-1 rounded-xs border border-amber-200 text-[10px] text-amber-950 truncate">
                        <span className="font-bold">{st.timeOfDay.replace('ساعت ', '')}:</span> {st.headline}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDayName(day.dayName);
                      setActiveView('day_by_day');
                    }}
                    className="w-full py-1 text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xs font-semibold text-center transition"
                  >
                    نمایش کامل روز
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. VIEW 4: ALL POST ARCHIVE */}
      {activeView === 'all_posts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((post) => {
            const isCopied = copiedKey === `post-${post.id}`;
            return (
              <div 
                key={post.id}
                className="bg-white rounded-md border border-slate-200 shadow-xs hover:border-slate-300 transition duration-150 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-xs text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-slate-600" />
                        {post.format === 'reels' ? 'ویدیو ریلز' : post.format === 'carousel' ? 'اسلایدی (کاروسل)' : 'استوری تعاملی'}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {post.targetCategory}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-700 border border-slate-200">
                      {post.status === 'scheduled' ? 'زمان‌بندی شده' : post.status === 'approved' ? 'تایید شده' : 'پیشنهاد اولیه'}
                    </span>
                  </div>

                  <div className="my-2.5 p-2 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-bold flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-teal-700" />
                      زمان طلایی انتشار:
                    </span>
                    <span className="text-slate-700 font-mono text-[11px]">
                      {post.bestPublishDay} • {post.bestPublishTime}
                    </span>
                  </div>

                  <div className="mb-2.5">
                    <span className="text-[10px] text-rose-700 font-bold block mb-1 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-600" />
                      هوک ثانیه اول ویدیو (Hook):
                    </span>
                    <div className="p-2 rounded-sm bg-rose-50/60 border border-rose-200 text-xs font-black text-rose-950 leading-snug">
                      «{post.hookHeadline}»
                    </div>
                  </div>

                  <div className="mb-2.5 text-xs bg-slate-50 p-2 rounded-sm border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-0.5 text-[11px]">سناریوی فیلمبرداری در مطب:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{post.visualPrompt}</p>
                  </div>

                  <div className="mb-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-bold text-slate-800 text-[11px]">متن کپشن:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`post-${post.id}`, post.captionBody)}
                        className="text-teal-700 hover:text-teal-900 text-[11px] font-bold flex items-center gap-1"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            کپی شد
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            کپی متن کپشن
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-28 overflow-y-auto whitespace-pre-line font-sans">
                      {post.captionBody}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="p-1.5 rounded-sm bg-teal-50 text-teal-950 border border-teal-200 text-[11px]">
                      <strong>کال تو اکشن (CTA):</strong> {post.callToAction}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.map((tag, i) => (
                        <span key={i} className="text-[10px] text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded-xs font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-800 font-bold">
                    پیش‌بینی تعامل: {post.projectedEngagement}
                  </span>

                  <button
                    type="button"
                    onClick={() => onUpdatePostStatus(post.id, 'scheduled')}
                    className={`px-3 py-1.5 rounded-sm font-bold transition flex items-center gap-1 text-xs border ${
                      post.status === 'scheduled'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {post.status === 'scheduled' ? 'در صف تقویم ✓' : 'تایید و زمان‌بندی'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
