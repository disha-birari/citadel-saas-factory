'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Mic, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw, 
  Languages, 
  TrendingUp, 
  Package, 
  CreditCard, 
  BarChart3, 
  Zap,
  Store
} from 'lucide-react';
import { VYAPAR_PITCH_STEPS } from '../../lib/mockData';
import { LanguageMode } from '../../lib/types';

interface VyaparPitchDemoBannerProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number, prompt: string) => void;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onTriggerMic: () => void;
  activeLoopPhase: 'DETECT' | 'DECIDE' | 'ACT' | 'LEARN';
}

export const VyaparPitchDemoBanner: React.FC<VyaparPitchDemoBannerProps> = ({
  currentStepIndex,
  onSelectStep,
  language,
  onLanguageChange,
  isVoiceEnabled,
  onToggleVoice,
  onTriggerMic,
  activeLoopPhase
}) => {
  const getStepPrompt = (step: typeof VYAPAR_PITCH_STEPS[0]) => {
    switch (language) {
      case 'marathi':
        if (step.stepNumber === 1) return 'Dukanachi sthiti sanga.';
        if (step.stepNumber === 2) return 'Low-stock sahit item order kara.';
        if (step.stepNumber === 3) return 'Konache payment baki ahe?';
        if (step.stepNumber === 4) return 'Vyapar vadhvaicha kasa?';
        return 'Copper wire cha stock sanga.';
      case 'hindi':
        if (step.stepNumber === 1) return 'Dukaan ki sthiti batayein.';
        if (step.stepNumber === 2) return 'Kam stock wala samaan order karein.';
        if (step.stepNumber === 3) return 'Kin grahako ka bhugtan baki hai?';
        if (step.stepNumber === 4) return 'Dukaan ka munafa kaise badhayein?';
        return 'Copper wire ka stock alert batayein.';
      case 'english':
        if (step.stepNumber === 1) return "Give me today's shop status.";
        if (step.stepNumber === 2) return "Order low-stock items from best supplier.";
        if (step.stepNumber === 3) return "Which customers have overdue payments?";
        if (step.stepNumber === 4) return "How can we improve business profit?";
        return "Check copper wire predictive stock status.";
      default:
        return step.hindiPrompt;
    }
  };

  const getStepIcon = (num: number) => {
    switch (num) {
      case 1: return <Store className="h-3.5 w-3.5" />;
      case 2: return <Package className="h-3.5 w-3.5" />;
      case 3: return <CreditCard className="h-3.5 w-3.5" />;
      case 4: return <BarChart3 className="h-3.5 w-3.5" />;
      case 5: return <Zap className="h-3.5 w-3.5" />;
      default: return <Sparkles className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-amber-500/30 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Title, Store Persona, Language & Voice Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-bold text-stone-950 text-lg shadow-md shadow-amber-500/20">
            व्य
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>VYAPAR AI</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Judges Pitch Demo
                </span>
              </h2>
            </div>
            <p className="text-xs text-stone-300">
              The AI Business Manager for India&apos;s Small Businesses • <span className="text-amber-300 font-semibold">Rajesh Bhai (Thane Hardware & Electricals)</span>
            </p>
          </div>
        </div>

        {/* Intelligence Loop Badge & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Intelligence Loop pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-[11px] font-mono">
            <span className="text-stone-400 font-semibold">LOOP:</span>
            {(['DETECT', 'DECIDE', 'ACT', 'LEARN'] as const).map((phase, idx) => (
              <React.Fragment key={phase}>
                <span className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  activeLoopPhase === phase 
                    ? 'bg-amber-400 text-stone-950 scale-105 shadow-xs shadow-amber-400/50' 
                    : 'text-stone-400'
                }`}>
                  {phase}
                </span>
                {idx < 3 && <span className="text-stone-600">→</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/15 text-xs font-mono">
            <Languages className="h-3.5 w-3.5 text-stone-400 ml-1.5 mr-1" />
            {(['hinglish', 'hindi', 'marathi', 'english'] as LanguageMode[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold capitalize transition ${
                  language === lang
                    ? 'bg-amber-500 text-stone-950 font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Voice / Speech Readout Toggle */}
          <button
            type="button"
            onClick={onToggleVoice}
            title={isVoiceEnabled ? "Voice Readout Active (Click to mute)" : "Voice Muted (Click to enable audio reading)"}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition font-mono ${
              isVoiceEnabled 
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                : 'bg-black/30 border-white/15 text-stone-400 hover:text-white'
            }`}
          >
            {isVoiceEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline text-[11px] font-bold">{isVoiceEnabled ? 'Voice ON' : 'Voice'}</span>
          </button>

          {/* Talk / Mic Button */}
          <button
            type="button"
            onClick={onTriggerMic}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/30 transition active:scale-95"
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Talk to AI</span>
          </button>
        </div>
      </div>

      {/* Stepper Bar: The 5 Pitch Milestones */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-stone-300 font-mono mb-2">
          <span className="font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Interactive Pitch Story Stepper (Click any step to run live):</span>
          </span>
          <span className="text-[11px] text-stone-400">
            Step {currentStepIndex + 1} of 5
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {VYAPAR_PITCH_STEPS.map((step, idx) => {
            const isSelected = currentStepIndex === idx;
            const promptText = getStepPrompt(step);

            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => onSelectStep(idx, promptText)}
                className={`p-2.5 rounded-xl text-left border transition-all relative flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10 scale-[1.02]'
                    : 'bg-black/30 border-white/10 hover:border-amber-400/50 hover:bg-black/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
                      {getStepIcon(step.stepNumber)}
                      <span>[{step.timestamp}] Step {step.stepNumber}</span>
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    &ldquo;{promptText}&rdquo;
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-stone-400 line-clamp-1">
                  {step.englishLabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
