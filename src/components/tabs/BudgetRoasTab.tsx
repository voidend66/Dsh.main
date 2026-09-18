import React, { useState } from 'react';
import { 
  PieChart, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  Sliders, 
  Check
} from 'lucide-react';
import { BudgetChannel } from '../../types';
import { toPersianDigits, formatToman } from '../../utils/formatters';

interface BudgetRoasTabProps {
  channels: BudgetChannel[];
  onUpdateChannels: (updated: BudgetChannel[]) => void;
}

export const BudgetRoasTab: React.FC<BudgetRoasTabProps> = ({
  channels,
  onUpdateChannels
}) => {
  const [totalBudgetMillion, setTotalBudgetMillion] = useState<number>(100);
  const [localChannels, setLocalChannels] = useState<BudgetChannel[]>(channels);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);

  const totalBudgetToman = totalBudgetMillion * 1000000;

  const totalProjectedLeads = localChannels.reduce((sum, ch) => {
    const allocated = (ch.percentage / 100) * totalBudgetToman;
    return sum + Math.round(allocated / ch.cplToman);
  }, 0);

  const servicesMargin = [
    { name: 'جراحی ارتوگناتیک فک (دو فک)', fee: 140000000, marginPct: 65, avgBookingsMonth: 4, roasMult: '7.8x' },
    { name: 'ایمپلنت دیجیتال فول موس (Full Mouth)', fee: 95000000, marginPct: 58, avgBookingsMonth: 6, roasMult: '6.4x' },
    { name: 'جراحی دندان عقل نهفته عصب', fee: 8500000, marginPct: 75, avgBookingsMonth: 22, roasMult: '4.2x' },
    { name: 'تزریق بوتاکس مفصل فک TMJ', fee: 5500000, marginPct: 80, avgBookingsMonth: 18, roasMult: '5.1x' },
  ];

  const totalEstimatedRevenueToman = servicesMargin.reduce(
    (sum, s) => sum + (s.fee * s.avgBookingsMonth),
    0
  );

  const overallRoas = (totalEstimatedRevenueToman / totalBudgetToman).toFixed(1);

  const handlePercentageChange = (id: string, newPct: number) => {
    const updated = localChannels.map(ch => ch.id === id ? { ...ch, percentage: newPct } : ch);
    setLocalChannels(updated);
    onUpdateChannels(updated);
  };

  const handleAutoOptimize = () => {
    const optimized = localChannels.map(ch => {
      if (ch.name === 'google_ads') return { ...ch, percentage: 50 };
      if (ch.name === 'instagram') return { ...ch, percentage: 25 };
      if (ch.name === 'yektanet') return { ...ch, percentage: 12 };
      if (ch.name === 'seo') return { ...ch, percentage: 8 };
      if (ch.name === 'sms') return { ...ch, percentage: 5 };
      return ch;
    });
    setLocalChannels(optimized);
    onUpdateChannels(optimized);
    setIsOptimized(true);
    setTimeout(() => setIsOptimized(false), 3000);
  };

  return (
    <div className="space-y-4">
      
      {/* 1. FINANCIAL KPI SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">بودجه کل تخصیص‌یافته ماه</span>
          <span className="text-xl font-black text-slate-950 mt-1 block font-mono">
            {formatToman(totalBudgetToman)}
          </span>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>سقف ماهانه</span>
            <span className="font-bold text-teal-800">۱۰۰٪ بودجه</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">درآمد ناخالص حاصل از مراجعین</span>
          <span className="text-xl font-black text-emerald-800 mt-1 block font-mono">
            {formatToman(totalEstimatedRevenueToman)}
          </span>
          <div className="mt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>بیشترین سهم: جراحی فک و ایمپلنت</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">نرخ بازگشت تبلیغات (ROAS)</span>
          <span className="text-xl font-black text-slate-950 mt-1 block font-mono">
            {toPersianDigits(overallRoas)}x برابر
          </span>
          <div className="mt-2 text-[11px] text-slate-500">
            به ازای هر ۱ تومان، {toPersianDigits(overallRoas)} تومان نقدینگی
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">پیش‌بینی لیدهای باکیفیت ماه</span>
          <span className="text-xl font-black text-teal-900 mt-1 block font-mono">
            {toPersianDigits(totalProjectedLeads)} لید
          </span>
          <div className="mt-2 text-[11px] text-slate-500">
            میانگین هزینه جذب هر لید: {toPersianDigits('265,000')} تومان
          </div>
        </div>

      </div>

      {/* 2. BUDGET ALLOCATION SLIDERS */}
      <div className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-700" />
              تخصیص هوشمند منابع و سهم بودجه هر بخش تبلیغاتی
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              با تغییر اسلایدر هر بخش، تعداد لید و بازگشت سرمایه زنده محاسبه می‌شود
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-sm text-xs border border-slate-200">
              <span className="text-slate-600 font-semibold">سقف بودجه:</span>
              <select
                value={totalBudgetMillion}
                onChange={(e) => setTotalBudgetMillion(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-xs px-2 py-0.5 font-bold text-slate-900"
              >
                <option value={60}>۶۰ میلیون تومان</option>
                <option value={100}>۱۰۰ میلیون تومان</option>
                <option value={150}>۱۵۰ میلیون تومان</option>
                <option value={200}>۲۰۰ میلیون تومان</option>
              </select>
            </div>

            <button
              onClick={handleAutoOptimize}
              className="px-3 py-1.5 rounded-sm bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              تخصیص بهینه هوش مصنوعی
            </button>
          </div>
        </div>

        {isOptimized && (
          <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xs font-bold flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            بودجه با اولویت تماس‌های جراحی فک و ایمپلنت مجدداً متوازن شد.
          </div>
        )}

        {/* Channels Sliders */}
        <div className="mt-4 space-y-3">
          {localChannels.map((channel) => {
            const channelAllocatedToman = (channel.percentage / 100) * totalBudgetToman;
            const channelLeads = Math.round(channelAllocatedToman / channel.cplToman);

            return (
              <div key={channel.id} className="p-3 bg-slate-50 rounded-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: channel.color }}
                    />
                    <strong className="text-xs text-slate-900">{channel.nameFa}</strong>
                    <span className="text-[10px] text-slate-400">
                      (CPL: {toPersianDigits((channel.cplToman / 1000).toFixed(0))} هزار تومان)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-600">
                      مبلغ: <strong className="text-slate-950 font-mono">{formatToman(channelAllocatedToman)}</strong>
                    </span>
                    <span className="text-teal-900 font-bold bg-white px-2 py-0.5 rounded-xs border border-slate-200 text-[11px]">
                      {toPersianDigits(channelLeads)} لید تخمینی
                    </span>
                    <span className="font-bold text-slate-950 font-mono text-xs w-10 text-left">
                      ٪{toPersianDigits(channel.percentage)}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="70"
                  step="5"
                  value={channel.percentage}
                  onChange={(e) => handlePercentageChange(channel.id, Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-xs appearance-none cursor-pointer accent-teal-700"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. VISUAL DISTRIBUTION BAR & SERVICE MARGINS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* Visual Channel Share Bar */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
              ترکیب سبد سرمایه‌گذاری تبلیغات
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              توزیع درصدی کانال‌های جذب بیمار
            </p>

            {/* Stacked Bar */}
            <div className="w-full h-5 rounded-xs overflow-hidden flex border border-slate-200 mb-3">
              {localChannels.map((ch) => (
                <div
                  key={ch.id}
                  style={{ width: `${ch.percentage}%`, backgroundColor: ch.color }}
                  className="h-full transition-all duration-200"
                  title={`${ch.nameFa}: ${ch.percentage}%`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs">
              {localChannels.map((ch) => (
                <div key={ch.id} className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: ch.color }} />
                    <span>{ch.nameFa}</span>
                  </div>
                  <span className="font-bold font-mono text-[11px]">٪{toPersianDigits(ch.percentage)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 leading-relaxed">
            توصیه دکتر شهیدی: حفظ حداقل ۴۰٪ بودجه روی سرچ گوگل ادز به دلیل نیاز فوری بیماران به درمان فک و دندان عقل.
          </div>
        </div>

        {/* Profitability Per Service Table */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                آنالیز حاشیه سود و ارزش نهایی خدمات جراحی (LTV & Margins)
              </h3>
              <p className="text-[11px] text-slate-500">
                درآمد حاصل از جراحی‌ها در برابر هزینه تبلیغات
              </p>
            </div>
            <span className="text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-xs font-bold border border-slate-200">
              مدل بهینه‌سازی مطب
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2 px-2.5">عنوان جراحی</th>
                  <th className="py-2 px-2.5">تعرفه میانگین</th>
                  <th className="py-2 px-2.5">حاشیه سود ناخالص</th>
                  <th className="py-2 px-2.5">عمل‌های ماه</th>
                  <th className="py-2 px-2.5">نرخ ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {servicesMargin.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-2.5 font-bold text-slate-950">
                      {s.name}
                    </td>
                    <td className="py-2.5 px-2.5 font-mono text-slate-700">
                      {formatToman(s.fee)}
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className="px-1.5 py-0.2 rounded-xs bg-emerald-50 text-emerald-800 font-bold font-mono border border-emerald-200">
                        ٪{toPersianDigits(s.marginPct)}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 font-mono text-slate-800">
                      {toPersianDigits(s.avgBookingsMonth)} کیس
                    </td>
                    <td className="py-2.5 px-2.5 font-bold font-mono text-slate-900">
                      {toPersianDigits(s.roasMult)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
