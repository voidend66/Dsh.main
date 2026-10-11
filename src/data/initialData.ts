import { 
  Lead, 
  KeywordPerformance, 
  AdSystemConfig, 
  InstagramPostSuggestion, 
  InstagramStorySlide,
  DayScheduleItem,
  ScrapedTrendItem, 
  ArticleItem, 
  OnlineAppointment, 
  BudgetChannel 
} from '../types';

export const initialConfig: AdSystemConfig = {
  masterSwitchActive: true,
  yektanetBalanceToman: 48500000, // 48.5 million Tomans
  googleAdsBalanceAed: 1420,     // 1,420 AED
  aedToTomanRate: 185000,
  yektanetAlertThresholdToman: 15000000,
  googleAdsAlertThresholdAed: 400,
  autoScheduleEnabled: true,
  activeStartHour: 16,
  activeEndHour: 20,
  workDays: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه'],
  autoOffMidnight: true,
  lastToggledAt: 'امروز ساعت ۱۴:۳۰'
};

export const initialLeads: Lead[] = [];

export const initialKeywords: KeywordPerformance[] = [
  {
    id: 'kw-1',
    keyword: 'جراح فک و صورت تهران',
    platform: 'google_ads',
    matchType: 'Phrase',
    impressions: 4820,
    clicks: 612,
    calls: 84,
    cpcToman: 42000,
    totalCostToman: 25704000,
    conversionRate: 13.7,
    active: true,
    category: 'برند و تخصص'
  },
  {
    id: 'kw-2',
    keyword: 'ایمپلنت دیجیتال پاسداران',
    platform: 'google_ads',
    matchType: 'Exact',
    impressions: 3100,
    clicks: 445,
    calls: 72,
    cpcToman: 38000,
    totalCostToman: 16910000,
    conversionRate: 16.2,
    active: true,
    category: 'ایمپلنت فوری'
  },
  {
    id: 'kw-3',
    keyword: 'هزینه جراحی فک ۱۴۰۳',
    platform: 'google_ads',
    matchType: 'Broad',
    impressions: 6900,
    clicks: 810,
    calls: 41,
    cpcToman: 29000,
    totalCostToman: 23490000,
    conversionRate: 5.1,
    active: false, // Inactive because high cost, low intent
    category: 'استعلام قیمت'
  },
  {
    id: 'kw-4',
    keyword: 'جراحی دندان عقل نهفته نزدیک عصب',
    platform: 'google_ads',
    matchType: 'Phrase',
    impressions: 2450,
    clicks: 390,
    calls: 68,
    cpcToman: 24000,
    totalCostToman: 9360000,
    conversionRate: 17.4,
    active: true,
    category: 'دندان عقل'
  },
  {
    id: 'kw-5',
    keyword: 'دکتر اکبر شهیدی جراح فک',
    platform: 'google_ads',
    matchType: 'Exact',
    impressions: 1250,
    clicks: 520,
    calls: 112,
    cpcToman: 14000,
    totalCostToman: 7280000,
    conversionRate: 21.5,
    active: true,
    category: 'سرچ مستقیم نام دکتر'
  },
  {
    id: 'kw-6',
    keyword: 'بنر همسان ریتارگتینگ بازدیدکنندگان سایت',
    platform: 'yektanet',
    matchType: 'Native',
    impressions: 142000,
    clicks: 1840,
    calls: 95,
    cpcToman: 6500,
    totalCostToman: 11960000,
    conversionRate: 5.2,
    active: true,
    category: 'ریتارگتینگ یکتانت'
  },
  {
    id: 'kw-7',
    keyword: 'بنر کلیکی موضوعی وب‌سایت‌های سلامت و پزشکی',
    platform: 'yektanet',
    matchType: 'Native',
    impressions: 98000,
    clicks: 920,
    calls: 28,
    cpcToman: 5900,
    totalCostToman: 5428000,
    conversionRate: 3.0,
    active: false,
    category: 'ترافیک سرد'
  }
];

