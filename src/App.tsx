/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  initialConfig, 
  initialLeads, 
  initialKeywords, 
  initialInstagramSuggestions, 
  initialTrends, 
  initialArticles, 
  initialAppointments, 
  initialBudgetChannels,
  initialWeeklySchedule,
  initialChannelPosts,
  initialChannelHubConfig
} from './data/initialData';
import { 
  Lead, 
  LeadStatus, 
  KeywordPerformance, 
  AdSystemConfig, 
  InstagramPostSuggestion, 
  DayScheduleItem,
  ScrapedTrendItem, 
  ArticleItem, 
  OnlineAppointment, 
  BudgetChannel,
  ChannelPostItem,
  ChannelHubConfig
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SecretaryLeadsTab } from './components/tabs/SecretaryLeadsTab';
import { ClickAdsCommandTab } from './components/tabs/ClickAdsCommandTab';
import { InstagramAgentTab } from './components/tabs/InstagramAgentTab';
import { ChannelCommandTab } from './components/tabs/ChannelCommandTab';
import { ApifyTrendScraperTab } from './components/tabs/ApifyTrendScraperTab';
import { WebsiteControlTab } from './components/tabs/WebsiteControlTab';
import { BudgetRoasTab } from './components/tabs/BudgetRoasTab';
import { SmsModal } from './components/modals/SmsModal';
import { LeadDetailModal } from './components/modals/LeadDetailModal';
import { AiExecutiveChatbot } from './components/AiExecutiveChatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('leads');
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<AdSystemConfig>(initialConfig);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [keywords, setKeywords] = useState<KeywordPerformance[]>(initialKeywords);
  const [suggestions, setSuggestions] = useState<InstagramPostSuggestion[]>(initialInstagramSuggestions);
  const [weeklySchedule, setWeeklySchedule] = useState<DayScheduleItem[]>(initialWeeklySchedule);
  const [trends, setTrends] = useState<ScrapedTrendItem[]>(initialTrends);
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [appointments, setAppointments] = useState<OnlineAppointment[]>(initialAppointments);
  const [budgetChannels, setBudgetChannels] = useState<BudgetChannel[]>(initialBudgetChannels);
  const [channelPosts, setChannelPosts] = useState<ChannelPostItem[]>(initialChannelPosts);
  const [channelConfig, setChannelConfig] = useState<ChannelHubConfig>(initialChannelHubConfig);

  // Modals state
  const [smsModalLead, setSmsModalLead] = useState<Lead | null>(null);
  const [detailModalLead, setDetailModalLead] = useState<Lead | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Master Switch Handler (PROMPT REQUIREMENT)
  const handleToggleMasterSwitch = () => {
    const newState = !config.masterSwitchActive;
    const nowStr = new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    }).format(new Date());

    setConfig(prev => ({
      ...prev,
      masterSwitchActive: newState,
      lastToggledAt: `${nowStr}`
    }));

    if (!newState) {
      showToast('کلید قطع اضطراری فعال شد: کلیه تبلیغات گوگل ادز و یکتانت متوقف گردیدند.');
    } else {
      showToast('تبلیغات کلیکی مجدداً فعال شدند و ترافیک به سمت مطب جریان یافت.');
    }
  };

  // Keywords toggle handler (PROMPT REQUIREMENT)
  const handleToggleKeyword = (id: string) => {
    setKeywords(prev => prev.map(k => {
      if (k.id === id) {
        const next = !k.active;
        showToast(`کلمه کلیدی «${k.keyword}» ${next ? 'فعال' : 'غیرفعال'} شد.`);
        return { ...k, active: next };
      }
      return k;
    }));
  };

  // Lead status change handler (PROMPT REQUIREMENT)
  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, status: newStatus };
      }
      return l;
    }));

    if (detailModalLead && detailModalLead.id === leadId) {
      setDetailModalLead(prev => prev ? { ...prev, status: newStatus } : null);
    }

    const statusNameFa: Record<LeadStatus, string> = {
      new: 'جدید',
      called: 'تماس گرفته شد',
      booked: 'نوبت رزرو شد',
      follow_up: 'نیاز به پیگیری',
      cancelled: 'انصراف'
    };

    showToast(`وضعیت پرونده بیمار به «${statusNameFa[newStatus]}» تغییر یافت.`);
  };

  // SMS sender handler (PROMPT REQUIREMENT)
  const handleSendSms = (
    leadId: string, 
    templateType: 'location' | 'confirm' | 'reminder' | 'custom', 
    text: string
  ) => {
    const dateStr = new Intl.DateTimeFormat('fa-IR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          smsHistory: [
            ...l.smsHistory,
            {
              id: `sms-${Date.now()}`,
              date: dateStr,
              type: templateType,
              text
            }
          ]
        };
      }
      return l;
    }));

    showToast('پیامک با موفقیت از طریق سامانه پیام کوتاه مطب ارسال شد.');
  };

  // Lead note saver
  const handleSaveLeadNote = (leadId: string, note: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes: note } : l));
    showToast('یادداشت منشی در پرونده بیمار ذخیره شد.');
  };

  // Add new lead
  const handleAddNewLead = (newLeadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadData.name || 'مراجع جدید',
      phone: newLeadData.phone || '',
      service: newLeadData.service || 'implant',
      serviceNameFa: newLeadData.serviceNameFa || 'ایمپلنت دیجیتال',
      source: newLeadData.source || 'website',
      sourceNameFa: newLeadData.sourceNameFa || 'وب‌سایت',
      date: 'امروز',
      timeAgo: 'لحظاتی پیش',
      status: 'new',
      notes: newLeadData.notes || '',
      chiefComplaint: newLeadData.chiefComplaint || '',
      priority: 'high',
      hasXray: false,
      battlecard: newLeadData.battlecard || {
        patientConcern: 'استعلام تعرفه و زمان نوبت خالی',
        talkingPoint: 'توضیح تخصص جراحی فک و صورت دکتر شهیدی و تجهیزات دیجیتال مطب',
        doctorHighlight: 'بورد تخصصی جراحی فک و صورت و اسکن سه‌بعدی اولیه',
        specialOfferOrFee: 'ویزیت تشخیصی'
      },
      smsHistory: []
    };

    setLeads([newLead, ...leads]);
    showToast(`پرونده لید جدید برای «${newLead.name}» در کارتابل ثبت شد.`);
  };

  // Trend to post converter (PROMPT REQUIREMENT)
  const handleConvertTrendToPost = (trend: ScrapedTrendItem) => {
    const newPost: InstagramPostSuggestion = {
      id: `post-from-trend-${Date.now()}`,
      topic: `سناریوی وایرال برگرفته از ترند: ${trend.title}`,
      format: 'reels',
      bestPublishDay: 'چهارشنبه',
      bestPublishTime: 'ساعت ۲۰:۱۵',
      targetCategory: 'ترند وایرال جراحی فک',
      hookHeadline: trend.hookIdea,
      captionBody: `برگرفته از ویدیو پربازدید ${trend.sourceTag} با بیش از ${trend.viewsCount.toLocaleString()} بازدید:\n\n${trend.summary}\n\nتحلیل دکتر اکبر شهیدی پیام (جراح فک و صورت):\nخیلی از بیماران از این زاویه به موضوع نگاه نکرده بودند! در مطب پاسداران با استفاده از تکنولوژی‌های پیشرفته دقیقاً همین دغدغه را برطرف می‌کنیم.\n\nجهت مشاوره کلمه «مشاوره» را دایرکت کنید.`,
      callToAction: 'اگر شما هم این تجربه را داشته‌اید در کامنت‌ها بنویسید یا دایرکت پیام دهید.',
      hashtags: ['#دکتر_اکبر_شهیدی', '#جراحی_فک', '#ترند_اینستاگرام', '#ایمپلنت_دیجیتال', '#مطب_پاسداران'],
      visualPrompt: `اجرای ویدیویی مشابه ترند ${trend.creatorHandle} با حضور دکتر شهیدی در مطب پاسداران.`,
      projectedEngagement: `${trend.viralityScore / 10}٪ (بر اساس عملکرد وایرال منبع)`,
      status: 'approved',
      sourceTrend: trend.title
    };

    setSuggestions([newPost, ...suggestions]);
    showToast('ترند با موفقیت به سناریوی ویدیویی برای دکتر شهیدی تبدیل و به راهبر محتوا اضافه شد!');
  };

  // Add balance handler
  const handleAddBalance = (platform: 'yektanet' | 'google_ads', amount: number) => {
    if (platform === 'yektanet') {
      setConfig(prev => ({ ...prev, yektanetBalanceToman: prev.yektanetBalanceToman + amount }));
      showToast('موجودی پنل یکتانت با موفقیت افزایش یافت.');
    } else {
      setConfig(prev => ({ ...prev, googleAdsBalanceAed: prev.googleAdsBalanceAed + amount }));
      showToast('موجودی اکانت گوگل ادز با موفقیت افزایش یافت.');
    }
  };

  // Add article to website
  const handleAddArticle = (art: ArticleItem) => {
    setArticles([art, ...articles]);
    showToast(`مقاله «${art.title}» به تقویم انتشار سایت افزوده شد.`);
  };

  // Update appointment status
  const handleUpdateAppointmentStatus = (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast(`وضعیت نوبت آنلاین به «${status === 'confirmed' ? 'تایید شده' : 'لغو شده'}» تغییر کرد.`);
  };

  // Day schedule updater for Chatbot and Instagram Agent
  const handleUpdateDaySchedule = (
    dayName: string, 
    updatedPost: Partial<InstagramPostSuggestion>, 
    newStatus?: 'ready' | 'draft' | 'published'
  ) => {
    setWeeklySchedule(prev => prev.map(d => {
      if (d.dayName === dayName) {
        return {
          ...d,
          status: newStatus !== undefined ? newStatus : d.status,
          post: {
            ...d.post,
            ...updatedPost
          }
        };
      }
      return d;
    }));
  };

  // Broadcast & Channels (Telegram & Bale) Handlers
  const handlePublishChannelPost = (post: ChannelPostItem) => {
    setChannelPosts(prev => {
      const exists = prev.some(p => p.id === post.id);
      if (exists) {
        return prev.map(p => p.id === post.id ? { ...post, status: 'published', publishedAt: 'هم‌اکنون' } : p);
      }
      return [{ ...post, status: 'published', publishedAt: 'هم‌اکنون' }, ...prev];
    });
    showToast('پست با موفقیت و بدون نیاز به فیلترشکن همزمان به کانال‌های تلگرام و بله مخابره شد!');
  };

  const handleScheduleChannelPost = (post: ChannelPostItem) => {
    setChannelPosts(prev => {
      const exists = prev.some(p => p.id === post.id);
      if (exists) {
        return prev.map(p => p.id === post.id ? { ...post, status: 'scheduled' } : p);
      }
      return [{ ...post, status: 'scheduled' }, ...prev];
    });
    showToast(`پست در تقویم صف انتشار برای تاریخ ${post.scheduledDate} ثبت گردید.`);
  };

  const handleDeleteChannelPost = (id: string) => {
    setChannelPosts(prev => prev.filter(p => p.id !== id));
    showToast('پست از صف انتشار کانال‌ها حذف شد.');
  };

  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const activeKeywordsCount = keywords.filter(k => k.active).length;
  const scheduledPostsCount = suggestions.filter(s => s.status === 'scheduled').length;
  const scheduledChannelPostsCount = channelPosts.filter(p => p.status === 'scheduled').length;
  const isLowBalance = config.yektanetBalanceToman < config.yektanetAlertThresholdToman || config.googleAdsBalanceAed < config.googleAdsAlertThresholdAed;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      
      {/* Top Main Navigation Header */}
      <Header
        config={config}
        onToggleMasterSwitch={handleToggleMasterSwitch}
        newLeadsCount={newLeadsCount}
        lowBalanceAlert={isLowBalance}
        onNavigateToTab={setActiveTab}
        onToggleChatbot={() => setIsChatbotOpen(prev => !prev)}
        isChatbotOpen={isChatbotOpen}
      />

      {/* Main App Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          newLeadsCount={newLeadsCount}
          activeKeywordsCount={activeKeywordsCount}
          scheduledPostsCount={scheduledPostsCount}
          scheduledChannelPostsCount={scheduledChannelPostsCount}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'leads' && (
            <SecretaryLeadsTab
              leads={leads}
              onUpdateStatus={handleUpdateLeadStatus}
              onOpenSmsModal={(l) => setSmsModalLead(l)}
              onOpenDetailModal={(l) => setDetailModalLead(l)}
              onAddNewLead={handleAddNewLead}
            />
          )}

          {activeTab === 'ads_command' && (
            <ClickAdsCommandTab
              config={config}
              keywords={keywords}
              onToggleMasterSwitch={handleToggleMasterSwitch}
              onToggleKeyword={handleToggleKeyword}
              onUpdateSchedule={(upd) => setConfig(prev => ({ ...prev, ...upd }))}
              onAddBalance={handleAddBalance}
            />
          )}

          {activeTab === 'instagram_agent' && (
            <InstagramAgentTab
              suggestions={suggestions}
              weeklySchedule={weeklySchedule}
              onAddPost={(p) => setSuggestions([p, ...suggestions])}
              onUpdatePostStatus={(id, st) => {
                setSuggestions(prev => prev.map(p => p.id === id ? { ...p, status: st } : p));
                showToast('وضعیت پست در تقویم محتوا به‌روز شد.');
              }}
              onUpdateDayStatus={(dayName, status) => {
                setWeeklySchedule(prev => prev.map(d => d.dayName === dayName ? { ...d, status } : d));
                showToast(`وضعیت محتوای روز ${dayName} به روز شد.`);
              }}
            />
          )}

          {activeTab === 'channels_command' && (
            <ChannelCommandTab
              posts={channelPosts}
              config={channelConfig}
              onPublishPost={handlePublishChannelPost}
              onSchedulePost={handleScheduleChannelPost}
              onDeletePost={handleDeleteChannelPost}
              onUpdateConfig={(cfg) => setChannelConfig(prev => ({ ...prev, ...cfg }))}
            />
          )}

          {activeTab === 'trend_scraper' && (
            <ApifyTrendScraperTab
              trends={trends}
              onConvertTrendToPost={handleConvertTrendToPost}
              onNavigateToAgentTab={() => setActiveTab('instagram_agent')}
            />
          )}

          {activeTab === 'website_control' && (
            <WebsiteControlTab
              articles={articles}
              appointments={appointments}
              onAddArticle={handleAddArticle}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              showToast={showToast}
            />
          )}

          {activeTab === 'budget_roas' && (
            <BudgetRoasTab
              channels={budgetChannels}
              onUpdateChannels={(ch) => setBudgetChannels(ch)}
            />
          )}
        </main>

      </div>

      {/* 1-Click SMS Modal */}
      {smsModalLead && (
        <SmsModal
          lead={smsModalLead}
          isOpen={Boolean(smsModalLead)}
          onClose={() => setSmsModalLead(null)}
          onSendSms={handleSendSms}
        />
      )}

      {/* Patient Record / Detail Modal with X-ray Viewer */}
      {detailModalLead && (
        <LeadDetailModal
          lead={detailModalLead}
          isOpen={Boolean(detailModalLead)}
          onClose={() => setDetailModalLead(null)}
          onUpdateStatus={handleUpdateLeadStatus}
          onOpenSms={(l) => {
            setDetailModalLead(null);
            setSmsModalLead(l);
          }}
          onSaveNote={handleSaveLeadNote}
        />
      )}

      {/* AI Executive Copilot & Actions Chatbot */}
      <AiExecutiveChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onToggleOpen={() => setIsChatbotOpen(prev => !prev)}
        weeklySchedule={weeklySchedule}
        onUpdateSchedule={(newSch) => setWeeklySchedule(newSch)}
        onUpdateDaySchedule={handleUpdateDaySchedule}
        suggestions={suggestions}
        onAddPost={(p) => setSuggestions(prev => [p, ...prev])}
        onUpdatePostStatus={(id, st) => {
          setSuggestions(prev => prev.map(p => p.id === id ? { ...p, status: st } : p));
        }}
        trends={trends}
        onConvertTrendToPost={handleConvertTrendToPost}
        leads={leads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onSendSms={handleSendSms}
        config={config}
        onToggleMasterSwitch={handleToggleMasterSwitch}
        keywords={keywords}
        onToggleKeyword={handleToggleKeyword}
        appointments={appointments}
        onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
        articles={articles}
        onAddArticle={handleAddArticle}
        channelPosts={channelPosts}
        onPublishChannelPost={handlePublishChannelPost}
        onNavigateToTab={setActiveTab}
        showToast={showToast}
      />

      {/* Feedback Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-950 text-white px-3.5 py-2.5 rounded-sm shadow-xl text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2 max-w-md">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
