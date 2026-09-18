import React, { useState } from 'react';
import { 
  Power, 
  Wallet, 
  AlertTriangle, 
  Clock, 
  Check, 
  PhoneCall, 
  Sparkles, 
  PlusCircle,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { AdSystemConfig, KeywordPerformance } from '../../types';
import { toPersianDigits, formatToman } from '../../utils/formatters';

interface ClickAdsCommandTabProps {
  config: AdSystemConfig;
  keywords: KeywordPerformance[];
  onToggleMasterSwitch: () => void;
  onToggleKeyword: (id: string) => void;
  onUpdateSchedule: (newSchedule: Partial<AdSystemConfig>) => void;
  onAddBalance: (platform: 'yektanet' | 'google_ads', amount: number) => void;
}

export const ClickAdsCommandTab: React.FC<ClickAdsCommandTabProps> = ({
  config,
  keywords,
  onToggleMasterSwitch,
  onToggleKeyword,
  onUpdateSchedule,
  onAddBalance
}) => {
  const [platformFilter, setPlatformFilter] = useState<'all' | 'google_ads' | 'yektanet'>('all');
  const [chargeAmountInput, setChargeAmountInput] = useState<string>('10000000');
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);
  const [targetPlatform, setTargetPlatform] = useState<'yektanet' | 'google_ads'>('yektanet');
  const [chargeSuccessMsg, setChargeSuccessMsg] = useState<string>('');

  const isYektanetLow = config.yektanetBalanceToman < config.yektanetAlertThresholdToman;
  const isGoogleAdsLow = config.googleAdsBalanceAed < config.googleAdsAlertThresholdAed;

  const filteredKeywords = keywords.filter(kw => {
    if (platformFilter === 'all') return true;
    return kw.platform === platformFilter;
  });

  const totalCalls = keywords.reduce((sum, k) => sum + (k.active ? k.calls : 0), 0);
  const totalClicks = keywords.reduce((sum, k) => sum + (k.active ? k.clicks : 0), 0);
  const totalSpentToman = keywords.reduce((sum, k) => sum + (k.active ? k.totalCostToman : 0), 0);

  const handleRecharge = () => {
    const val = Number(chargeAmountInput);
    if (!val || val <= 0) return;
    onAddBalance(targetPlatform, val);
    setChargeSuccessMsg(`اعتبار ${targetPlatform === 'yektanet' ? 'یکتانت' : 'گوگل ادز'} افزایش یافت.`);
    setTimeout(() => {
      setChargeSuccessMsg('');
      setShowRechargeModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      
      {/* 1. MASTER SWITCH COMMAND BAR */}
      <div className={`rounded-md p-5 border transition-colors ${
        config.masterSwitchActive 
          ? 'bg-slate-950 text-white border-emerald-500/40' 
          : 'bg-slate-950 text-white border-rose-500/50'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-xs text-[11px] font-bold border flex items-center gap-1.5 ${
                config.masterSwitchActive 
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.masterSwitchActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {config.masterSwitchActive ? 'کمپین‌ها فعال و در حال جذب لید' : 'توقف اضطراری کامل (Emergency Stop)'}
              </span>
              <span className="text-[11px] text-slate-400">
                وضعیت: {config.lastToggledAt}
              </span>
            </div>

            <h2 className="text-base font-black tracking-tight text-white">
              کلید قطع و وصل اضطراری تبلیغات (Master Switch)
            </h2>
            
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              توقف آنی کلیه کمپین‌های گوگل ادز و بنرهای ریتارگتینگ یکتانت در صورت تکمیل ظرفیت نوبت‌ها یا سفر علمی دکتر شهیدی، بدون اختلال در تنظیمات مزایده.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleMasterSwitch}
            className={`px-4 py-2.5 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition border ${
              config.masterSwitchActive
                ? 'bg-rose-700 hover:bg-rose-800 text-white border-rose-600'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
            }`}
          >
            <Power className="w-4 h-4" />
            {config.masterSwitchActive ? 'توقف اضطراری کل تبلیغات' : 'فعال‌سازی مجدد کلیه کمپین‌ها'}
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME BALANCE DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Yektanet Balance Card */}
        <div className="bg-white rounded-md p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xs bg-amber-50 border border-amber-300 text-amber-900 font-black text-xs flex items-center justify-center">
                یک
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-xs">موجودی پنل یکتانت (ایران)</h3>
                <span className="text-[10px] text-slate-400">بنرهای ریتارگتینگ و کلیکی همسان</span>
              </div>
            </div>

            <button
              onClick={() => {
                setTargetPlatform('yektanet');
                setChargeAmountInput('10000000');
                setShowRechargeModal(true);
              }}
              className="text-xs px-2.5 py-1.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1 transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              شارژ موجودی
            </button>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-950 font-mono">
              {formatToman(config.yektanetBalanceToman)}
            </span>
            <span className="text-[11px] text-slate-500">
              آستانه هشدار: {formatToman(config.yektanetAlertThresholdToman)}
            </span>
          </div>

          {isYektanetLow ? (
            <div className="mt-2.5 p-2 rounded-sm bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>موجودی رو به اتمام است؛ جهت پایداری ریتارگتینگ شارژ کنید.</span>
            </div>
          ) : (
            <div className="mt-2.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-xs flex items-center gap-1.5 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              اعتبار کافی برای ۱۲ روز کاری بر پایه میانگین مصرف مطب
            </div>
          )}
        </div>

        {/* Google Ads Balance Card */}
        <div className="bg-white rounded-md p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xs bg-blue-50 border border-blue-300 text-blue-900 font-black text-xs flex items-center justify-center">
                گو
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-xs">موجودی گوگل ادز (ارزی)</h3>
                <span className="text-[10px] text-slate-400">جستجوی هدفمند جراحی فک و دندان عقل</span>
              </div>
            </div>

            <button
              onClick={() => {
                setTargetPlatform('google_ads');
                setChargeAmountInput('500');
                setShowRechargeModal(true);
              }}
              className="text-xs px-2.5 py-1.5 rounded-sm bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center gap-1 transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-200" />
              شارژ AED
            </button>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-slate-950 font-mono">
                {toPersianDigits(config.googleAdsBalanceAed)} AED
              </span>
              <span className="text-[11px] text-slate-500 mr-2">
                (تقریباً {formatToman(config.googleAdsBalanceAed * (config.aedToTomanRate || 185000))})
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              آستانه: {toPersianDigits(config.googleAdsAlertThresholdAed)} AED
            </span>
          </div>

          {isGoogleAdsLow ? (
            <div className="mt-2.5 p-2 rounded-sm bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>موجودی گوگل ادز رو به اتمام است؛ خطر توقف سرچ پاسداران.</span>
            </div>
          ) : (
            <div className="mt-2.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-xs flex items-center gap-1.5 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              وضعیت پایدار با نرخ تبدیل تماس بالای ۱۴٪
            </div>
          )}
        </div>

      </div>

      {/* 3. AUTO-SCHEDULE WITH PASDARAN SECRETARY HOURS */}
      <div className="bg-white rounded-md p-4 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-slate-100 border border-slate-200 flex items-center justify-center text-teal-800">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                زمان‌بندی هوشمند متناسب با حضور منشی مطب پاسداران
              </h3>
              <p className="text-[11px] text-slate-500">
                جلوگیری از اتلاف بودجه روی تماس‌های بی‌پاسخ در نیمه‌شب و ساعات تعطیلی
              </p>
            </div>
          </div>

          <button
            onClick={() => onUpdateSchedule({ autoScheduleEnabled: !config.autoScheduleEnabled })}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition border ${
              config.autoScheduleEnabled 
                ? 'bg-teal-50 text-teal-900 border-teal-300' 
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            {config.autoScheduleEnabled ? 'زمان‌بندی خودکار: فعال ✓' : 'زمان‌بندی خودکار: غیرفعال'}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
            <span className="font-bold text-slate-700 block text-[11px] mb-0.5">بازه نمایش فعال:</span>
            <div className="text-teal-950 font-black text-sm font-mono">
              ساعت {toPersianDigits(config.activeStartHour)}:۰۰ تا {toPersianDigits(config.activeEndHour)}:۰۰ عصر
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">حضور قطعی منشی جهت پاسخگویی تلفنی</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
            <span className="font-bold text-slate-700 block text-[11px] mb-0.5">روزهای کاری فعال:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه'].map(day => (
                <span key={day} className="px-1.5 py-0.2 rounded-xs bg-white text-slate-800 border border-slate-200 text-[10px] font-bold">
                  {day}
                </span>
              ))}
              <span className="px-1.5 py-0.2 rounded-xs bg-slate-200 text-slate-600 text-[10px]">
                پنجشنبه/جمعه خاموش
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
            <span className="font-bold text-slate-700 block text-[11px] mb-0.5">صرفه‌جویی خودکار نیمه‌شب:</span>
            <span className="text-slate-800 text-[11px] block mt-0.5">قطع ترافیک از ۲۳:۰۰ تا ۱۰:۰۰ صبح</span>
            <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">۳۲٪ بازدهی بیشتر بودجه جذب</span>
          </div>
        </div>
      </div>

      {/* 4. KEYWORDS & BANNERS TABLE */}
      <div className="bg-white rounded-md p-4 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              عملکرد کلمات کلیدی و بنرها (شفافیت تماس و کلیک)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              کلمات با تماس بالا را شناسایی و کلمات پرهزینه را با یک تیک غیرفعال کنید
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">پلتفرم:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-sm text-xs border border-slate-200">
              <button
                onClick={() => setPlatformFilter('all')}
                className={`px-2.5 py-1 rounded-xs transition font-bold ${platformFilter === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'}`}
              >
                همه ({toPersianDigits(keywords.length)})
              </button>
              <button
                onClick={() => setPlatformFilter('google_ads')}
                className={`px-2.5 py-1 rounded-xs transition font-bold ${platformFilter === 'google_ads' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'}`}
              >
                گوگل ادز
              </button>
              <button
                onClick={() => setPlatformFilter('yektanet')}
                className={`px-2.5 py-1 rounded-xs transition font-bold ${platformFilter === 'yektanet' ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600'}`}
              >
                یکتانت
              </button>
            </div>
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="grid grid-cols-3 gap-2 my-3 p-2.5 bg-slate-50 rounded-sm border border-slate-200 text-center text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">مجموع کلیک‌ها</span>
            <span className="text-slate-950 font-black font-mono">{toPersianDigits(totalClicks)} کلیک</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">تماس‌های تلفنی مستقیم با مطب</span>
            <span className="text-teal-900 font-black font-mono flex items-center justify-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-teal-700" />
              {toPersianDigits(totalCalls)} تماس
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">هزینه کل ماه</span>
            <span className="text-slate-950 font-black font-mono">{formatToman(totalSpentToman)}</span>
          </div>
        </div>

        {/* Keywords Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5 px-3">وضعیت</th>
                <th className="py-2.5 px-3">کلمه کلیدی / کمپین</th>
                <th className="py-2.5 px-3">پلتفرم</th>
                <th className="py-2.5 px-3">کلیک</th>
                <th className="py-2.5 px-3 font-bold text-teal-950">تماس تلفنی</th>
                <th className="py-2.5 px-3">هزینه هر کلیک (CPC)</th>
                <th className="py-2.5 px-3">نرخ تماس</th>
                <th className="py-2.5 px-3">هزینه کل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKeywords.map((kw) => (
                <tr 
                  key={kw.id} 
                  className={`hover:bg-slate-50 transition ${!kw.active ? 'opacity-50 bg-slate-50/50' : ''}`}
                >
                  <td className="py-2.5 px-3">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={kw.active}
                        onChange={() => onToggleKeyword(kw.id)}
                        className="w-3.5 h-3.5 rounded-xs text-teal-700 focus:ring-teal-500 cursor-pointer accent-teal-700"
                      />
                      <span className={`text-[10px] font-bold ${kw.active ? 'text-emerald-800' : 'text-slate-400'}`}>
                        {kw.active ? 'فعال' : 'خاموش'}
                      </span>
                    </label>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{kw.keyword}</div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {kw.category} • {kw.matchType}
                    </span>
                  </td>

                  <td className="py-2.5 px-3">
                    {kw.platform === 'google_ads' ? (
                      <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        گوگل ادز
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        یکتانت
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 font-mono text-slate-700 font-medium">
                    {toPersianDigits(kw.clicks)}
                  </td>

                  <td className="py-2.5 px-3 font-mono font-bold text-teal-900">
                    {toPersianDigits(kw.calls)} تماس
                  </td>

                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {toPersianDigits(kw.cpcToman.toLocaleString())} تومان
                  </td>

                  <td className="py-2.5 px-3">
                    <span className={`font-mono font-bold text-xs ${
                      kw.conversionRate >= 12 ? 'text-emerald-700' : kw.conversionRate >= 6 ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      ٪{toPersianDigits(kw.conversionRate.toFixed(1))}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 font-mono text-slate-800">
                    {formatToman(kw.totalCostToman)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-sm w-full p-5 shadow-xl border border-slate-300 text-right">
            <h3 className="font-bold text-slate-950 text-sm mb-1">
              افزایش موجودی {targetPlatform === 'yektanet' ? 'یکتانت' : 'گوگل ادز'}
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              پایداری کمپین برای نمایش در ساعات کاری مطب پاسداران
            </p>

            <label className="block text-xs font-semibold text-slate-700 mb-1">
              مبلغ افزایش اعتبار ({targetPlatform === 'yektanet' ? 'تومان' : 'درهم AED'}):
            </label>
            <input
              type="number"
              value={chargeAmountInput}
              onChange={(e) => setChargeAmountInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-2 text-sm font-mono text-slate-900 focus:outline-hidden focus:border-teal-600 mb-3"
            />

            {chargeSuccessMsg && (
              <div className="p-2 rounded-xs bg-emerald-50 text-emerald-900 text-xs font-bold mb-3 flex items-center gap-1.5 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                {chargeSuccessMsg}
              </div>
            )}

            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowRechargeModal(false)}
                className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleRecharge}
                className="px-4 py-1.5 rounded-md bg-teal-800 hover:bg-teal-900 text-white font-bold transition"
              >
                افزایش اعتبار
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
