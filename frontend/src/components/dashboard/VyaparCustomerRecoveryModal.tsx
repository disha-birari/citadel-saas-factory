'use client';

import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2, ShieldCheck, Sparkles, Smartphone, ArrowRight, UserCheck } from 'lucide-react';
import { VYAPAR_DEBTORS } from '../../lib/mockData';
import { CustomerKhataDebtor } from '../../lib/types';

interface VyaparCustomerRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendReminders: (sentCount: number, recoveredAmount: number) => void;
}

export const VyaparCustomerRecoveryModal: React.FC<VyaparCustomerRecoveryModalProps> = ({
  isOpen,
  onClose,
  onSendReminders
}) => {
  const [selectedDebtorId, setSelectedDebtorId] = useState<string>('cust-sharma');
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  if (!isOpen) return null;

  const selectedDebtor = VYAPAR_DEBTORS.find(d => d.id === selectedDebtorId) || VYAPAR_DEBTORS[0];

  const handleSendAll = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setHasSent(true);
      setTimeout(() => {
        onSendReminders(3, 72500);
        setHasSent(false);
        onClose();
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-black/20 backdrop-blur-xs">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-200">
                CRM & Khata Agent • Cash Recovery AI
              </div>
              <h3 className="text-xl font-black text-white">
                Customer Overdue Udhar & WhatsApp Reminders
              </h3>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Total Pending Header Bar */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono font-bold uppercase text-emerald-800">Total Uncollected Udhar</div>
              <div className="text-2xl font-black text-emerald-950 font-mono">₹72,500</div>
            </div>
            <div className="text-xs text-emerald-900 bg-white/80 p-2.5 rounded-xl border border-emerald-300/60 max-w-xs font-mono">
              <span className="font-bold text-emerald-900">AI Prediction:</span> Sharma Construction has <strong>92% probability</strong> to pay within 24h of WhatsApp alert.
            </div>
          </div>

          {/* Debtors List and WhatsApp Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Debtors Column */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                Active Debtors (3):
              </div>

              {VYAPAR_DEBTORS.map((debtor) => {
                const isSelected = debtor.id === selectedDebtorId;

                return (
                  <div
                    key={debtor.id}
                    onClick={() => setSelectedDebtorId(debtor.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900 text-sm">{debtor.name}</span>
                      <span className="font-mono font-black text-stone-950 text-sm">
                        ₹{debtor.amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                      <span>{debtor.daysOverdue} days overdue</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        debtor.recoveryProbability >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : debtor.recoveryProbability >= 70
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {debtor.recoveryProbability}% Recovery Chance
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WhatsApp Message Preview Column */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
                <span>WhatsApp Message Preview:</span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  Personalized
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-3 shadow-inner">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <span className="font-bold text-stone-200">{selectedDebtor.name}</span>
                  <span className="text-stone-400 font-mono text-[11px] ml-auto">{selectedDebtor.phone}</span>
                </div>

                {/* WhatsApp Chat Bubble */}
                <div className="bg-emerald-900/60 border border-emerald-700/50 p-3 rounded-2xl rounded-tl-xs text-xs text-stone-100 leading-relaxed font-sans">
                  {selectedDebtor.whatsappMessage}
                </div>

                {/* Behavioral AI Note */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-stone-300 flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{selectedDebtor.behavioralInsight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs font-mono transition"
          >
            Close
          </button>

          <button
            type="button"
            disabled={isSending || hasSent}
            onClick={handleSendAll}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md shadow-emerald-600/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-75"
          >
            {hasSent ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>Reminders Sent via WhatsApp!</span>
              </>
            ) : isSending ? (
              <>
                <Send className="h-4 w-4 text-white animate-spin" />
                <span>Dispatching WhatsApp Messages...</span>
              </>
            ) : (
              <>
                <span>Reminder Bhej Do (Recover ₹72,500)</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