export const initialWeeklySchedule: DayScheduleItem[] = [
  {
    dayName: 'شنبه',
    dayTitle: 'روز آگاهی از دندان عقل و عصب فک',
    themeFocus: 'ترس‌زدایی از کشیدن دندان عقل نهفته چسبیده به کانال عصب فک',
    targetCategory: 'جراحی دندان عقل',
    status: 'ready',
    post: {
      id: 'sched-sat',
      topic: 'جراحی دندان عقل نهفته چسبیده به عصب فک بدون آسیب حسی به لب (تکنیک کورونکتومی)',
      format: 'reels',
      bestPublishDay: 'شنبه',
      bestPublishTime: 'ساعت ۲۰:۳۰ (اوج تعامل مخاطبان هدف)',
      targetCategory: 'جراحی دندان عقل',
      hookHeadline: 'اگر دندانپزشکت گفته دندان عقلت به عصب فک چسبیده و ممکنه لبت تا آخر عمر بی‌حس بشه، اصلاً نترس!',
      captionBody: `بسیاری از عزیزانی که به مطب پاسداران مراجعه می‌کنند با نگرانی شدید می‌گویند: «دندانپزشکم گفته ریشه دندان عقلت دقیقاً داخل کانال عصب فک تحتانی قرار گرفته و دست زدن بهش ریسک بی‌حسی دائمی لب و چانه داره!»\n\nواقعیت علمی در تخصص جراحی فک و صورت چیه؟\n۱. ارزیابی دقیق ۳ بعدی: با اسکن CBCT، موقعیت میلی‌متری ریشه نسبت به کانال مندیبولار بررسی میشه.\n۲. تکنیک جراحی کورونکتومی (Coronectomy): اگر چسبندگی شدید باشه، فقط تاج دندان برداشته میشه و ریشه در استخوان دست‌نخورده باقی می‌مونه تا عصب کاملاً در امان بمونه!\n۳. بدون درد در حین جراحی و نقاهت کوتاه ۳ روزه با پروتکل تجویزی مطب.\n\n📍 مطب دکتر اکبر شهیدی پیام - جراح دهان، فک و صورت\nتهران، خیابان پاسداران`,
      callToAction: 'عکس رادیولوژی OPG یا سی‌بی‌سی‌تی خودت رو به دایرکت بفرست تا شخصاً بررسی کنم.',
      hashtags: ['#دندان_عقل', '#جراحی_دندان_عقل', '#عصب_فک', '#جراح_فک_پاسداران', '#دکتر_اکبر_شهیدی', '#کورونکتومی', '#دندان_عقل_نهفته'],
      visualPrompt: 'دکتر شهیدی در مطب، با روپوش سفید و ماکت فک، اسکن ۳ بعدی مانیتور را نشان داده و با آرامش و اطمینان علمی توضیح می‌دهد.',
      projectedEngagement: '۷.۸٪ (سیو بسیار بالا توسط مخاطبان نگران)',
      status: 'scheduled',
      soundSuggestion: 'موزیک ترند بدون کلام لایت و اعتمادساز (Deep Focus Medical)',
      firstComment: 'سوالی درباره کشیدن دندان عقل داری؟ زیر همین پست بنویس تا در اسرع وقت پاسخ بدم 👇'
    },
    stories: [
      {
        id: 'sat-story-1',
        order: 1,
        timeOfDay: 'ساعت ۱۰:۱۵ صبح',
        storyType: 'behind_the_scenes',
        storyTypeLabel: 'پشت صحنه مطب',
        headline: 'شروع هفته پر انرژی در مطب پاسداران',
        visualDescription: 'تصویر کوتاه از آماده‌سازی استریل یونیت و خوشامدگویی به مراجعین شنبه',
        textOverlay: 'صبح اول هفته بخیر 🌿 امروز در مطب پاسداران میزبان چند جراحی ظریف دندان عقل و ایمپلنت هستیم.',
        interactiveSticker: {
          type: 'slider',
          prompt: 'انرژی شروع هفته‌ت در چه حده؟',
        },
        callToAction: 'سلامتی لبخندتون رو به تعویق نندازید'
      },
      {
        id: 'sat-story-2',
        order: 2,
        timeOfDay: 'ساعت ۱۴:۳۰ ظهر',
        storyType: 'quiz',
        storyTypeLabel: 'کوییز و آگاهی پزشکی',
        headline: 'تست علمی دندان عقل',
        visualDescription: 'عکس گراف رادیوگرافی یک دندان عقل که افقی خوابیده زیر لثه',
        textOverlay: 'به نظرتون بهترین سن برای جراحی دندان عقل چه زمانیه؟ قبل از ۲۵ سالگی یا بعد از درد گرفتن؟',
        interactiveSticker: {
          type: 'poll',
          prompt: 'بهترین سن جراحی دندان عقل؟',
          options: ['۱۸ الی ۲۵ سالگی (استخوان نرم‌تر)', 'هر وقت درد گرفت!']
        },
        callToAction: 'پاسخ صحیح: قبل از ۲۵ سالگی به دلیل جوش خوردن سریع‌تر و تراکم کمتر استخوان.'
      },
      {
        id: 'sat-story-3',
        order: 3,
        timeOfDay: 'ساعت ۲۱:۳۰ شب',
        storyType: 'cta_booking',
        storyTypeLabel: 'فراخوان و اطلاع‌رسانی ویزیت',
        headline: 'اعلام ظرفیت نوبت‌های خالی دوشنبه',
        visualDescription: 'کارت شیک اطلاعات تماس مطب و نوبت‌های باقی‌مانده',
        textOverlay: 'تنها ۲ نوبت مشاوره حضوری برای روز دوشنبه در مطب پاسداران خالی است.',
        interactiveSticker: {
          type: 'link',
          prompt: 'رزرو آنلاین نوبت ویزیت دکتر شهیدی'
        },
        callToAction: 'دایرکت دهید یا با ۰۲۱-۲۲۰۰۰۰۰ تماس بگیرید.'
      }
    ]
  },
  {
    dayName: 'یکشنبه',
    dayTitle: 'روز مشکلات مفصل فک TMJ و دندان‌قروچه',
    themeFocus: 'علت سردردهای ناشناخته و درمان صدای فک با تزریق بوتاکس عضلات ماستر',
    targetCategory: 'مفصل گیجگاهی فکی TMJ',
    status: 'ready',
    post: {
      id: 'sched-sun',
      topic: 'علت درد فک، سردردهای ناشناخته صبحگاهی و صدا دادن فک هنگام خمیازه (سندرم TMJ)',
      format: 'carousel',
      bestPublishDay: 'یکشنبه',
      bestPublishTime: 'ساعت ۲۱:۰۰ (زمان استراحت و تفریح شبانه)',
      targetCategory: 'مفصل گیجگاهی فکی TMJ',
      hookHeadline: 'صدای تق‌تق فکت موقع غذا خوردن یا سردرد صبحگاهی زنگ خطره یا طبیعیه؟',
      captionBody: `اسلاید ۱: آیا صبح‌ها با احساس خستگی شدید در لپ‌ها و گیجگاه بیدار میشید؟\nاسلاید ۲: علت اغلب دندان‌قروچه و فشار شدید عضله ماستر (عضله جونده) در خواب است که مفصل گیجگاهی فکی رو تحت فشار قرار میده.\nاسلاید ۳: اگر به موقع درمان نشه، مفصل فک دچار سایش دیسک و قفل‌شدگی میشه.\nاسلاید ۴: راهکار نوین بدون جراحی: تزریق دوز استاندارد و علمی بوتاکس درمانی در کمتر از ۵ دقیقه توسط جراح فک.\nاسلاید ۵: نتیجه؟ آزادسازی اسپاسم عضلات، قطع سردردها و حتی باریک‌تر شدن و زاویه‌سازی طبیعی فک!\n\nتجربه شما چی بوده؟ تا حالا صدای تق‌تق فک رو حس کردی؟`,
      callToAction: 'جهت ویزیت و بررسی دیسک مفصل فک کلمه «مفصل فک» را دایرکت کنید.',
      hashtags: ['#درد_فک', '#مفصل_گیجگاهی', '#بوتاکس_فک', '#دندان_قروچه', '#جراح_فک', '#دکتر_اکبر_شهیدی', '#سردرد_میگرنی'],
      visualPrompt: 'اسلایدهای شفاف با تم مینیمال، آناتومی ۳ بعدی عضله ماستر و مقایسه قبل و بعد تزریق بوتاکس.',
      projectedEngagement: '۶.۲٪ (بسیار اشتراک‌گذاری بالا بین دوستان و خانواده)',
      status: 'approved',
      soundSuggestion: 'موزیک ملایم و مدرن اینسترومنتال',
      firstComment: 'تزریق بوتاکس فک در مطب ما کاملاً سرپایی و بدون هیچ دوران نقاهتی انجام میشه 🌸'
    },
    stories: [
      {
        id: 'sun-story-1',
        order: 1,
        timeOfDay: 'ساعت ۱۱:۰۰ صبح',
        storyType: 'tip',
        storyTypeLabel: 'نکته بالینی کوتاه',
        headline: 'آناتومی عضله ماستر',
        visualDescription: 'تصویر ویدیویی ۱۰ ثانیه‌ای از دکتر شهیدی که انگشت خود را روی زاویه فک قرار داده',
        textOverlay: 'دندونات رو محکم روی هم فشار بده؛ برآمدگی سفت زیر دستت عضله ماستره که عامل اصلی دندان‌قروچه‌ست!',
        callToAction: 'اگر این عضله زیادی بزرگ و دردناکه، نیاز به بررسی داره.'
      },
      {
        id: 'sun-story-2',
        order: 2,
        timeOfDay: 'ساعت ۱۵:۳۰ ظهر',
        storyType: 'case_study',
        storyTypeLabel: 'کیس قبل و بعد',
        headline: 'تغییر چهره بعد از بوتاکس فک',
        visualDescription: 'تصویر زاویه فک یک مراجع خانم قبل و ۴ هفته بعد از تزریق درمانی بوتاکس',
        textOverlay: 'کاهش عرض یک سانتی‌متری زاویه فک پایین و رفع کامل دندان‌قروچه شبانه مراجع عزیزمون ✨',
        interactiveSticker: {
          type: 'poll',
          prompt: 'فرم صورتش چطور شده؟',
          options: ['خیلی ظریف و زیباتر', 'عالیه']
        }
      },
      {
        id: 'sun-story-3',
        order: 3,
        timeOfDay: 'ساعت ۲۱:۰۰ شب',
        storyType: 'qna',
        storyTypeLabel: 'باکس پرسش و پاسخ',
        headline: 'پاسخ دکتر شهیدی به سوالات TMJ',
        visualDescription: 'باکس تعاملی اینستاگرام با پس‌زمینه آرام مطب',
        textOverlay: 'هر سوالی راجع به تق‌تق فک، قفل شدن دهان یا تزریق بوتاکس داری بپرس، فردا پاسخ میدم:',
        interactiveSticker: {
          type: 'question_box',
          prompt: 'سوال شما درباره درد یا صدای فک...'
        }
      }
    ]
  },
  {
    dayName: 'دوشنبه',
    dayTitle: 'روز تخصصی جراحی ارتوگناتیک فک',
    themeFocus: 'باطل کردن باور غلط سیم‌پیچی بسته دهان و تغذیه با نی',
    targetCategory: 'جراحی فک و صورت',
    status: 'ready',
    post: {
      id: 'sched-mon',
      topic: 'آیا بعد از جراحی فک، دهان برای چند هفته با سیم بسته می‌شود؟ (باطل کردن باور غلط قدیمی)',
      format: 'reels',
      bestPublishDay: 'دوشنبه',
      bestPublishTime: 'ساعت ۱۹:۴۵ (اوج فعالیت کاربران شمال و غرب تهران)',
      targetCategory: 'جراحی ارتوگناتیک فک',
      hookHeadline: 'بزرگترین وحشتی که مراجعین جراحی فک دارند، اصلاً حقیقت نداره! ❌',
      captionBody: `خیلی از عزیزانی که به مطب پاسداران میان ازم می‌پرسن: «دکتر راسته که بعد عمل فک رو با سیم‌پیچی کامل می‌بندین و تا ۴۰ روز باید با نی غذا بخوریم؟»\n\nپاسخ کوتاه: در جراحی فک مدرن، این روش کاملاً منسوخ شده!\n\nبا استفاده از پلیت‌ها و پیچ‌های تیتانیومی فوق‌العاده ظریف (Rigid Internal Fixation)، قطعات فک در جای ایده‌آل خود به صورت محکم فیکس میشن. نتیجه؟\n✅ شما همون شب در بیمارستان می‌تونید صحبت کنید\n✅ نیازی به سیم‌پیچی بسته شدن دهان نیست\n✅ راه هوایی بازه و تنفس راحته\n✅ تغذیه نرم از روز بعد شروع میشه\n\nاگر به خاطر ترس از سیم‌پیچی جراحی فک رو به تعویق انداختی، عدد ۱ رو در دایرکت بفرست تا عکس‌های قبل و بعد بیماران جدید رو برات بفرستیم.\n\n📍 مطب دکتر اکبر شهیدی پیام - پاسداران`,
      callToAction: 'کلمه «جراحی فک» رو در دایرکت ارسال کن تا برات نوبت مشاوره اختصاصی رزرو کنیم.',
      hashtags: ['#جراحی_فک', '#جراحی_ارتوگناتیک', '#دکتر_اکبر_شهیدی', '#جراح_فک_و_صورت', '#پاسداران', '#فک_پایین', '#ارتودنسی_جراحی'],
      visualPrompt: 'ویدیو ریلز: دکتر شهیدی با روپوش سفید و تایرکس، ماکت جمجمه و پلیت مینیاتوری تیتانیومی را در دست دارد و با لبخند صمیمی به زبان ساده توضیح می‌دهد.',
      projectedEngagement: '۶.۸٪ (بسیار بالا به دلیل پاسخ به سوال پرتکرار)',
      status: 'scheduled',
      soundSuggestion: 'موزیک پرانرژی و مطمئن برای ریلز پزشکی',
      firstComment: 'بیمه‌های تکمیلی بخش زیادی از هزینه جراحی درمانی فک رو پوشش میدن. مدارک رو ما تحویلتون میدیم.'
    },
    stories: [
      {
        id: 'mon-story-1',
        order: 1,
        timeOfDay: 'ساعت ۰۹:۳۰ صبح',
        storyType: 'behind_the_scenes',
        storyTypeLabel: 'اتاق عمل بیمارستان',
        headline: 'قبل از شروع عمل ارتوگناتیک',
        visualDescription: 'نمای محترمانه از چیدمان تجهیزات تیتانیومی استریل اتاق عمل',
        textOverlay: 'امروز جراحی ارتوگناتیک دو فک بیماری رو داریم که به خاطر جلو بودن فک پایین مشکل تنفس و تکلم داشتند. برای سلامتی‌شون دعا کنید 🤲',
        interactiveSticker: {
          type: 'countdown',
          prompt: 'پایان جراحی و گزارش حال عمومی بیمار'
        }
      },
      {
        id: 'mon-story-2',
        order: 2,
        timeOfDay: 'ساعت ۱۳:۴۵ ظهر',
        storyType: 'tip',
        storyTypeLabel: 'نکته طلایی نقاهت',
        headline: 'تغذیه بعد از عمل فک',
        visualDescription: 'توضیح کوتاه متنی همراه با یک آیکون اسموتی مغذی',
        textOverlay: 'برخلاف تصور، بیماران ما از روز دوم انواع سوپ‌های مقوی میکس شده و پوره و مکمل‌های پروتئینی میل می‌کنند و دچار ضعف نمیشن.',
        callToAction: 'آرامش شما اولویت تیم ماست.'
      },
      {
        id: 'mon-story-3',
        order: 3,
        timeOfDay: 'ساعت ۲۲:۰۰ شب',
        storyType: 'case_study',
        storyTypeLabel: 'رضایت بیمار ۳ ماهه',
        headline: 'پیام محبت‌آمیز بیمار عزیز',
        visualDescription: 'اسکرین‌شات از چت صمیمانه بیمار که از تنفس راحت و زیبایی فکش تشکر کرده',
        textOverlay: '«دکتر شهیدی عزیز، بعد از عمل تازه فهمیدم نفس کشیدن راحت یعنی چی... ممنونم از زحماتتون» ❤️',
        interactiveSticker: {
          type: 'link',
          prompt: 'رزرو نوبت مشاوره ارتوگناتیک فک'
        }
      }
    ]
  },
  {
    dayName: 'سه‌شنبه',
    dayTitle: 'روز ایمپلنتولوژی دیجیتال فوری',
    themeFocus: 'کاشت ایمپلنت بدون جراحی و برش لثه (تکنیک دیجیتال Flapless)',
    targetCategory: 'ایمپلنت دیجیتال',
    status: 'ready',
    post: {
      id: 'sched-tue',
      topic: 'کاشت ایمپلنت بدون جراحی و بدون بخیه چطور ممکنه؟ (معرفی جراحی دیجیتال Flapless)',
      format: 'reels',
      bestPublishDay: 'سه‌شنبه',
      bestPublishTime: 'ساعت ۲۰:۱۵ (اوج تعامل مخاطبان شاغل و مدیران)',
      targetCategory: 'ایمپلنتولوژی دیجیتال',
      hookHeadline: 'بدون برش تیغ جراحی، بدون بخیه، بدون درد و تورم: راز ایمپلنت دیجیتال!',
      captionBody: `در متد جراحی سنتی ایمپلنت، لثه برش داده می‌شد و بخیه‌های متعدد می‌خورد.\nاما در کلینیک دکتر اکبر شهیدی در پاسداران چه اتفاقی میفته؟\n\n۱. فک شما با اسکنر سه‌بعدی اسکن میشه و دیگه نیازی به خمیرهای حالت‌تهوع‌آور قالب‌گیری نیست!\n۲. با هوش مصنوعی محل دقیق عصب و ضخامت استخوان شبیه‌سازی میشه.\n۳. یک شابلون جراحی مینیاتوری پرینت میشه و ایمپلنت از یک روزنه ریز در کمتر از ۱۰ دقیقه بدون باز کردن لثه کاشته میشه!\n\nایده‌آل برای افراد شاغل، بیماران دیابتی و عزیزانی که از درد جراحی وحشت دارند.\n\n📍 تهران، پاسداران - کلینیک تخصصی دکتر شهیدی`,
      callToAction: 'برای دریافت نوبت اسکن دیجیتال سه‌بعدی عدد ۳ رو کامنت کن.',
      hashtags: ['#ایمپلنت_دیجیتال', '#ایمپلنت_فوری', '#کاشت_دندان', '#دکتر_اکبر_شهیدی_پیام', '#ایمپلنت_بدون_جراحی', '#پاسداران', '#دندانپزشکی_دیجیتال'],
      visualPrompt: 'دکتر شهیدی با شابلون جراحی سه‌بعدی و اسکنر نوری داخل دهانی، سرعت و راحتی کار را نشان می‌دهد.',
      projectedEngagement: '۷.۱٪ (سیو بسیار بالا توسط مخاطبان ۳۵ سال به بالا)',
      status: 'scheduled',
      soundSuggestion: 'موزیک مدرن تکنولوژی های‌تک',
      firstComment: 'کاشت پایه در این متد فقط ۱۰ دقیقه زمان می‌بره و عصر می‌تونید سر کار برید!'
    },
    stories: [
      {
        id: 'tue-story-1',
        order: 1,
        timeOfDay: 'ساعت ۱۰:۳۰ صبح',
        storyType: 'behind_the_scenes',
        storyTypeLabel: 'تکنولوژی مطب',
        headline: 'کار با اسکنر نوری ۳ بعدی',
        visualDescription: 'ویدیوی کوتاه از اسکن سریع دندان‌های بیمار بدون خمیر قالب‌گیری',
        textOverlay: 'خداحافظی همیشگی با خمیرهای بدمزه قالب‌گیری دندان! اسکن کامل دهان در ۴۰ ثانیه با دقت میکرونی 🎯',
        interactiveSticker: {
          type: 'slider',
          prompt: 'چقدر از قالب‌گیری سنتی بدت میومد؟'
        }
      },
      {
        id: 'tue-story-2',
        order: 2,
        timeOfDay: 'ساعت ۱۶:۰۰ عصر',
        storyType: 'quiz',
        storyTypeLabel: 'پرسش و مقایسه',
        headline: 'ایمپلنت برای دیابتی‌ها',
        visualDescription: 'کارت آموزشی کوتاه با تصویر دکتر شهیدی',
        textOverlay: 'آیا افراد مبتلا به دیابت می‌تونن ایمپلنت انجام بدن؟',
        interactiveSticker: {
          type: 'poll',
          prompt: 'دیابتی‌ها و ایمپلنت؟',
          options: ['بله با تکنیک دیجیتال Flapless', 'خیر ممنوعه']
        },
        callToAction: 'پاسخ: بله! به دلیل عدم برش لثه و خونریزی صفر، جوش خوردن استخوان با ایمپلنت دیجیتال عالی پیش میره.'
      },
      {
        id: 'tue-story-3',
        order: 3,
        timeOfDay: 'ساعت ۲۱:۴۵ شب',
        storyType: 'cta_booking',
        storyTypeLabel: 'مشاوره فوری دایرکت',
        headline: 'بررسی رادیولوژی دندان از راه دور',
        visualDescription: 'بک‌گراند شیک مطب با دکمه ارسال دایرکت',
        textOverlay: 'اگر دندان از دست رفته داری، عکس دهان یا عکس OPG رو همین الان به دایرکت ارسال کن تا برآورد طرح درمان بشه.',
        callToAction: 'پاسخگویی سریع توسط تیم بالینی مطب دکتر شهیدی'
      }
    ]
  },
  {
    dayName: 'چهارشنبه',
    dayTitle: 'روز کانتورینگ صورت و ژنیوپلاستی چانه',
    themeFocus: 'مقایسه صادقانه پروتز سیلیکونی با جراحی استخوانی ژنیوپلاستی',
    targetCategory: 'زیبایی صورت و چانه',
    status: 'ready',
    post: {
      id: 'sched-wed',
      topic: 'کیس جراحی واقعی: جلو آوردن چانه (Genioplasty) بدون پروتز سیلیکونی',
      format: 'carousel',
      bestPublishDay: 'چهارشنبه',
      bestPublishTime: 'ساعت ۲۱:۰۰ (زمان تفریح و اسکرول شبانه)',
      targetCategory: 'زیبایی صورت و چانه',
      hookHeadline: 'پروتز چانه بذارم یا استخوان فک خودمو جابجا کنم؟ مقایسه صادقانه از زبان جراح فک!',
      captionBody: `اسلاید ۱: تفاوت ژنیوپلاستی و پروتز چانه چیه؟\nاسلاید ۲: پروتز سیلیکونی یک جسم خارجی است که روی استخوان چانه قرار می‌گیرد؛ معایب: احتمال جابجایی در اثر ضربه، جذب استخوان زیر پروتز و غیرطبیعی شدن فرم چانه در سال‌های بعد.\nاسلاید ۳: ژنیوپلاستی (جراحی استخوان چانه): استخوان خود بیمار با برش میلی‌متری هدایت شده و در موقعیت طبیعی فیکس میشه. بافت کاملاً زنده، مادام‌العمر و بدون تغییر فرم!\nاسلاید ۴: عکس‌های قبل و بعد کیس امروز مطب پاسداران از نمای نیم‌رخ (تغییر چشمگیر خط فک).\n\nکدوم روش به نظرتون عقلانی‌تره؟ نظرتون رو کامنت کنید.`,
      callToAction: 'برای آنالیز تقارن صورت و چانه، عکس رخ و نیم‌رخ خود را دایرکت بفرستید.',
      hashtags: ['#ژنیوپلاستی', '#جراحی_چانه', '#کانتورینگ_صورت', '#زاویه_فک', '#دکتر_اکبر_شهیدی', '#جراح_فک_پاسداران'],
      visualPrompt: 'اسلایدهای مقایسه‌ای شفاف با تصاویر قبل و بعد، گراف‌های استخوانی و مدل‌های سه‌بعدی.',
      projectedEngagement: '۸.۴٪ (سیو و شیر فوق‌العاده بالا)',
      status: 'approved',
      soundSuggestion: 'موزیک شیک و لوکس اینسترومنتال',
      firstComment: 'ژنیوپلاستی برخلاف پروتز هیچ‌وقت نیاز به تعویض نداره چون جزئی از اسکلت طبیعی صورتتونه.'
    },
    stories: [
      {
        id: 'wed-story-1',
        order: 1,
        timeOfDay: 'ساعت ۱۱:۱۵ صبح',
        storyType: 'case_study',
        storyTypeLabel: 'تحول نیم‌رخ',
        headline: 'قبل و بعد ژنیوپلاستی',
        visualDescription: 'عکس نیم‌رخ بیمار که چانه‌اش عقب بوده و حالا خط فک شارپ و هماهنگ دارد',
        textOverlay: 'تنها با ۳ میلی‌متر جابجایی استخوان چانه، خط فک و تناسب بینی و لب‌ها به حالت ایده‌آل طلایی رسید ✨',
        interactiveSticker: {
          type: 'slider',
          prompt: 'نظرت درباره این تغییر طبیعی؟'
        }
      },
      {
        id: 'wed-story-2',
        order: 2,
        timeOfDay: 'ساعت ۱۵:۴۵ ظهر',
        storyType: 'tip',
        storyTypeLabel: 'هشدار تخصصی',
        headline: 'چرا ژل چانه راهکار دائمی نیست؟',
        visualDescription: 'توضیح کوتاه از افتادگی ژل و عوارض تزریق‌های مکرر',
        textOverlay: 'تزریق مکرر حجم بالای فیلر ژل در چانه در بلندمدت باعث شل شدن بافت پوست میشه. جراحی استخوان یکبار برای همیشه است.',
        callToAction: 'انتخاب علمی برای زیبایی پایدار صورت'
      },
      {
        id: 'wed-story-3',
        order: 3,
        timeOfDay: 'ساعت ۲۰:۳۰ شب',
        storyType: 'cta_booking',
        storyTypeLabel: 'آنالیز آنلاین فرم فک',
        headline: 'آنالیز نیم‌رخ در دایرکت',
        visualDescription: 'کارت راهنمای نحوه ارسال عکس صحیح رخ و نیم‌رخ بدون فیلتر',
        textOverlay: 'عکس نیم‌رخ بدون لبخندت رو دایرکت بفرست تا زاویه فک و چانه‌ت توسط دکتر شهیدی بررسی بشه.',
        callToAction: 'پاسخ تحلیلی در کمتر از ۲۴ ساعت در دایرکت پیج'
      }
    ]
  },
  {
    dayName: 'پنجشنبه',
    dayTitle: 'روز مراقبت‌های بعد از جراحی و نکات طلایی',
    themeFocus: '۳ اشتباه رایج بعد از جراحی‌های دهان و فک که باعث خونریزی یا عفونت میشه',
    targetCategory: 'آموزش بیمار و مراقبت',
    status: 'ready',
    post: {
      id: 'sched-thu',
      topic: '۳ اشتباه رایج بعد از جراحی دهان و کشیدن دندان عقل که نباید انجام بدی!',
      format: 'reels',
      bestPublishDay: 'پنجشنبه',
      bestPublishTime: 'ساعت ۱۸:۳۰ (قبل از دورهمی‌های آخر هفته)',
      targetCategory: 'آموزش بیمار و مراقبت',
      hookHeadline: 'اگر بعد از کشیدن دندان یا جراحی این ۳ کار رو بکنی، درد و عفونتت چند برابر میشه!',
      captionBody: `خیلی از عوارض بعد از جراحی دهان به خاطر اشتباهات ساده روز اوله:\n\n۱. تُف کردن مکرر بزاق: باعث جدا شدن لخته خون (Dry Socket) و درد وحشتناک میشه! آب دهان رو باید آرام قورت بدید.\n۲. نوشیدن مایعات با نی: فشار منفی نی لخته رو از جاش درمیاره.\n۳. استفاده از کمپرس گرم در ۲۴ ساعت اول: روز اول فقط کمپرس یخ برای مهار ورم؛ بعد از ۴۸ ساعت کمپرس ولرم مجازه.\n\nاین پست رو حتماً سیو کن تا بعد از جراحی سردرگم نشی یا بفرست برای کسی که این هفته نوبت داره!`,
      callToAction: 'سوالی درباره مراقبت‌های بعد از عمل داری؟ کامنت کن تا منشی مطب راهنمایی کنه.',
      hashtags: ['#مراقبت_بعد_عمل', '#جراحی_دهان', '#دندان_عقل', '#دکتر_اکبر_شهیدی', '#کمپرس_یخ', '#توصیه_پزشکی'],
      visualPrompt: 'دکتر شهیدی به صورت سریع و جذاب ۳ نباید بزرگ روز عمل را با علائم تصویری و کمپرس نشان می‌دهد.',
      projectedEngagement: '۹.۱٪ (بیشترین نرخ ذخیره در میان تمام پست‌ها)',
      status: 'scheduled',
      soundSuggestion: 'صدای ترند هشداری پزشکی همراه با افکت صوتی تیک',
      firstComment: 'کتابچه جامع مراقبت بعد از جراحی مطب پاسداران بعد از هر عمل به بیمار تحویل داده میشه.'
    },
    stories: [
      {
        id: 'thu-story-1',
        order: 1,
        timeOfDay: 'ساعت ۱۰:۰۰ صبح',
        storyType: 'behind_the_scenes',
        storyTypeLabel: 'اتاق استریل مطب',
        headline: 'استاندارد استریلیزاسیون کلینیک',
        visualDescription: 'نمایی از اتوکلاوهای کلاس B و بسته‌بندی‌های ایزوله وسایل جراحی',
        textOverlay: 'سلامت شما خط قرمز ماست. تمام ست‌های جراحی در بالاترین سطح استانداردهای بیمارستانی اتوکلاو میشن ✨',
        interactiveSticker: {
          type: 'poll',
          prompt: 'استریل بودن چقدر براتون مهمه؟',
          options: ['اولویت اولمه', 'خیلی مهم']
        }
      },
      {
        id: 'thu-story-2',
        order: 2,
        timeOfDay: 'ساعت ۱۴:۱۵ ظهر',
        storyType: 'tip',
        storyTypeLabel: 'پاسخ ویدیویی کوتاه',
        headline: 'مصرف آنتی‌بیوتیک‌ها',
        visualDescription: 'ویدیوی سلفی ۲۰ ثانیه‌ای دکتر شهیدی در حال توضیح زمان مصرف کپسول‌ها',
        textOverlay: 'داروهای تجویزی رو سر ساعت مصرف کنید حتی اگر دردی حس نمی‌کنید تا از عفونت جلوگیری بشه.',
        callToAction: 'سلامتی شما حاصل همکاری مشترک ماست.'
      },
      {
        id: 'thu-story-3',
        order: 3,
        timeOfDay: 'ساعت ۱۹:۴۵ شب',
        storyType: 'cta_booking',
        storyTypeLabel: 'نوبت‌های هفته آینده',
        headline: 'تقویم نوبت‌های هفته بعد باز شد',
        visualDescription: 'تصویر تقویم کاری کلینیک پاسداران برای هفته پیش‌رو',
        textOverlay: 'برای برنامه‌ریزی ویزیت و جراحی‌های هفته آینده، همین امشب نوبت خود را ثبت کنید.',
        interactiveSticker: {
          type: 'link',
          prompt: 'رزرو آنلاین نوبت ویزیت مطب پاسداران'
        }
      }
    ]
  },
  {
    dayName: 'جمعه',
    dayTitle: 'روز آرامش، لبخند و بازگشت اعتمادبه‌نفس',
    themeFocus: 'تاثیر تحول جراحی فک و صورت بر کیفیت زندگی و روابط اجتماعی بیماران',
    targetCategory: 'سبک زندگی و رضایت بیماران',
    status: 'ready',
    post: {
      id: 'sched-fri',
      topic: 'جراحی فک فقط یک تغییر ظاهری نیست؛ بازگشت لبخند و اعتماد به نفس بعد از سال‌ها پنهان کردن دندان‌هاست',
      format: 'reels',
      bestPublishDay: 'جمعه',
      bestPublishTime: 'ساعت ۱۷:۰۰ عصر جمعه (زمان مطالعه و تفکر)',
      targetCategory: 'سبک زندگی و رضایت مراجعین',
      hookHeadline: '«سال‌ها موقع خندیدن دستم رو جلوی دهنم می‌گرفتم تا کسی متوجه نامتقارن بودن فکم نشه...»',
      captionBody: `این جمله رو تقریباً هر هفته از یکی از مراجعین عزیزمون می‌شنویم.\nمشکلات اسکلتی فک فقط روی جویدن و تنفس اثر نمی‌ذاره؛ بلکه مستقیماً روی اعتماد به نفس و حضور در جامعه سایه می‌ندازه.\n\nدیدن لبخند از ته دل بیمارانی که چند ماه بعد از جراحی ارتوگناتیک با انرژی مضاعف به مطب میان، بزرگترین افتخار و انگیزه کاری تیم ماست.\n\nجمعه آرامی رو براتون آرزو می‌کنیم 🌿\nاگر سوال یا ابهامی دارید، در دایرکت در خدمت شما هستیم.`,
      callToAction: 'این ویدیو رو برای کسی که دوست داری دوباره از ته دل بخنده بفرست ❤️',
      hashtags: ['#تحول_لبخند', '#جراحی_فک_تهران', '#اعتماد_به_نفس', '#دکتر_اکبر_شهیدی', '#زیبایی_طبیعی', '#پاسداران'],
      visualPrompt: 'ویدیوی احساسی با موزیک آرامش‌بخش، لبخند بیماران بعد از بهبودی کامل و نگاه پر از امید.',
      projectedEngagement: '۸.۹٪ (سیو و بازنشر احساسی بالا)',
      status: 'scheduled',
      soundSuggestion: 'موزیک پیانو آرامش‌بخش و سینمایی',
      firstComment: 'زندگی کوتاه‌تر از اونه که خنده‌ت رو پنهان کنی 🤍'
    },
    stories: [
      {
        id: 'fri-story-1',
        order: 1,
        timeOfDay: 'ساعت ۱۲:۰۰ ظهر',
        storyType: 'behind_the_scenes',
        storyTypeLabel: 'جمعه آرام',
        headline: 'آخر هفته بخیر',
        visualDescription: 'تصویر یک فنجان چای و کتاب با نور ملایم پنجره مطب یا محیط آرام',
        textOverlay: 'امیدوارم جمعه آرامی در کنار خانواده داشته باشید ☕️ فردا با انرژی دوباره در کنارتونیم.',
        interactiveSticker: {
          type: 'slider',
          prompt: 'آرامش امروزتون؟'
        }
      },
      {
        id: 'fri-story-2',
        order: 2,
        timeOfDay: 'ساعت ۱۸:۳۰ عصر',
        storyType: 'quiz',
        storyTypeLabel: 'کوییز سرگرمی جمعه',
        headline: 'تست هوش لبخند',
        visualDescription: 'کارت تصویری تقارن خط دندان با مردمک چشم‌ها',
        textOverlay: 'آیا می‌دونستید خط دندان‌های بالا باید دقیقاً موازی خط افقی چشم‌ها باشه؟',
        interactiveSticker: {
          type: 'poll',
          prompt: 'آیا تقارن فکت کامله؟',
          options: ['بله کاملاً', 'کمی انحراف داره']
        },
        callToAction: 'انحراف‌های فک با جراحی ارتوگناتیک کاملاً اصلاح میشن.'
      },
      {
        id: 'fri-story-3',
        order: 3,
        timeOfDay: 'ساعت ۲۲:۰۰ شب',
        storyType: 'cta_booking',
        storyTypeLabel: 'پیش‌نمایش محتوای شنبه',
        headline: 'فردا شب منتظر این ریلز باشید',
        visualDescription: 'کاور هیجان‌انگیز از ریلز شنبه پیرامون دندان عقل و عصب فک',
        textOverlay: 'فردا شب یک ویدیوی جنجالی درباره ترس از بی‌حسی لب موقع کشیدن دندان عقل منتشر می‌کنیم. از دست ندید!',
        interactiveSticker: {
          type: 'countdown',
          prompt: 'انتشار ریلز دندان عقل شنبه ساعت ۲۰:۳۰'
        }
      }
    ]
  }
];

