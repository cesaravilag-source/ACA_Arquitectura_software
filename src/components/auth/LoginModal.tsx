/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Usuario } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import { Shield, KeyRound, Lock, User, Check, X, ShieldAlert } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: Usuario) => void;
  currentUser: Usuario;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser
}) => {
  const usuarios = StorageService.getUsuarios();
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [password, setPassword] = useState<string>('Institucional2026*');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 4) {
      setErrorMsg('Por favor ingrese una credencial válida (mínimo 4 caracteres).');
      return;
    }

    const targetUser = usuarios.find((u) => u.id === selectedUserId);
    if (!targetUser) {
      setErrorMsg('Usuario no encontrado en la base de datos institucional.');
      return;
    }

    if (!targetUser.activo) {
      setErrorMsg('Esta cuenta de usuario se encuentra temporalmente inactiva.');
      return;
    }

    StorageService.setCurrentUser(targetUser);
    onLoginSuccess(targetUser);
    onClose();
  };

  const handleQuickSelectUser = (user: Usuario) => {
    setSelectedUserId(user.id);
    setPassword('Institucional2026*');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-tight">
              Autenticación y Control de Acceso (RF-01 / RF-02)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Seleccionar Cuenta de Usuario Institucional
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {usuarios.map((u) => {
                const isSelected = selectedUserId === u.id;
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => handleQuickSelectUser(u)}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate">{u.nombreCompleto}</span>
                      <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                        {u.rol}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {u.email}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Identificador de Usuario / Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  disabled
                  value={usuarios.find((u) => u.id === selectedUserId)?.username || ''}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña Institucional (Hash SHA-256 en Servidor Spring Boot)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="Ingrese su contraseña"
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <KeyRound className="w-4 h-4" />
              <span>Iniciar Sesión Segura</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
