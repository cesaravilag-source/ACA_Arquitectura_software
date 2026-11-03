/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Rol, Usuario } from '../../types/academic';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  CalendarDays,
  FileCheck2,
  Award,
  GraduationCap,
  BarChart3,
  ShieldAlert,
  Code2,
  ClockAlert
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'estudiantes'
  | 'docentes'
  | 'programas'
  | 'grupos'
  | 'matricula'
  | 'calificaciones'
  | 'portal-estudiante'
  | 'reportes'
  | 'auditoria'
  | 'arquitectura';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  currentUser: Usuario;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: Rol[];
  rfTag?: string;
  highlight?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Panel General',
    sublabel: 'Métricas e indicadores',
    icon: LayoutDashboard,
    allowedRoles: ['ADMIN', 'COORDINADOR', 'DOCENTE', 'ESTUDIANTE']
  },
  {
    id: 'estudiantes',
    label: 'Estudiantes',
    sublabel: 'Directorio y expedientes',
    icon: Users,
    allowedRoles: ['ADMIN', 'COORDINADOR'],
    rfTag: 'RF-03'
  },
  {
    id: 'docentes',
    label: 'Docentes',
    sublabel: 'Planta docente y carga',
    icon: Briefcase,
    allowedRoles: ['ADMIN', 'COORDINADOR'],
    rfTag: 'RF-04'
  },
  {
    id: 'programas',
    label: 'Programas y Pensum',
    sublabel: 'Planes y asignaturas',
    icon: BookOpen,
    allowedRoles: ['ADMIN', 'COORDINADOR'],
    rfTag: 'RF-05'
  },
  {
    id: 'grupos',
    label: 'Grupos y Horarios',
    sublabel: 'Regla de cruce docente',
    icon: CalendarDays,
    allowedRoles: ['ADMIN', 'COORDINADOR'],
    rfTag: 'RF-06',
    highlight: true
  },
  {
    id: 'matricula',
    label: 'Matrícula Académica',
    sublabel: 'Inscripción de asignaturas',
    icon: FileCheck2,
    allowedRoles: ['ADMIN', 'COORDINADOR', 'ESTUDIANTE'],
    rfTag: 'RF-07',
    highlight: true
  },
  {
    id: 'calificaciones',
    label: 'Registro de Notas',
    sublabel: 'Cortes y definitivas',
    icon: Award,
    allowedRoles: ['DOCENTE', 'COORDINADOR', 'ADMIN'],
    rfTag: 'RF-08'
  },
  {
    id: 'portal-estudiante',
    label: 'Mi Horario y Notas',
    sublabel: 'Consulta de resultados',
    icon: GraduationCap,
    allowedRoles: ['ESTUDIANTE', 'ADMIN'],
    rfTag: 'RF-09'
  },
  {
    id: 'reportes',
    label: 'Reportes y Filtros',
    sublabel: 'Estadísticas e informes',
    icon: BarChart3,
    allowedRoles: ['ADMIN', 'COORDINADOR', 'DOCENTE'],
    rfTag: 'RF-10'
  },
  {
    id: 'auditoria',
    label: 'Auditoría y Seguridad',
    sublabel: 'Trazabilidad de eventos',
    icon: ShieldAlert,
    allowedRoles: ['ADMIN'],
    rfTag: 'RF-12'
  },
  {
    id: 'arquitectura',
    label: 'Arquitectura Spring Boot',
    sublabel: 'Capas, JPA y DDL',
    icon: Code2,
    allowedRoles: ['ADMIN', 'COORDINADOR', 'DOCENTE', 'ESTUDIANTE']
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  currentUser
}) => {
  const visibleItems = NAV_ITEMS.filter((item) =>
    item.allowedRoles.includes(currentUser.rol)
  );

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-4 border-b border-slate-800/80">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Navegación Institucional
        </div>
        <div className="text-xs text-slate-400 flex items-center justify-between">
          <span>Rol activo:</span>
          <span className="font-semibold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            {currentUser.rol}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate font-semibold">{item.label}</span>
                  {item.rfTag && (
                    <span className={`text-[10px] px-1 rounded font-mono ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.rfTag}
                    </span>
                  )}
                </div>
                {item.sublabel && (
                  <p className={`text-[11px] truncate mt-0.5 ${
                    isActive ? 'text-indigo-100' : 'text-slate-400'
                  }`}>
                    {item.sublabel}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <ClockAlert className="w-3.5 h-3.5" />
            <span>Regla Cruce Activa</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Bloqueo algorítmico estricto en solapamiento de agendas docentes y estudiantiles.
          </p>
        </div>
      </div>
    </aside>
  );
};
