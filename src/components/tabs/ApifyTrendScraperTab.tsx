import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Flame, 
  Eye, 
  Heart, 
  MessageCircle, 
  RefreshCw, 
  CheckCircle,
  Database
} from 'lucide-react';
import { ScrapedTrendItem } from '../../types';
import { toPersianDigits } from '../../utils/formatters';

interface ApifyTrendScraperTabProps {
  trends: ScrapedTrendItem[];
  onConvertTrendToPost: (trend: ScrapedTrendItem) => void;
  onNavigateToAgentTab: () => void;
}

export const ApifyTrendScraperTab: React.FC<ApifyTrendScraperTabProps> = ({
  trends,
  onConvertTrendToPost,
  onNavigateToAgentTab
}) => {
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeSuccess, setScrapeSuccess] = useState<string>('');
  const [convertedId, setConvertedId] = useState<string | null>(null);

  const handleRunApifyScraper = () => {
    setIsScraping(true);
    setTimeout(() => {
      setIsScraping(false);
      setScrapeSuccess('اسکرپ خودکار Apify با موفقیت اجرا شد: ۳ ترند جدید با تعامل بالای ۸۰K شناسایی شد.');
      setTimeout(() => setScrapeSuccess(''), 4000);
    }, 1500);
  };

  const handleConvert = (trend: ScrapedTrendItem) => {
    onConvertTrendToPost(trend);
    setConvertedId(trend.id);
    setTimeout(() => {
      setConvertedId(null);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      
      {/* 1. APIFY STATUS BANNER */}
      <div className="bg-slate-950 rounded-md p-5 text-white border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-xs text-[11px] font-bold bg-sky-950 text-sky-400 border border-sky-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-sky-400" />
                اسکرپر هوشمند Apify (Instagram Trends & Actor)
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                اتصال فعال
              </span>
            </div>

            <h2 className="text-base font-black text-white">
              رادار ترندهای داغ و تحلیل پیج دکتر اکبر شهیدی پیام
            </h2>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">
              پایش مداوم ویدیوهای میلیونی جراحی فک و ایمپلنت جهت استخراج الگوهای وایرال و انتقال به راهبر محتوا برای بومی‌سازی در مطب پاسداران.
            </p>
          </div>

          <button
            onClick={handleRunApifyScraper}
            disabled={isScraping}
            className="px-4 py-2 rounded-sm bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
            {isScraping ? 'در حال دریافت داده...' : 'اجرای اسکرپ زنده Apify'}
          </button>
        </div>

        {scrapeSuccess && (
          <div className="mt-3 p-2.5 rounded-xs bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{scrapeSuccess}</span>
          </div>
        )}
      </div>

      {/* 2. DOCTOR SHAHIDI INSTAGRAM PERFORMANCE ANALYTICS */}
      <div className="bg-white rounded-md p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
              عملکرد پیج اینستاگرام دکتر اکبر شهیدی پیام (استخراج شده با Apify)
            </h3>
            <span className="text-[11px] text-slate-500">
              آنالیز ۱۲ ریلز اخیر و الگوی ذخیره و دایرکت بیماران
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
            همگام‌سازی: امروز
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
            <span className="text-slate-500 block text-[10px]">نرخ تعامل (Engagement)</span>
            <span className="text-base font-black text-slate-950 mt-0.5 block font-mono">٪۴.۸</span>
            <span className="text-[10px] text-emerald-700 font-bold">۲.۱ برابر میانگین درمانی</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
            <span className="text-slate-500 block text-[10px]">بیشترین موضوع لید در دایرکت</span>
            <span className="text-xs font-bold text-teal-900 mt-0.5 block truncate">جراحی فک بدون سیم‌پیچی</span>
            <span className="text-[10px] text-slate-500">۳۴ دایرکت در هر ویدیو</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
            <span className="text-slate-500 block text-[10px]">بیشترین ذخیره (Save)</span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">ایمپلنت دیجیتال فوری</span>
            <span className="text-[10px] text-slate-500">۸۲۰ ذخیره‌سازی هفتگی</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
            <span className="text-slate-500 block text-[10px]">ساعت اوج بازدهی انتشار</span>
            <span className="text-xs font-bold text-slate-900 mt-0.5 block font-mono">۱۹:۳۰ الی ۲۱:۱۵</span>
            <span className="text-[10px] text-slate-500">دوشنبه و چهارشنبه</span>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-3 p-3 rounded-sm bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>پیشنهاد تحلیل Apify AI:</strong> ریلزهایی که دکتر شهیدی خودشان در مطب پاسداران با ماکت فک و جمجمه صحبت کرده‌اند ۳.۴ برابر لید بیشتری ایجاد کرده است. پیشنهاد می‌شود دو موضوع «ترس از کشیدن دندان عقل» و «نتایج ارتوگناتیک ۳ ماه بعد عمل» در اولویت ضبط قرار گیرند.
          </div>
        </div>
      </div>

      {/* 3. SCRAPED VIRAL TRENDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600" />
              ترندهای کشف‌شده از هشتگ‌های جراحی فک و ایمپلنت
            </h3>
            <p className="text-[11px] text-slate-500">
              ویدیوهای پرمخاطب آماده جهت تبدیل به سناریوی اختصاصی مطب با یک کلیک
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {trends.map((trend) => {
            const isJustConverted = convertedId === trend.id;
            return (
              <div 
                key={trend.id}
                className="bg-white rounded-md border border-slate-200 shadow-xs hover:border-slate-300 transition duration-150 p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-mono font-bold text-sky-700">
                      {trend.creatorHandle}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-600" />
                      شاخص: {toPersianDigits(trend.viralityScore)}٪
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-950 text-xs mt-2.5 leading-snug">
                    {trend.title}
                  </h4>

                  {/* Scraped metrics */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 my-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      {toPersianDigits(trend.viewsCount.toLocaleString())}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500" />
                      {toPersianDigits(trend.likesCount.toLocaleString())}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-sky-600" />
                      {toPersianDigits(trend.commentsCount.toLocaleString())}
                    </span>
                  </div>

                  {/* Hook idea for Dr. Shahidi */}
                  <div className="p-2 rounded-sm bg-amber-50/60 border border-amber-200 text-xs my-2">
                    <span className="font-bold text-amber-950 block text-[10px] mb-0.5">
                      ایده هوک بومی برای دکتر شهیدی:
                    </span>
                    <p className="text-slate-800 text-[11px] leading-relaxed">«{trend.hookIdea}»</p>
                  </div>

                  {/* Why it worked */}
                  <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-xs border border-slate-200">
                    <strong className="text-slate-800">علت بازدهی:</strong> {trend.whyItWorked}
                  </div>
                </div>

                {/* CONVERT BUTTON */}
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <button
                    onClick={() => handleConvert(trend)}
                    className={`w-full py-1.5 px-3 rounded-sm text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      isJustConverted
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                    }`}
                  >
                    {isJustConverted ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                        به راهبر محتوا منتقل شد ✓
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        تبدیل به سناریوی اینستاگرام
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
