'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingCart, Sparkles, TrendingDown, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { VYAPAR_SUPPLIERS } from '../../lib/mockData';
import { SupplierComparisonQuote } from '../../lib/types';

interface VyaparSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: (supplier: SupplierComparisonQuote) => void;
}

export const VyaparSupplierModal: React.FC<VyaparSupplierModalProps> = ({
  isOpen,
  onClose,
  onConfirmOrder
}) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('sup-mahesh');
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const selectedSupplier = VYAPAR_SUPPLIERS.find(s => s.id === selectedSupplierId) || VYAPAR_SUPPLIERS[0];

  const handleOrder = () => {
    setIsOrdered(true);
    setTimeout(() => {
      onConfirmOrder(selectedSupplier);
      setIsOrdered(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-stone-950/15 backdrop-blur-xs">
              <ShoppingCart className="h-6 w-6 text-stone-950" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-950">
                Procurement Agent • Supplier Comparison
              </div>
              <h3 className="text-xl font-black text-stone-950">
                Order Low-Stock PVC Pipes
              </h3>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-950/10 text-stone-950 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Target Item Pill */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-amber-800 font-bold uppercase">Item to Replenish</div>
              <div className="font-extrabold text-stone-900 text-sm">1-inch Heavy PVC Conduit Pipe (Bundle of 50)</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-mono font-bold text-xs border border-rose-200">
              3 Days Stock Left
            </span>
          </div>

          {/* Supplier Cards */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
              Select Wholesale Supplier:
            </div>

            {VYAPAR_SUPPLIERS.map((s) => {
              const isChosen = s.id === selectedSupplierId;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSupplierId(s.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isChosen 
                      ? 'border-amber-500 bg-amber-500/5 shadow-sm' 
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-base">{s.name}</span>
                      <span className="text-xs text-stone-500">({s.location})</span>
                      {s.isBestOption && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] font-mono border border-emerald-300">
                          Best Option
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-stone-600 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-stone-400" />
                        {s.deliveryTime}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <ShieldCheck className="h-3 w-3" />
                        {s.reliabilityScore}% reliability
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-stone-950 font-mono">
                      ₹{s.quotedPrice.toLocaleString('en-IN')}
                    </div>
                    {s.potentialSaving > 0 ? (
                      <div className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-0.5">
                        <TrendingDown className="h-3 w-3" />
                        <span>Saves ₹{s.potentialSaving}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-400 font-mono">+₹{s.quotedPrice - 12450} higher</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Decision Summary Banner */}
          <div className="p-4 rounded-2xl bg-stone-900 text-white flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-amber-400 font-mono font-bold uppercase text-[10px] flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Vyapar AI Recommendation:
              </span>
              <p className="text-stone-200">
                Order from <strong className="text-amber-300">{selectedSupplier.name}</strong>. Delivery expected tomorrow morning before shop opening.
              </p>
            </div>
            <div className="text-right font-mono">
              <div className="text-stone-400 text-[10px]">Net Saving</div>
              <div className="text-emerald-400 font-black text-sm">
                ₹{selectedSupplier.potentialSaving || 0}
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
            Cancel
          </button>

          <button
            type="button"
            disabled={isOrdered}
            onClick={handleOrder}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-75"
          >
            {isOrdered ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-stone-950 animate-spin" />
                <span>Creating Purchase Order...</span>
              </>
            ) : (
              <>
                <span>Order Kar Do (₹{selectedSupplier.quotedPrice.toLocaleString('en-IN')})</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
