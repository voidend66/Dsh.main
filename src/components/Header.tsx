import React from 'react';
import { 
  Power, 
  Clock, 
  MapPin, 
  Sparkles,
  PhoneCall,
  Activity,
  AlertTriangle,
  Layers,
  Bot
} from 'lucide-react';
import { AdSystemConfig } from '../types';
import { toPersianDigits } from '../utils/formatters';

interface HeaderProps {
  config: AdSystemConfig;
  onToggleMasterSwitch: () => void;
  newLeadsCount: number;
  lowBalanceAlert: boolean;
  onNavigateToTab: (tabId: string) => void;
  onToggleChatbot?: () => void;
  isChatbotOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onToggleMasterSwitch,
  newLeadsCount,
  lowBalanceAlert,
  onNavigateToTab,
  onToggleChatbot,
  isChatbotOpen
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] py-2.5 gap-3">
          
          {/* Brand info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-slate-950 text-teal-400 font-black text-base sm:text-lg flex items-center justify-center shrink-0 border border-slate-800 shadow-xs">
              د.ش
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight truncate">
                  دکتر اکبر شهیدی پیام
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-sm text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  بورد تخصصی جراحی فک و صورت
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 truncate">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <MapPin className="w-3 h-3 text-teal-700 shrink-0" />
                  <span className="truncate">تهران، پاسداران (بوستان دوم)</span>
                </span>
                <span className="hidden md:inline-block text-slate-300">|</span>
                <span className="hidden md:flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  حضور منشی: ۱۶:۰۰ الی ۲۰:۰۰
                </span>
              </div>
            </div>
          </div>

          {/* Master Emergency Ad Switch & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* AI Executive Chatbot Button */}
            {onToggleChatbot && (
              <button
                type="button"
                onClick={onToggleChatbot}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md border text-xs font-bold transition ${
                  isChatbotOpen
                    ? 'bg-teal-900 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-900 hover:bg-slate-800 text-teal-300 border-slate-700 shadow-xs'
                }`}
                title="دستیار هوشمند اجرایی دکتر شهیدی (چت‌بات و دستورات عملی)"
              >
                <div className="relative">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 absolute -top-0.5 -right-0.5 animate-ping" />
                  <Bot className="w-4 h-4 text-teal-300" />
                </div>
                <span className="hidden md:inline-block">دستیار اجرایی</span>
              </button>
            )}

            {/* Master Switch */}
            <div 
              onClick={onToggleMasterSwitch}
              className={`cursor-pointer select-none rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 border transition flex items-center gap-2.5 ${
                config.masterSwitchActive 
                  ? 'bg-emerald-50/80 border-emerald-300/90 text-emerald-950 hover:bg-emerald-100/70' 
                  : 'bg-rose-50/80 border-rose-300/90 text-rose-950 hover:bg-rose-100/70'
              }`}
              title="کلید قطع اضطراری کمپین‌های گوگل ادز و یکتانت"
            >
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className={`w-1.5 h-1.5 rounded-full ${config.masterSwitchActive ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`} />
                  <span className="text-xs font-bold leading-none">
                    {config.masterSwitchActive ? 'تبلیغات کلیکی فعال' : 'توقف اضطراری تبلیغات'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5 leading-none">
                  Google & Yektanet
                </span>
              </div>

              {/* Sharp Toggle switch */}
              <div 
                className={`relative w-11 h-6 rounded-sm transition-colors duration-150 flex items-center px-0.5 ${
                  config.masterSwitchActive ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div 
                  className={`w-5 h-5 rounded-xs bg-white shadow-xs flex items-center justify-center transition-transform duration-150 ${
                    config.masterSwitchActive ? '-translate-x-5' : 'translate-x-0'
                  }`}
                >
                  <Power className={`w-3 h-3 ${config.masterSwitchActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                </div>
              </div>
            </div>

            {/* Leads Quick Alert Button */}
            <button
              type="button"
              onClick={() => onNavigateToTab('leads')}
              className="relative p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition"
              title="کارتابل بیماران و لیدها"
            >
              <PhoneCall className="w-4 h-4" />
              {newLeadsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black rounded-xs min-w-4.5 h-4.5 px-1 flex items-center justify-center border border-white">
                  {toPersianDigits(newLeadsCount)}
                </span>
              )}
            </button>

            {/* Low Balance Warning Badge */}
            {lowBalanceAlert && (
              <button
                type="button"
                onClick={() => onNavigateToTab('ads_command')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold transition hover:bg-amber-100"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>شارژ بودجه</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
