import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  ImageIcon,
  User,
  Activity,
  FileText
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { toPersianDigits } from '../../utils/formatters';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (leadId: string, newStatus: LeadStatus) => void;
  onOpenSms: (lead: Lead) => void;
  onSaveNote: (leadId: string, note: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateStatus,
  onOpenSms,
  onSaveNote
}) => {
  if (!isOpen || !lead) return null;

  const [currentNote, setCurrentNote] = useState(lead.notes);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveNote = () => {
    onSaveNote(lead.id, currentNote);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  const statusMap: Record<LeadStatus, { label: string; color: string; icon: React.ElementType }> = {
    new: { label: 'درخواست جدید', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: Sparkles },
    called: { label: 'تماس گرفته شد', color: 'bg-blue-50 text-blue-800 border-blue-200', icon: Phone },
    booked: { label: 'نوبت قطعی', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    follow_up: { label: 'پیگیری مجدد', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: HelpCircle },
    cancelled: { label: 'لغو شده', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: XCircle },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-md max-w-2xl w-full p-4 sm:p-5 shadow-2xl border border-slate-300 relative text-right max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xs bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-bold text-base">
              <User className="w-5 h-5 text-teal-800" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-black text-slate-950">{lead.name}</h2>
                <span className={`px-2 py-0.5 rounded-xs text-[11px] font-bold border ${statusMap[lead.status].color}`}>
                  {statusMap[lead.status].label}
                </span>
                <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-xs font-semibold border border-slate-200">
                  {lead.sourceNameFa}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap">
                <span>تلفن: <strong className="text-slate-900 font-mono tracking-wider">{toPersianDigits(lead.phone)}</strong></span>
                <span className="text-slate-300">•</span>
                <span>ثبت: {lead.timeAgo} ({lead.date})</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status toggles & SMS action */}
        <div className="mt-3 p-2.5 bg-slate-50 rounded-sm border border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] font-bold text-slate-700 ml-1">تغییر وضعیت:</span>
            {(['new', 'called', 'booked', 'follow_up', 'cancelled'] as LeadStatus[]).map(st => {
              const info = statusMap[st];
              const isCurrent = lead.status === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdateStatus(lead.id, st)}
                  className={`px-2 py-1 rounded-xs text-[11px] font-bold transition border ${
                    isCurrent 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {info.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onOpenSms(lead)}
            className="px-2.5 py-1 rounded-sm bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1 transition"
          >
            <Send className="w-3 h-3" />
            ارسال پیامک
          </button>
        </div>

        {/* Selected Service & Chief Complaint */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 bg-teal-50/50 rounded-sm border border-teal-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 mb-1">
              <Activity className="w-3.5 h-3.5 text-teal-700" />
              خدمت جراحی درخواستی:
            </div>
            <div className="text-xs font-black text-slate-900">
              {lead.serviceNameFa}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-sm border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              شکایت اصلی بیمار (Chief Complaint):
            </div>
            <div className="text-xs text-slate-800 leading-relaxed">
              {lead.chiefComplaint}
            </div>
          </div>
        </div>

        {/* Radiograph / Photo preview */}
        {lead.hasXray && lead.xrayUrl && (
          <div className="mt-3 p-3 bg-slate-950 rounded-sm text-white border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                تصویر رادیوگرافی / اسکن ارسالی بیمار (OPG / CBCT):
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded-xs">
                پیوست پرونده
              </span>
            </div>
            <div className="relative rounded-xs overflow-hidden border border-slate-700 max-h-48 bg-black flex items-center justify-center">
              <img 
                src={lead.xrayUrl} 
                alt="تصویر رادیوگرافی بیمار" 
                className="w-full object-contain max-h-48"
              />
            </div>
          </div>
        )}

        {/* SECRETARY PHONE CALL BATTLECARD */}
        <div className="mt-3 p-3 rounded-sm bg-amber-50/70 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>راهنمای مکالمه تلفنی منشی (Phone Battlecard)</span>
            </div>
            <span className="text-[10px] bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded-xs font-bold">
              نکات طلایی قبل از تماس
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="bg-white p-2 rounded-xs border border-amber-200">
              <strong className="text-amber-950 text-[11px] block">دغدغه اصلی بیمار:</strong>
              <p className="text-slate-800 text-[11px] mt-0.5">{lead.battlecard.patientConcern}</p>
            </div>

            <div className="bg-white p-2 rounded-xs border border-amber-200">
              <strong className="text-teal-950 text-[11px] block">جمله کلیدی برای پاسخ منشی:</strong>
              <p className="text-slate-800 text-[11px] mt-0.5">{lead.battlecard.talkingPoint}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <div className="bg-white p-2 rounded-xs border border-amber-200">
                <strong className="text-slate-900 text-[11px] block">مزیت دکتر شهیدی:</strong>
                <p className="text-slate-700 text-[10px] mt-0.5">{lead.battlecard.doctorHighlight}</p>
              </div>
              <div className="bg-white p-2 rounded-xs border border-amber-200">
                <strong className="text-slate-900 text-[11px] block">سیاست پرداخت / ویزیت:</strong>
                <p className="text-slate-700 text-[10px] mt-0.5">{lead.battlecard.specialOfferOrFee}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secretary Notes */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-800">
              یادداشت منشی و نتایج پیگیری:
            </label>
            {isSaved && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ذخیره شد
              </span>
            )}
          </div>
          <textarea
            rows={2}
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="نتیجه مکالمه تلفنی، توافقات یا نیاز به پیگیری مجدد..."
            className="w-full text-xs p-2.5 rounded-sm border border-slate-300 bg-white focus:outline-hidden focus:border-teal-700 text-slate-900"
          />
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              onClick={handleSaveNote}
              className="px-3 py-1 rounded-sm bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              ثبت یادداشت
            </button>
          </div>
        </div>

        {/* SMS History */}
        {lead.smsHistory && lead.smsHistory.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-200">
            <h4 className="text-[11px] font-bold text-slate-700 mb-1.5">تاریخچه پیامک‌های ارسال شده:</h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {lead.smsHistory.map((s, idx) => (
                <div key={idx} className="bg-slate-50 p-1.5 rounded-xs border border-slate-200 text-xs text-slate-800 flex items-start justify-between">
                  <span className="text-[11px] leading-relaxed">{s.text}</span>
                  <span className="text-[10px] text-slate-500 shrink-0 mr-2">{s.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