export const initialInstagramSuggestions: InstagramPostSuggestion[] = [
  ...initialWeeklySchedule.map(s => s.post)
];

export const initialTrends: ScrapedTrendItem[] = [
  {
    id: 'trend-1',
    title: 'چالش مقایسه صورت قبل و بعد ارتوگناتیک با موزیک ترند اینستاگرام (Before/After Reveal)',
    creatorHandle: '@oral_maxillofacial_world',
    viewsCount: 1420000,
    likesCount: 89400,
    commentsCount: 3120,
    viralityScore: 96,
    sourceTag: '#orthognathicsurgery',
    summary: 'ترند نمایش تحول چشمگیر تقارن لبخند و زاویه فک ۳ ماه بعد از جراحی ارتوگناتیک با ترنزیشن کلاکت دست.',
    hookIdea: '«صورت قبلی‌مو یادتونه؟ این من بعد از جراحی ارتوگناتیک فک دکتر شهیدی‌ام!»',
    whyItWorked: 'مخاطب ایرانی عاشق تغییرات طبیعی و اعتمادبه‌نفس افراد پس از حل نقص‌های تقارن فک است.',
    dateScraped: 'امروز توسط Apify',
  },
  {
    id: 'trend-2',
    title: 'تست واقع‌گرایانه: چقدر درد داشت کشیدن دندان عقل نهفته؟ (ولاگ روز عمل)',
    creatorHandle: '@dr_dent_daily',
    viewsCount: 680000,
    likesCount: 42000,
    commentsCount: 1980,
    viralityScore: 88,
    sourceTag: '#wisdomteethremoval',
    summary: 'ولاگ یک دقیقه‌ای از لحظه ورود به مطب تا خروج و شب اول بعد از کشیدن دندان عقل با تاکید روی مراقبت با کمپرس سرد.',
    hookIdea: '«رفتم پیش جراح فک برای دندان عقلی که روی عصب بود، واقعاً درد داشت؟!»',
    whyItWorked: 'ترس از دندان عقل همه‌گیر است. ولاگ صادقانه بیمار و بیان حس رضایت، نرخ تبدیل لید را تا ۳۰۰٪ بالا می‌برد.',
    dateScraped: 'دیروز توسط Apify',
  },
  {
    id: 'trend-3',
    title: 'اسکنر سه‌بعدی دهان چطور جایگزین خمیر بدمزه قالب‌گیری دندان شد؟',
    creatorHandle: '@digital_dentistry_tech',
    viewsCount: 820000,
    likesCount: 56000,
    commentsCount: 1430,
    viralityScore: 91,
    sourceTag: '#digitalimplants',
    summary: 'مقایسه خنده‌دار حالت تهوع بیماران با خمیر آلژینات قدیمی در برابر اسکن دیجیتال ۴۰ ثانیه‌ای با نور لیزر.',
    hookIdea: '«اگه تو هم از قالب‌گیری سنتی دندان متنفری، این ویدیو رو ببین!»',
    whyItWorked: 'ترکیب شوخی و معرفی تکنولوژی پیشرفته مطب، تعامل و اشتراک‌گذاری فوق‌العاده‌ای در استوری‌ها دارد.',
    dateScraped: '۳ روز پیش توسط Apify',
  }
];

