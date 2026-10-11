import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  Send, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Eye, 
  ImageIcon,
  UserCheck,
  Filter,
  Plus,
  Trash2
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { toPersianDigits } from '../../utils/formatters';

interface SecretaryLeadsTabProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, newStatus: LeadStatus) => void;
  onOpenSmsModal: (lead: Lead) => void;
  onOpenDetailModal: (lead: Lead) => void;
  onAddNewLead: (newLead: Partial<Lead>) => void;
  onDeleteLead?: (leadId: string) => void;
}

export const SecretaryLeadsTab: React.FC<SecretaryLeadsTabProps> = ({
  leads,
  onUpdateStatus,
  onOpenSmsModal,
  onOpenDetailModal,
  onAddNewLead,
  onDeleteLead
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New lead form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newService, setNewService] = useState('implant');
  const [newComplaint, setNewComplaint] = useState('');

  const statusBadges: Record<LeadStatus, { label: string; badgeClass: string; icon: React.ElementType }> = {
    new: { label: 'جدید (پاسخ‌داده‌نشده)', badgeClass: 'bg-rose-50 text-rose-800 border-rose-200', icon: Sparkles },
    called: { label: 'تماس گرفته شد', badgeClass: 'bg-blue-50 text-blue-800 border-blue-200', icon: Phone },
    booked: { label: 'نوبت قطعی رزرو شد', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    follow_up: { label: 'نیاز به پیگیری مجدد', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200', icon: HelpCircle },
    cancelled: { label: 'انصراف / لغو شده', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200', icon: XCircle },
  };

  const filteredLeads = leads.filter(lead => {
    const matchSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.serviceNameFa.includes(searchQuery);
    const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    onAddNewLead({
      name: newName,
      phone: newPhone,
      service: newService as any,
      serviceNameFa: newService === 'implant' ? 'ایمپلنت دیجیتال فوری' : 
                     newService === 'jaw_surgery' ? 'جراحی فک و صورت' : 'جراحی دندان عقل نهفته',
      source: 'website',
      sourceNameFa: 'ثبت مستقیم منشی',
      chiefComplaint: newComplaint || 'مراجعه حضوری به مطب پاسداران',
      priority: 'high',
      notes: 'ثبت شده توسط منشی مطب',
      battlecard: {
        patientConcern: 'استعلام زمان‌بندی ویزیت دکتر شهیدی',
        talkingPoint: 'توضیح زمان‌های خالی دوشنبه و چهارشنبه در مطب پاسداران',
        doctorHighlight: 'بورد تخصصی جراحی فک و صورت و ویزیت با اسکن اختصاصی',
        specialOfferOrFee: 'تعرفه مصوب مطب'
      }
    });

    setNewName('');
    setNewPhone('');
    setNewComplaint('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="bg-white rounded-md p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-950">
              کارتابل منشی و صف بیماران ورودی
            </h2>
            <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs px-2 py-0.5 rounded-xs font-bold">
              {toPersianDigits(leads.length)} پرونده در جریان
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            تجمیع مستقیم لیدهای تبلیغات کلیکی، دایرکت اینستاگرام و وب‌سایت مطب پاسداران
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 rounded-md bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          ثبت پرونده بیمار جدید
        </button>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <form onSubmit={handleCreateLead} className="bg-slate-50 p-4 rounded-md border border-slate-300 text-xs">
          <h3 className="font-bold text-slate-900 mb-3">افزودن بیمار / لید جدید به صف:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="نام و نام خانوادگی بیمار"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="bg-white border border-slate-300 rounded-md p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
              required
            />
            <input
              type="text"
              placeholder="شماره تماس (مثال: 0912...)"
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              className="bg-white border border-slate-300 rounded-md p-2 text-slate-900 font-mono text-left focus:outline-hidden focus:border-teal-600"
              required
            />
            <select
              value={newService}
              onChange={e => setNewService(e.target.value)}
              className="bg-white border border-slate-300 rounded-md p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
            >
              <option value="implant">ایمپلنت دیجیتال فوری</option>
              <option value="jaw_surgery">جراحی فک (ارتوگناتیک)</option>
              <option value="wisdom_tooth">دندان عقل نهفته روی عصب</option>
              <option value="botox_tmj">بوتاکس مفصل فک TMJ</option>
            </select>
            <input
              type="text"
              placeholder="شرح کوتاه دغدغه یا شکایت بیمار"
              value={newComplaint}
              onChange={e => setNewComplaint(e.target.value)}
              className="bg-white border border-slate-300 rounded-md p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-200 transition"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-teal-800 text-white font-bold hover:bg-teal-900 transition"
            >
              ذخیره در صف
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-md border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="جستجوی نام بیمار، شماره یا خدمت..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-teal-600"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
          {[
            { id: 'all', label: 'همه وضعیت‌ها' },
            { id: 'new', label: 'جدید' },
            { id: 'called', label: 'تماس اولیه' },
            { id: 'booked', label: 'نوبت فیکس' },
            { id: 'follow_up', label: 'پیگیری' },
            { id: 'cancelled', label: 'انصراف' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-2.5 py-1.5 rounded-sm text-xs font-bold transition shrink-0 border ${
                statusFilter === f.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Channel Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs rounded-md px-3 py-1.5 text-slate-800 focus:outline-hidden focus:border-teal-600"
        >
          <option value="all">تمام کانال‌های ورودی</option>
          <option value="instagram_dm">دایرکت اینستاگرام</option>
          <option value="google_ads">گوگل ادز</option>
          <option value="website">سایت اصلی مطب</option>
          <option value="yektanet">یکتانت</option>
          <option value="bale_bot">پیام‌رسان بله</option>
          <option value="telegram_bot">ربات تلگرام</option>
        </select>

      </div>

      {/* LEADS LIST / CARDS */}
      <div className="space-y-3">
        {leads.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-dashed border-teal-300 bg-teal-50/20 shadow-xs">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-teal-100/80 border border-teal-200 flex items-center justify-center text-teal-800">
              <UserCheck className="w-7 h-7" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              سامانه نوبت‌دهی و وب‌سرویس مطب فعال و عملیاتی است
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1">
              کارتابل منشی آماده به کار است (بدون اطلاعات دمو)
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 max-w-lg mx-auto leading-relaxed">
              تمامی بیماران و اطلاعات تستی پاکسازی شدند. سیستم آماده پذیرش مراجعین واقعی است. با ارسال نوبت از فرم آنلاین سایت یا تماس تلفنی، پرونده بیمار مستقیماً در این بخش قرار می‌گیرد.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت پرونده بیمار جدید (ثبت منشی)</span>
              </button>
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-md p-10 text-center border border-slate-200">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">هیچ بیماری مطابق این فیلتر یافت نشد.</p>
            <p className="text-xs text-slate-400 mt-0.5">عبارت جستجو یا فیلترهای وضعیت را تغییر دهید.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const statusConfig = statusBadges[lead.status];
            return (
              <div 
                key={lead.id}
                className="bg-white rounded-md border border-slate-200 shadow-xs hover:border-slate-300 transition duration-150 p-4"
              >
                {/* Header row: Patient details & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-sm bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-xs">
                      {lead.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-950 text-sm">{lead.name}</h3>
                        <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
                          {toPersianDigits(lead.phone)}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-xs font-bold border ${statusConfig.badgeClass}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                        <span>منبع: <strong className="text-slate-700 font-semibold">{lead.sourceNameFa}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {lead.timeAgo}
                        </span>
                        {lead.hasXray && (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-xs text-[10px] font-bold">
                            <ImageIcon className="w-3 h-3 text-emerald-600" />
                            عکس OPG پیوست
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Details & Send SMS & Delete */}
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => onOpenSmsModal(lead)}
                      className="px-3 py-1.5 rounded-sm bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-xs font-bold flex items-center gap-1.5 transition"
                      title="ارسال پیامک فوری"
                    >
                      <Send className="w-3.5 h-3.5 text-teal-700" />
                      ارسال پیامک فوری
                    </button>
                    <button
                      onClick={() => onOpenDetailModal(lead)}
                      className="px-3 py-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                      title="مشاهده پرونده کامل و رادیوگرافی"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      پرونده و عکس
                    </button>
                    {onDeleteLead && (
                      <button
                        onClick={() => onDeleteLead(lead.id)}
                        className="p-1.5 rounded-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition"
                        title="حذف پرونده بیمار"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body Row: Service & Chief Complaint */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">خدمت درخواستی:</span>
                    <span className="font-bold text-slate-900">{lead.serviceNameFa}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200 md:col-span-2">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">شکایت اصلی بیمار (Chief Complaint):</span>
                    <p className="text-slate-800 leading-relaxed">{lead.chiefComplaint}</p>
                  </div>
                </div>

                {/* SECRETARY PHONE CALL BATTLECARD */}
                <div className="bg-amber-50/50 border border-amber-200 rounded-sm p-3 my-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                      راهنمای مکالمه تلفنی منشی قبل از تماس:
                    </span>
                    <span className="text-[10px] text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded-xs font-bold border border-amber-200">
                      پروتکل مشاوره
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-800">
                    <p><strong className="text-amber-900">نکته کلیدی:</strong> {lead.battlecard.talkingPoint}</p>
                    <p className="text-slate-600 text-[11px]"><strong className="text-slate-800">مزیت دکتر:</strong> {lead.battlecard.doctorHighlight}</p>
                  </div>
                </div>

                {/* Footer: 1-Click Status Change Buttons */}
                <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-500 text-[11px]">تغییر وضعیت:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        onClick={() => onUpdateStatus(lead.id, 'called')}
                        className={`px-2 py-1 rounded-sm text-xs font-medium border transition ${
                          lead.status === 'called' 
                            ? 'bg-blue-700 text-white border-blue-800 font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        تماس گرفته شد
                      </button>

                      <button
                        onClick={() => onUpdateStatus(lead.id, 'booked')}
                        className={`px-2 py-1 rounded-sm text-xs font-medium border transition ${
                          lead.status === 'booked' 
                            ? 'bg-emerald-700 text-white border-emerald-800 font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        نوبت رزرو شد ✓
                      </button>

                      <button
                        onClick={() => onUpdateStatus(lead.id, 'follow_up')}
                        className={`px-2 py-1 rounded-sm text-xs font-medium border transition ${
                          lead.status === 'follow_up' 
                            ? 'bg-amber-700 text-white border-amber-800 font-bold' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        نیاز به پیگیری
                      </button>

                      <button
                        onClick={() => onUpdateStatus(lead.id, 'cancelled')}
                        className={`px-2 py-1 rounded-sm text-xs font-medium border transition ${
                          lead.status === 'cancelled' 
                            ? 'bg-slate-800 text-white border-slate-900 font-bold' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                      >
                        انصراف
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {lead.timeAgo}
                  </span>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
