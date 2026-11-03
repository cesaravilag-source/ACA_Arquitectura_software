/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titulo: string;
  mensaje: string;
  detalles?: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgStyle = 'bg-white border-slate-200 text-slate-800';
        let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;

        if (toast.tipo === 'success') {
          bgStyle = 'bg-white border-emerald-300 shadow-md';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        } else if (toast.tipo === 'error') {
          bgStyle = 'bg-white border-rose-300 shadow-md';
          icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
        } else if (toast.tipo === 'warning') {
          bgStyle = 'bg-white border-amber-300 shadow-md';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border ${bgStyle} flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {toast.titulo}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {toast.mensaje}
              </p>
              {toast.detalles && (
                <div className="mt-2 p-2 rounded bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
                  {toast.detalles}
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