export const initialArticles: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'راهنمای جامع جراحی ارتوگناتیک فک: سن مناسب، هزینه و دوره نقاهت در تهران',
    category: 'جراحی فک',
    publishDate: '۱۴۰۳/۰۶/۲۰',
    status: 'published',
    seoScore: 94,
    targetKeyword: 'جراحی فک و صورت تهران',
    readTimeMin: 8,
    views: 3410
  },
  {
    id: 'art-2',
    title: 'ایمپلنت دیجیتال چیست و چه فرقی با ایمپلنت معمولی دارد؟',
    category: 'ایمپلنتولوژی',
    publishDate: '۱۴۰۳/۰۶/۱۵',
    status: 'published',
    seoScore: 89,
    targetKeyword: 'ایمپلنت دیجیتال فوری',
    readTimeMin: 6,
    views: 2890
  },
  {
    id: 'art-3',
    title: 'علائم خطرناک دندان عقل نهفته و زمان طلایی جراحی برای پیشگیری از کیست فک',
    category: 'دندان عقل',
    publishDate: '۱۴۰۳/۰۶/۲۸',
    status: 'scheduled',
    seoScore: 91,
    targetKeyword: 'جراحی دندان عقل نهفته',
    readTimeMin: 5,
    views: 0
  },
  {
    id: 'art-4',
    title: 'درمان قطعی دندان قروچه و سایش دندان با تزریق بوتاکس عضلات فک',
    category: 'مفصل فک',
    publishDate: '۱۴۰۳/۰۷/۰۵',
    status: 'draft',
    seoScore: 78,
    targetKeyword: 'بوتاکس فک دندان قروچه',
    readTimeMin: 4,
    views: 0
  }
];

