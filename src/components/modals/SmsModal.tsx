import React, { useState } from 'react';
import { X, Send, MapPin, CheckCircle, Clock, HeartHandshake, Sparkles } from 'lucide-react';
import { Lead } from '../../types';
import { smsTemplates } from '../../data/initialData';
import { toPersianDigits } from '../../utils/formatters';

interface SmsModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSendSms: (leadId: string, templateType: 'location' | 'confirm' | 'reminder' | 'custom', text: string) => void;
}

export const SmsModal: React.FC<SmsModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSendSms
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-location');
  const [appointmentDay, setAppointmentDay] = useState<string>('دوشنبه ۲۶ شهریور');
  const [appointmentTime, setAppointmentTime] = useState<string>('۱۷:۳۰');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isSentSuccess, setIsSentSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTemplate = smsTemplates.find(t => t.id === selectedTemplateId) || smsTemplates[0];

  const generatedText = customMessage || currentTemplate.text
    .replace('{نام}', lead.name)
    .replace('{روز}', appointmentDay)
    .replace('{ساعت}', appointmentTime);

  const handleSend = () => {
    onSendSms(lead.id, currentTemplate.type, generatedText);
    setIsSentSuccess(true);
    setTimeout(() => {
      setIsSentSuccess(false);
      onClose();
    }, 1200);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'location': return <MapPin className="w-3.5 h-3.5 text-rose-600" />;
      case 'confirm': return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'reminder': return <Clock className="w-3.5 h-3.5 text-sky-600" />;
      default: return <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-md max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-slate-300 relative text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xs bg-slate-100 text-teal-800 border border-slate-200 flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                ارسال پیامک با یک کلیک به بیمار
              </h3>
              <p className="text-[11px] text-slate-500">
                گیرنده: <span className="font-bold text-slate-800">{lead.name}</span> ({toPersianDigits(lead.phone)})
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector */}
        <div className="mt-3">
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            انتخاب قالب آماده پیامک:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {smsTemplates.map(tmpl => {
              const isSelected = tmpl.id === selectedTemplateId;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplateId(tmpl.id);
                    setCustomMessage('');
                  }}
                  className={`p-2 rounded-sm text-right text-xs transition border flex items-center gap-1.5 ${
                    isSelected 
                      ? 'border-slate-900 bg-slate-900 text-white font-bold' 
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {getIcon(tmpl.type)}
                  <span className="truncate text-[11px]">{tmpl.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Variables fields */}
        {(selectedTemplateId === 'tmpl-confirm' || selectedTemplateId === 'tmpl-reminder') && (
          <div className="mt-2.5 p-2.5 bg-slate-50 rounded-sm border border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-semibold">روز نوبت:</label>
              <input
                type="text"
                value={appointmentDay}
                onChange={(e) => setAppointmentDay(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xs px-2 py-1 text-xs text-slate-900 focus:outline-hidden focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-semibold">ساعت نوبت:</label>
              <input
                type="text"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xs px-2 py-1 text-xs text-slate-900 focus:outline-hidden focus:border-teal-700"
              />
            </div>
          </div>
        )}

        {/* Live Preview */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-teal-700" />
              متن نهایی ارسالی به موبایل بیمار:
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {toPersianDigits(generatedText.length)} کاراکتر
            </span>
          </div>
          <textarea
            rows={4}
            value={generatedText}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full text-xs leading-relaxed bg-slate-50 border border-slate-300 rounded-sm p-2 text-slate-900 focus:bg-white focus:outline-hidden focus:border-teal-700"
          />
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-sm transition font-semibold"
          >
            انصراف
          </button>

          <button
            type="button"
            disabled={isSentSuccess}
            onClick={handleSend}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold text-white transition flex items-center gap-1.5 border ${
              isSentSuccess 
                ? 'bg-emerald-700 border-emerald-800' 
                : 'bg-teal-800 hover:bg-teal-900 border-teal-900'
            }`}
          >
            {isSentSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                پیامک ارسال شد ✓
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                ارسال فوری پیامک
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
