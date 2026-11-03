/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Usuario, Rol } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import { 
  GraduationCap, 
  Layers, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentUser: Usuario;
  onUserChange: (user: Usuario) => void;
  onOpenArchitecture: () => void;
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onUserChange,
  onOpenArchitecture,
  onOpenLoginModal
}) => {
  const usuarios = StorageService.getUsuarios();
  const periodoActivo = StorageService.getPeriodoActivo();

  const handleRoleQuickSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = usuarios.find((u) => u.id === e.target.value);
    if (selected) {
      StorageService.setCurrentUser(selected);
      onUserChange(selected);
    }
  };

  const getRoleBadgeStyle = (rol: Rol) => {
    switch (rol) {
      case 'ADMIN':
        return 'text-rose-700 bg-rose-50 border border-rose-200';
      case 'COORDINADOR':
        return 'text-indigo-700 bg-indigo-50 border border-indigo-200';
      case 'DOCENTE':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
      case 'ESTUDIANTE':
        return 'text-sky-700 bg-sky-50 border border-sky-200';
      default:
        return 'text-slate-700 bg-slate-50 border border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-3.5 bg-white border-b border-slate-200 shadow-xs">
      {/* Zona 1: Identidad Institucional */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white shadow-xs">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              SGA Campus
            </span>
            <span className="text-xs px-2 py-0.5 rounded-sm font-semibold tracking-wide bg-slate-100 text-slate-700 border border-slate-200 uppercase">
              IES Institucional
            </span>
          </div>
          <p className="text-xs text-slate-500 whitespace-nowrap">
            Sistema de Gestión Académica Superior
          </p>
        </div>
      </div>

      {/* Zona 2: Contexto Operativo & Switcher Rápido para Auditoría y Pruebas */}
      <div className="hidden lg:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-900">Periodo Vigente:</span>
          <span className="font-mono text-slate-600">{periodoActivo.codigo}</span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-600 font-medium">En Curso</span>
        </div>

        {/* Simulador de sesión RBAC */}
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50/60 border border-amber-200/80 rounded-lg text-amber-900">
          <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <label htmlFor="quick-role-select" className="font-medium whitespace-nowrap">
            Cambiar Rol (RBAC):
          </label>
          <select
            id="quick-role-select"
            value={currentUser.id}
            onChange={handleRoleQuickSwitch}
            className="bg-white border border-amber-300 rounded px-2 py-0.5 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                [{u.rol}] {u.nombreCompleto}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zona 3: Controles del Usuario y Arquitectura */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenArchitecture}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs whitespace-nowrap"
          title="Ver especificación de Arquitectura en Capas y Spring Boot"
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">Arquitectura & Spring Boot</span>
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              {currentUser.nombreCompleto}
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs uppercase ${getRoleBadgeStyle(currentUser.rol)}`}>
                {currentUser.rol}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenLoginModal}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Iniciar o cambiar sesión individual"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