export const initialAppointments: OnlineAppointment[] = [];

export const initialBudgetChannels: BudgetChannel[] = [
  {
    id: 'b-google',
    name: 'google_ads',
    nameFa: 'گوگل ادز (Google Ads)',
    percentage: 45,
    allocatedBudgetToman: 45000000,
    cplToman: 380000, // Cost per lead
    expectedLeads: 118,
    expectedBookings: 32,
    color: '#3b82f6'
  },
  {
    id: 'b-yektanet',
    name: 'yektanet',
    nameFa: 'یکتانت (ریتارگتینگ و بنر همسان)',
    percentage: 20,
    allocatedBudgetToman: 20000000,
    cplToman: 240000,
    expectedLeads: 83,
    expectedBookings: 14,
    color: '#f59e0b'
  },
  {
    id: 'b-instagram',
    name: 'instagram',
    nameFa: 'اینستاگرام و تبلیغات اینفلوئنسری',
    percentage: 20,
    allocatedBudgetToman: 20000000,
    cplToman: 280000,
    expectedLeads: 71,
    expectedBookings: 19,
    color: '#ec4899'
  },
  {
    id: 'b-seo',
    name: 'seo',
    nameFa: 'سئو سایت و تولید مقالات تخصصی',
    percentage: 10,
    allocatedBudgetToman: 10000000,
    cplToman: 150000,
    expectedLeads: 66,
    expectedBookings: 21,
    color: '#10b981'
  },
  {
    id: 'b-sms',
    name: 'sms',
    nameFa: 'سامانه پیامک و یادآوری منشی',
    percentage: 5,
    allocatedBudgetToman: 5000000,
    cplToman: 45000,
    expectedLeads: 40,
    expectedBookings: 15,
    color: '#8b5cf6'
  }
];

