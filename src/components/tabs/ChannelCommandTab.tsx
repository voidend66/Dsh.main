import React, { useState } from 'react';
import { 
  Send, 
  Clock, 
  Calendar, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  Eye, 
  Share2, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  Radio, 
  Smartphone, 
  Trash2, 
  Edit3, 
  Plus, 
  ShieldCheck, 
  Wifi, 
  Zap, 
  Play, 
  ChevronRight,
  PhoneCall,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';
import { ChannelPostItem, ChannelHubConfig, ChannelInlineButton, BroadcastPlatform } from '../../types';
import { toPersianDigits } from '../../utils/formatters';

interface ChannelCommandTabProps {
  posts: ChannelPostItem[];
  config: ChannelHubConfig;
  onPublishPost: (post: ChannelPostItem) => void;
  onSchedulePost: (post: ChannelPostItem) => void;
  onDeletePost: (id: string) => void;
  onUpdateConfig: (config: Partial<ChannelHubConfig>) => void;
}

export const ChannelCommandTab: React.FC<ChannelCommandTabProps> = ({
  posts,
  config,
  onPublishPost,
  onSchedulePost,
  onDeletePost,
  onUpdateConfig
}) => {
  // Form composer state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video_3d' | 'album' | 'none'>('video_3d');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80');
  const [mediaFileName, setMediaFileName] = useState('digital_guided_surgery_3d.mp4');
  const [selectedChannels, setSelectedChannels] = useState<BroadcastPlatform[]>(['telegram', 'bale']);
  
  const [isScheduledMode, setIsScheduledMode] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('۱۴۰۳/۰۶/۲۵');
  const [scheduledTime, setScheduledTime] = useState('ساعت ۲۰:۱۵');
  const [category, setCategory] = useState<'case_study' | '3d_animation' | 'doctor_message' | 'treatment_story' | 'working_hours'>('3d_animation');

  // Preview Mode: 'telegram' vs 'bale'
  const [previewPlatform, setPreviewPlatform] = useState<BroadcastPlatform>('telegram');
  
  // Auto-buttons toggle & inline button list
  const [autoAppendButtons, setAutoAppendButtons] = useState(config.autoAppendBotButtons);
  const [buttons, setButtons] = useState<ChannelInlineButton[]>([
    {
      id: 'btn-def-1',
      label: '🏥 درخواست مشاوره حضوری در مطب پاسداران',
      botCommand: '/book_consultation',
      type: 'consultation'
    },
    {
      id: 'btn-def-2',
      label: '📍 راهنمای ساعات کاری و لوکیشن',
      botCommand: '/clinic_info',
      type: 'hours'
    }
  ]);

  // Tab filter: 'all' | 'scheduled' | 'published'
  const [activeListFilter, setActiveListFilter] = useState<'all' | 'scheduled' | 'published'>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const presetMediaOptions = [
    {
      type: 'video_3d' as const,
      name: 'انیمیشن ۳بعدی کاشت دیجیتال Flapless (MP4)',
      fileName: 'flapless_digital_implant_3d.mp4',
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
    },
    {
      type: 'image' as const,
      name: 'آلبوم قبل و بعد جراحی اصلاح فک (JPG)',
      fileName: 'orthognathic_before_after_hd.jpg',
      url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
    },
    {
      type: 'image' as const,
      name: 'رادیوگرافی CBCT دندان عقل مجاور عصب (JPG)',
      fileName: 'wisdom_nerve_cbct_scan.jpg',
      url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80'
    },
    {
      type: 'none' as const,
      name: 'بدون رسانه (فقط متن و دکمه‌های شیشه‌ای)',
      fileName: '',
      url: ''
    }
  ];

  const handleToggleChannel = (channel: BroadcastPlatform) => {
    if (selectedChannels.includes(channel)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter(c => c !== channel));
      }
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleApplyPresetTemplate = (presetType: 'implant_3d' | 'jaw_case' | 'doctor_tip') => {
    if (presetType === 'implant_3d') {
      setTitle('شبیه‌سازی سه‌بعدی: کاشت ایمپلنت فوری بدون جراحی و برش');
      setContent(
        `🎥 **ویدیوی شبیه‌سازی ۳بعدی متد کاشت دیجیتال Flapless**\n\n` +
        `آیا می‌دانستید با اسکن دیجیتال و ساخت شابلون اختصاصی، نیازی به باز کردن لثه و بخیه نیست؟\n\n` +
        `✅ بدون تورم و درد\n` +
        `✅ کاشت پایه تیتانیومی ظرف ۱۰ دقیقه\n` +
        `✅ ضمانت کتبی مادام‌العمر در مطب پاسداران\n\n` +
        `جهت رزرو وقت اسکن اولیه، روی دکمه زیر کلیک نمایید:`
      );
      setMediaType('video_3d');
      setMediaUrl('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80');
      setMediaFileName('flapless_digital_implant_3d.mp4');
      setCategory('3d_animation');
    } else if (presetType === 'jaw_case') {
      setTitle('کیس درمانی: اصلاح جلوآمدگی فک پایین بدون سیم‌پیچی دهان');
      setContent(
        `🔍 **تغییر چهره و بازسازی خط لبخند با جراحی ارتوگناتیک**\n\n` +
        `تصاویر قبل و بعد بیماری که به دلیل جلو بودن فک پایین سال‌ها از گاز زدن نان و لبخند در عکس‌ها محروم بودند.\n\n` +
        `✨ جراحی توسط دکتر اکبر شهیدی پیام با روش فیکسیشن پیچ تیتانیومی انجام شد و بیمار همان شب قادر به صحبت کردن و مصرف غذاهای نرم بود.\n\n` +
        `📍 مطب پاسداران، نبش بوستان دوم`
      );
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80');
      setMediaFileName('orthognathic_before_after_hd.jpg');
      setCategory('case_study');
    } else {
      setTitle('توصیه بالینی: چرا کشیدن دندان عقل قبل از سن ۲۵ سالگی ضروری است؟');
      setContent(
        `🎙 **نکته مهم بالینی از دکتر اکبر شهیدی پیام (جراح فک و صورت):**\n\n` +
        `هر چه سن بیمار کمتر باشد، ریشه دندان عقل با کانال عصب فاصله بیشتری دارد و استخوان نرم‌تر است.\n` +
        `تاخیر در جراحی می‌تواند به ریشه دندان‌های مجاور و عصب حسی فک صدمه بزند.\n\n` +
        `با تجهیزات مدرن پیزوسرجری، خارج کردن دندان عقل نهفته بدون کمترین درد انجام می‌شود.`
      );
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80');
      setMediaFileName('wisdom_nerve_cbct_scan.jpg');
      setCategory('doctor_message');
    }
  };

  const handleAddCustomButton = () => {
    const newBtn: ChannelInlineButton = {
      id: `btn-${Date.now()}`,
      label: '📋 ثبت درخواست نوبت دهی',
      botCommand: '/book_now',
      type: 'booking'
    };
    setButtons([...buttons, newBtn]);
  };

  const handleRemoveButton = (id: string) => {
    setButtons(buttons.filter(b => b.id !== id));
  };

  const handlePublishNow = () => {
    if (!content.trim()) return;

    const newPost: ChannelPostItem = {
      id: `cpost-${Date.now()}`,
      title: title.trim() || 'پیام جدید مطب دکتر شهیدی',
      content,
      mediaType,
      mediaUrl: mediaType !== 'none' ? mediaUrl : undefined,
      mediaFileName: mediaType !== 'none' ? mediaFileName : undefined,
      targetChannels: selectedChannels,
      scheduledDate: 'امروز',
      scheduledTime: 'هم‌اکنون',
      status: 'published',
      inlineButtons: autoAppendButtons ? buttons : [],
      viewsCount: {
        telegram: selectedChannels.includes('telegram') ? 1 : 0,
        bale: selectedChannels.includes('bale') ? 1 : 0
      },
      publishedAt: 'لحظاتی پیش',
      category
    };

    onPublishPost(newPost);
    
    const targetsStr = selectedChannels.map(c => c === 'telegram' ? 'کانال تلگرام' : 'کانال بله').join(' و ');
    setActionFeedback(`پست با موفقیت و بدون نیاز به فیلترشکن همزمان به ${targetsStr} ارسال شد!`);
    setTimeout(() => setActionFeedback(null), 5000);

    // Reset fields
    setTitle('');
    setContent('');
  };

  const handleScheduleForLater = () => {
    if (!content.trim()) return;

    const newPost: ChannelPostItem = {
      id: `cpost-${Date.now()}`,
      title: title.trim() || 'محتوای زمان‌بندی شده مطب',
      content,
      mediaType,
      mediaUrl: mediaType !== 'none' ? mediaUrl : undefined,
      mediaFileName: mediaType !== 'none' ? mediaFileName : undefined,
      targetChannels: selectedChannels,
      scheduledDate,
      scheduledTime,
      status: 'scheduled',
      inlineButtons: autoAppendButtons ? buttons : [],
      viewsCount: {
        telegram: 0,
        bale: 0
      },
      category
    };

    onSchedulePost(newPost);

    setActionFeedback(`پست در تقویم صف انتشار برای تاریخ ${scheduledDate} (${scheduledTime}) ثبت شد.`);
    setTimeout(() => setActionFeedback(null), 5000);

    setTitle('');
    setContent('');
  };

  const filteredPosts = posts.filter(p => {
    if (activeListFilter === 'all') return true;
    return p.status === activeListFilter;
  });

  const totalSubscribers = config.telegramSubscribers + config.baleSubscribers;

  return (
    <div className="space-y-4">
      
      {/* 1. TOP CHANNELS STATUS & DIRECT RELAY BANNER */}
      <div className="bg-slate-950 rounded-md p-4 sm:p-5 text-white border border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-xs text-[11px] font-bold bg-teal-950 text-teal-300 border border-teal-800 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-teal-400" />
                مرکز انتشار همزمان کانال‌ها (Broadcast Command)
              </span>

              <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                پروکسی داخلی سرور ایران (بدون نیاز به فیلترشکن)
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-white">
              فرماندهی کانال تلگرام و پیام‌رسان بله مطب دکتر اکبر شهیدی پیام
            </h2>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">
              انتشار همزمان محتوا با یک کلیک، الصاق انیمیشن‌های سه‌بعدی و داستان‌های درمان، زمان‌بندی هفتگی و اتصال خودکار دکمه‌های شیشه‌ای رزرو نوبت به ربات مطب.
            </p>
          </div>

          {/* Quick Platform Badges */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Telegram Channel Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-sm px-3 py-2 flex items-center gap-2.5 text-xs">
              <div className="w-7 h-7 rounded-xs bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
                TG
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">
                  {config.telegramChannelHandle}
                </span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {toPersianDigits(config.telegramSubscribers.toLocaleString())} عضو تلگرام
                </span>
              </div>
            </div>

            {/* Bale Channel Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-sm px-3 py-2 flex items-center gap-2.5 text-xs">
              <div className="w-7 h-7 rounded-xs bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">
                بله
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">
                  {config.baleChannelHandle}
                </span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {toPersianDigits(config.baleSubscribers.toLocaleString())} عضو بله
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Action Feedback Alert */}
        {actionFeedback && (
          <div className="mt-3 p-3 rounded-xs bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{actionFeedback}</span>
          </div>
        )}
      </div>

      {/* 2. MAIN WORKSPACE: POST COMPOSER (RIGHT) & LIVE PREVIEW (LEFT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* RIGHT COLUMN: COMPOSER & SCHEDULER (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-md p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            
            {/* Header & Preset quick templates */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-teal-700" />
                  سامانه تدوین و ارسال محتوا به کانال‌ها
                </h3>
                <span className="text-[11px] text-slate-500">
                  فرمت‌بندی پیشرفته با قابلیت الصاق مدیا و دکمه‌های تبدیل به نوبت
                </span>
              </div>

              {/* Ready clinical presets */}
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-slate-400">قالب‌های آماده:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPresetTemplate('implant_3d')}
                  className="px-2 py-1 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition border border-slate-200"
                >
                  انیمیشن ۳بعدی
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetTemplate('jaw_case')}
                  className="px-2 py-1 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition border border-slate-200"
                >
                  داستان درمان فک
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetTemplate('doctor_tip')}
                  className="px-2 py-1 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition border border-slate-200"
                >
                  پیام دکتر
                </button>
              </div>
            </div>

            {/* Target Channels Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                کانال‌های مقصد جهت ارسال همزمان:
              </label>
              
              <div className="grid grid-cols-2 gap-2.5">
                {/* Telegram Toggle */}
                <div 
                  onClick={() => handleToggleChannel('telegram')}
                  className={`cursor-pointer rounded-sm p-2.5 border transition flex items-center justify-between ${
                    selectedChannels.includes('telegram')
                      ? 'bg-sky-50/80 border-sky-300 text-sky-950'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-xs flex items-center justify-center font-black text-xs ${
                      selectedChannels.includes('telegram') ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      TG
                    </div>
                    <div>
                      <span className="text-xs font-bold block">کانال رسمی تلگرام</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{config.telegramChannelHandle}</span>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                    selectedChannels.includes('telegram') ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedChannels.includes('telegram') && <Check className="w-3 h-3" />}
                  </div>
                </div>

                {/* Bale Toggle */}
                <div 
                  onClick={() => handleToggleChannel('bale')}
                  className={`cursor-pointer rounded-sm p-2.5 border transition flex items-center justify-between ${
                    selectedChannels.includes('bale')
                      ? 'bg-teal-50/80 border-teal-300 text-teal-950'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-xs flex items-center justify-center font-black text-xs ${
                      selectedChannels.includes('bale') ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      بله
                    </div>
                    <div>
                      <span className="text-xs font-bold block">کانال رسمی بله</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{config.baleChannelHandle}</span>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                    selectedChannels.includes('bale') ? 'bg-teal-700 border-teal-700 text-white' : 'border-slate-300'
                  }`}>
                    {selectedChannels.includes('bale') && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عنوان داخلی پست / موضوع بالینی:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: شبیه‌سازی سه‌بعدی کاشت ایمپلنت فوری بدون جراحی"
                className="w-full bg-slate-50 border border-slate-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-700 focus:bg-white transition"
              />
            </div>

            {/* Post Caption / Content */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  متن پست (Caption):
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {toPersianDigits(content.length)} کاراکتر
                </span>
              </div>

              <textarea
                rows={7}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="متن کامل پیام را بنویسید. می‌توانید از شکلک‌ها، ساختار پاراگراف‌بندی و علائم بولد (**) استفاده کنید..."
                className="w-full bg-slate-50 border border-slate-300 rounded-sm p-3 text-xs text-slate-900 leading-relaxed focus:outline-hidden focus:border-teal-700 focus:bg-white transition font-sans"
              />
            </div>

            {/* Media Attachment Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الصاق رسانه (عکس قبل‌و‌بعد یا ویدیوی ۳بعدی):
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presetMediaOptions.map((opt, idx) => {
                  const isSelected = mediaType === opt.type && (opt.type === 'none' || mediaFileName === opt.fileName);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMediaType(opt.type);
                        setMediaUrl(opt.url);
                        setMediaFileName(opt.fileName);
                      }}
                      className={`p-2.5 rounded-sm border text-right transition flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-teal-50 border-teal-400 text-teal-950 font-bold shadow-2xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-xs">
                        {opt.type === 'video_3d' && <Video className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                        {opt.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {opt.type === 'none' && <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                        <span className="text-[11px] truncate">{opt.name}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono truncate block">
                        {opt.fileName || 'متن خالص'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inline Buttons Configuration (Prompt Requirement) */}
            <div className="p-3.5 rounded-sm bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    دکمه‌های شیشه‌ای اتصال به بات مطب (Inline Keyboard)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    اضافه شدن خودکار دکمه‌های مستقیم درخواست مشاوره و نوبت‌دهی زیر پست در تلگرام و بله
                  </span>
                </div>

                {/* Auto Toggle switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-[11px] font-semibold text-slate-700">افزودن خودکار:</span>
                  <input
                    type="checkbox"
                    checked={autoAppendButtons}
                    onChange={(e) => setAutoAppendButtons(e.target.checked)}
                    className="w-4 h-4 rounded-xs text-teal-700 focus:ring-0"
                  />
                </label>
              </div>

              {autoAppendButtons && (
                <div className="space-y-1.5 pt-1">
                  {buttons.map((btn) => (
                    <div 
                      key={btn.id}
                      className="bg-white px-3 py-2 rounded-xs border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                        <span className="font-bold text-slate-800 truncate">{btn.label}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-xs">
                          {btn.botCommand || btn.url}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveButton(btn.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                        title="حذف این دکمه"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddCustomButton}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>افزودن دکمه شیشه‌ای جدید</span>
                  </button>
                </div>
              )}
            </div>

            {/* Publishing Mode: Instant Send vs Scheduler (Prompt Requirement) */}
            <div className="p-3.5 rounded-sm bg-slate-900 text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    حالت انتشار (زمان‌بندی Scheduler یا ارسال فوری)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    امکان برنامه‌ریزی پست‌ها برای کل هفته جهت انتشار خودکار در ساعت اوج
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xs border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsScheduledMode(false)}
                    className={`px-2.5 py-1 rounded-xs text-xs font-bold transition ${
                      !isScheduledMode ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ارسال هم‌اکنون (۱ کلیک)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsScheduledMode(true)}
                    className={`px-2.5 py-1 rounded-xs text-xs font-bold transition ${
                      isScheduledMode ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    زمان‌بندی در صف
                  </button>
                </div>
              </div>

              {isScheduledMode && (
                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">تاریخ انتشار شمسی:</label>
                    <input
                      type="text"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      placeholder="۱۴۰۳/۰۶/۲۵"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xs px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">ساعت انتشار در کانال:</label>
                    <input
                      type="text"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      placeholder="ساعت ۲۰:۱۵"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xs px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Dispatch Action Buttons */}
            <div className="pt-2">
              {!isScheduledMode ? (
                <button
                  type="button"
                  onClick={handlePublishNow}
                  disabled={!content.trim()}
                  className="w-full py-3 rounded-sm bg-teal-800 hover:bg-teal-900 disabled:opacity-40 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span>ارسال همزمان به تلگرام و بله با ۱ کلیک (بدون فیلترشکن)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleScheduleForLater}
                  disabled={!content.trim()}
                  className="w-full py-3 rounded-sm bg-sky-700 hover:bg-sky-800 disabled:opacity-40 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>ثبت در صف زمان‌بندی هوشمند مطب ({scheduledDate})</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* LEFT COLUMN: INTERACTIVE LIVE PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-md p-4 border border-slate-200 shadow-xs">
            
            {/* Live Preview Switch Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-700" />
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  پیش‌نمایش زنده در گوشی مخاطبان
                </h4>
              </div>

              {/* Telegram vs Bale toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xs border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('telegram')}
                  className={`px-2.5 py-1 rounded-xs text-[11px] font-bold transition ${
                    previewPlatform === 'telegram'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  تلگرام
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('bale')}
                  className={`px-2.5 py-1 rounded-xs text-[11px] font-bold transition ${
                    previewPlatform === 'bale'
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  پیام‌رسان بله
                </button>
              </div>
            </div>

            {/* MOCKUP CONTAINER */}
            <div className="mt-3 rounded-md overflow-hidden border border-slate-300 shadow-xs bg-slate-100 font-sans">
              
              {/* PLATFORM HEADER */}
              {previewPlatform === 'telegram' ? (
                /* Telegram Client Top Bar */
                <div className="bg-[#242f3d] text-white p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[11px] text-teal-300 border border-slate-600">
                      د.ش
                    </div>
                    <div>
                      <span className="font-bold text-xs block leading-tight truncate">
                        دکتر اکبر شهیدی پیام | جراح فک و صورت
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono leading-tight">
                        {toPersianDigits(config.telegramSubscribers.toLocaleString())} subscribers
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">TG Channel</span>
                </div>
              ) : (
                /* Bale Client Top Bar */
                <div className="bg-[#0b5f54] text-white p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#08483f] flex items-center justify-center font-bold text-[11px] text-teal-200 border border-teal-600">
                      بله
                    </div>
                    <div>
                      <span className="font-bold text-xs block leading-tight truncate">
                        کانال نوبت‌دهی دکتر اکبر شهیدی (پاسداران)
                      </span>
                      <span className="text-[10px] text-teal-200/80 block font-mono leading-tight">
                        {toPersianDigits(config.baleSubscribers.toLocaleString())} عضو
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-teal-200/80 font-mono">Bale App</span>
                </div>
              )}

              {/* POST BUBBLE IN FEED */}
              <div className="p-3 space-y-2.5 min-h-[380px] flex flex-col justify-end bg-[#0f141c]/5">
                
                <div className="bg-white rounded-md overflow-hidden border border-slate-200 shadow-2xs">
                  
                  {/* Media Banner */}
                  {mediaType !== 'none' && (
                    <div className="relative aspect-16/9 bg-slate-900 overflow-hidden group">
                      <img 
                        src={mediaUrl} 
                        alt="Media Preview"
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />

                      {mediaType === 'video_3d' && (
                        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                          <div className="w-11 h-11 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-xs font-mono">
                            01:15 • 3D Animation
                          </span>
                        </div>
                      )}

                      <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-xs border border-white/20">
                        {mediaType === 'video_3d' ? 'انیمیشن سه‌بعدی مطب' : 'کیس جراحی واقعی'}
                      </span>
                    </div>
                  )}

                  {/* Caption & Text */}
                  <div className="p-3 text-xs leading-relaxed text-slate-900 space-y-2">
                    {title && (
                      <h5 className="font-black text-slate-950 text-xs sm:text-sm border-b border-slate-100 pb-1">
                        {title}
                      </h5>
                    )}

                    <div className="whitespace-pre-line text-xs font-sans text-slate-800 leading-normal">
                      {content || 'متن نوشته شده در فرم روبه‌رو، به صورت زنده با فونت و استایل تلگرام یا بله در این قسمت نمایش داده خواهد شد...'}
                    </div>

                    {/* Post Meta (Views & Timestamp) */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span className="font-mono">۱.۴k</span>
                      </span>
                      <span className="font-mono">
                        {isScheduledMode ? `${scheduledDate} • ${scheduledTime}` : '۱۹:۴۵'}
                      </span>
                    </div>
                  </div>

                  {/* INLINE GLASS BUTTONS (TELEGRAM & BALE STYLE) */}
                  {autoAppendButtons && buttons.length > 0 && (
                    <div className="p-2 pt-0 space-y-1 bg-slate-50/70 border-t border-slate-100">
                      {buttons.map((btn) => (
                        <div
                          key={btn.id}
                          className={`w-full py-1.5 px-3 rounded-xs text-center text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                            previewPlatform === 'telegram'
                              ? 'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200'
                              : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200'
                          }`}
                        >
                          <span>{btn.label}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>

            </div>

            <div className="mt-2.5 p-2 rounded-xs bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              💡 <strong>مزیت اجرایی برای مطب دکتر شهیدی:</strong> مخاطب کانال تنها با یک لمس روی دکمه شیشه‌ای، مستقیماً وارد چت با ربات نوبت‌دهی مطب شده و پرونده لید وی در کارتابل منشی ثبت می‌گردد.
            </div>

          </div>

        </div>

      </div>

      {/* 3. SCHEDULER TIMELINE & ARCHIVE (صف انتشار و پست‌های ارسال شده) */}
      <div className="bg-white rounded-md p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-700" />
              صف زمان‌بندی و آرشیو پست‌های کانال‌ها (Scheduler Queue)
            </h3>
            <span className="text-[11px] text-slate-500">
              مدیریت پست‌های برنامه‌ریزی‌شده هفته و آمار بازدید در تلگرام و بله
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xs border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveListFilter('all')}
              className={`px-3 py-1 rounded-xs font-bold transition ${
                activeListFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              همه ({toPersianDigits(posts.length)})
            </button>
            <button
              type="button"
              onClick={() => setActiveListFilter('scheduled')}
              className={`px-3 py-1 rounded-xs font-bold transition ${
                activeListFilter === 'scheduled' ? 'bg-white text-sky-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              در صف زمان‌بندی ({toPersianDigits(posts.filter(p => p.status === 'scheduled').length)})
            </button>
            <button
              type="button"
              onClick={() => setActiveListFilter('published')}
              className={`px-3 py-1 rounded-xs font-bold transition ${
                activeListFilter === 'published' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              منتشر شده ({toPersianDigits(posts.filter(p => p.status === 'published').length)})
            </button>
          </div>
        </div>

        {/* Posts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {filteredPosts.map((post) => {
            const isPublished = post.status === 'published';
            return (
              <div 
                key={post.id}
                className="p-3.5 rounded-sm bg-slate-50/60 border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between space-y-2.5"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                        isPublished 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-sky-100 text-sky-900 border border-sky-300'
                      }`}>
                        {isPublished ? 'منتشر شده ✓' : 'زمان‌بندی شده (Scheduler)'}
                      </span>

                      <div className="flex items-center gap-1">
                        {post.targetChannels.includes('telegram') && (
                          <span className="bg-sky-600 text-white text-[9px] px-1 py-0.2 rounded-xs font-mono font-bold">
                            TG
                          </span>
                        )}
                        {post.targetChannels.includes('bale') && (
                          <span className="bg-teal-700 text-white text-[9px] px-1 py-0.2 rounded-xs font-mono font-bold">
                            بله
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      {isPublished ? post.publishedAt : `${post.scheduledDate} (${post.scheduledTime})`}
                    </span>
                  </div>

                  {/* Title & Preview */}
                  <h4 className="font-bold text-slate-900 text-xs mt-2 leading-snug">
                    {post.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Media & Buttons badges */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2 flex-wrap">
                    {post.mediaType !== 'none' && (
                      <span className="bg-white px-2 py-0.5 rounded-xs border border-slate-200 flex items-center gap-1 text-slate-700 font-medium">
                        {post.mediaType === 'video_3d' ? <Video className="w-3 h-3 text-sky-600" /> : <ImageIcon className="w-3 h-3 text-emerald-600" />}
                        {post.mediaFileName || 'رسانه الصاقی'}
                      </span>
                    )}

                    {post.inlineButtons.length > 0 && (
                      <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded-xs border border-teal-200 font-semibold">
                        {toPersianDigits(post.inlineButtons.length)} دکمه شیشه‌ای رزرو
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Stats / Actions */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  {isPublished ? (
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-sky-600" />
                        <span>TG: {toPersianDigits(post.viewsCount.telegram.toLocaleString())}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-teal-600" />
                        <span>بله: {toPersianDigits(post.viewsCount.bale.toLocaleString())}</span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      منتظر فرارسیدن ساعت انتشار
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    {!isPublished && (
                      <button
                        type="button"
                        onClick={() => {
                          onPublishPost({
                            ...post,
                            status: 'published',
                            publishedAt: 'هم‌اکنون'
                          });
                        }}
                        className="px-2.5 py-1 rounded-xs bg-teal-800 hover:bg-teal-900 text-white font-bold text-[11px] transition flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>ارسال همین حالا</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeletePost(post.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-xs transition"
                      title="حذف پست"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
