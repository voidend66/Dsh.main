import React from 'react';
import { 
  Users, 
  Radio, 
  Sparkles, 
  TrendingUp, 
  Globe, 
  PieChart, 
  ShieldCheck,
  CalendarCheck,
  Send
} from 'lucide-react';
import { toPersianDigits } from '../utils/formatters';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  newLeadsCount: number;
  activeKeywordsCount: number;
  scheduledPostsCount: number;
  scheduledChannelPostsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  newLeadsCount,
  activeKeywordsCount,
  scheduledPostsCount,
  scheduledChannelPostsCount = 0
}) => {
  const menuItems = [
    {
      id: 'leads',
      title: 'کارتابل منشی و بیماران',
      subtitle: 'لیدها، نوبت‌ها و استعلام‌ها',
      icon: Users,
      badge: newLeadsCount > 0 ? `${toPersianDigits(newLeadsCount)} جدید` : null,
      badgeClass: 'bg-rose-600 text-white border-rose-700',
    },
    {
      id: 'ads_command',
      title: 'اتاق فرمان کلیکی',
      subtitle: 'گوگل ادز، یکتانت و قطع فوری',
      icon: Radio,
      badge: `${toPersianDigits(activeKeywordsCount)} فعال`,
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    },
    {
      id: 'instagram_agent',
      title: 'راهبر محتوای اینستاگرام',
      subtitle: 'سناریوساز ریلز و تقویم',
      icon: Sparkles,
      badge: scheduledPostsCount > 0 ? `${toPersianDigits(scheduledPostsCount)} آماده` : null,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      id: 'channels_command',
      title: 'فرماندهی کانال‌ها (تلگرام و بله)',
      subtitle: 'ارسال همزمان، زمان‌بندی و دکمه شیشه‌ای',
      icon: Send,
      badge: scheduledChannelPostsCount > 0 ? `${toPersianDigits(scheduledChannelPostsCount)} در صف` : 'همزمان',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-300',
    },
    {
      id: 'trend_scraper',
      title: 'اسکرپر Apify و ترندها',
      subtitle: 'تحلیل پیج و رادار وایرال',
      icon: TrendingUp,
      badge: 'آنلاین',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-300',
    },
    {
      id: 'website_control',
      title: 'کنترلگر سایت و مقالات',
      subtitle: 'نوبت آنلاین و سئو تخصصی',
      icon: Globe,
      badge: null,
      badgeClass: '',
    },
    {
      id: 'budget_roas',
      title: 'بودجه و سودآوری (ROAS)',
      subtitle: 'تخصیص هوشمند سرمایه مطب',
      icon: PieChart,
      badge: null,
      badgeClass: '',
    },
  ];

  return (
    <>
      {/* Mobile Horizontal Navigation Tabs (Sharp & Minimalist) */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-[4.25rem] z-20 overflow-x-auto no-scrollbar py-2 px-3 shadow-xs">
        <div className="flex items-center gap-1.5 min-w-max">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition whitespace-nowrap border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{item.title}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-xs font-black border ${
                    isActive ? 'bg-teal-400 text-slate-950 border-teal-300' : item.badgeClass
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sharp Executive Sidebar */}
      <aside className="hidden lg:flex w-68 shrink-0 bg-white border-l border-slate-200 min-h-[calc(100vh-4.25rem)] p-4 flex-col justify-between">
        <div>
          <div className="mb-3 px-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              بخش‌های عملیاتی سامانه
            </span>
            <span className="w-1.5 h-1.5 rounded-xs bg-teal-600" />
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full text-right flex items-center justify-between p-2.5 rounded-md transition text-xs border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                      : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 border ${
                        isActive
                          ? 'bg-slate-800 text-teal-400 border-slate-700'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 text-right">
                      <div className="leading-tight truncate">{item.title}</div>
                      <div className={`text-[10px] font-normal leading-tight mt-0.5 truncate ${
                        isActive ? 'text-slate-400' : 'text-slate-400'
                      }`}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-xs font-bold shrink-0 border ${
                        isActive ? 'bg-teal-400 text-slate-950 border-teal-300' : item.badgeClass
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sharp Clinic System Info */}
        <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              سیستم اتوماسیون مطب
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded-xs">
              ONLINE
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            سرور رمزنگاری لیدها و صف تماس بیماران فعال است.
          </p>
          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
            <span>مطب پاسداران - تهران</span>
            <span className="font-mono">v3.2</span>
          </div>
        </div>
      </aside>
    </>
  );
};