export const smsTemplates = [
  {
    id: 'tmpl-location',
    title: 'لوکیشن و آدرس مطب پاسداران',
    type: 'location' as const,
    text: `مراجعه‌کننده گرامی سلام.\nلوکیشن مطب دکتر اکبر شهیدی پیام (جراح فک و صورت):\nتهران، پاسداران، نبش بوستان دوم، مجتمع پزشکی، طبقه ۳ واحد ۶.\nلینک مسیریابی نشان/بلد: https://nshn.ir/shahidi-clinic\nتلفن مطب: ۰۲۱۲۲۵۵XXXX`
  },
  {
    id: 'tmpl-confirm',
    title: 'تأیید وقت ویزیت حضوری',
    type: 'confirm' as const,
    text: `سرکار خانم/جناب آقای {نام},\nنوبت ویزیت شما با دکتر اکبر شهیدی پیام برای روز {روز} ساعت {ساعت} در مطب پاسداران ثبت شد.\nلطفاً ۱۰ دقیقه قبل از ساعت مقرر همراه با عکس رادیولوژی (OPG/CBCT در صورت وجود) تشریف بیاورید.`
  },
  {
    id: 'tmpl-reminder',
    title: 'یادآوری نوبت فردا',
    type: 'reminder' as const,
    text: `یادآوری نوبت فردا:\nسلام {نام} عزیز، نوبت جراحی/مشاوره شما با دکتر اکبر شهیدی پیام فردا ساعت {ساعت} است.\nدر صورت نیاز به تغییر زمان نوبت لطفاً نهایتاً تا ساعت ۱۹ امروز با شماره منشی تماس حاصل فرمایید.`
  },
  {
    id: 'tmpl-post-care',
    title: 'مراقبت‌های بعد از جراحی',
    type: 'custom' as const,
    text: `سلام {نام} گرامی.\nامیدواریم دوران بهبودی پس از جراحی را به خوبی سپری کنید.\nلطفاً تا ۲۴ ساعت کمپرس سرد متناوب، رژیم غذایی خنک و نرم و مصرف منظم داروهای تجویز شده را رعایت فرمایید.\nتیم پشتیبانی مطب دکتر شهیدی در کنار شماست.`
  }
];

export const initialChannelHubConfig = {
  telegramChannelName: 'کانال رسمی دکتر اکبر شهیدی پیام | جراح فک و صورت',
  telegramChannelHandle: '@DrShahidiJawSurgery',
  telegramSubscribers: 4850,
  telegramConnected: true,
  baleChannelName: 'کانال نوبت‌دهی و آموزش جراحی فک و ایمپلنت (بله)',
  baleChannelHandle: 'ble.ir/drshahidiclinic',
  baleSubscribers: 3240,
  baleConnected: true,
  proxyStatus: 'direct_ir_server' as const,
  autoAppendBotButtons: true,
  botUsernameTelegram: '@ShahidiClinicBot',
  botUsernameBale: 'ble.ir/ShahidiBot'
};

export const initialChannelPosts: any[] = [];


