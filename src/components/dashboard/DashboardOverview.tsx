/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Usuario } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import { NavigationTab } from '../common/Sidebar';
import {
  Users,
  Briefcase,
  BookOpen,
  CalendarDays,
  FileCheck2,
  Award,
  ShieldCheck,
  CheckCircle,
  ClockAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DashboardOverviewProps {
  currentUser: Usuario;
  onNavigate: (tab: NavigationTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  onNavigate
}) => {
  const estudiantes = StorageService.getEstudiantes();
  const docentes = StorageService.getDocentes();
  const asignaturas = StorageService.getAsignaturas();
  const grupos = StorageService.getGrupos();
  const matriculas = StorageService.getMatriculas();
  const periodoActivo = StorageService.getPeriodoActivo();

  const totalEstudiantesActivos = estudiantes.filter((e) => e.activo).length;
  const totalDocentesActivos = docentes.filter((d) => d.activo).length;
  const totalCupos = grupos.reduce((acc, g) => acc + g.cupoMaximo, 0);
  const totalCuposOcupados = grupos.reduce((acc, g) => acc + g.cuposOcupados, 0);
  const porcentajeOcupacion = totalCupos > 0 ? Math.round((totalCuposOcupados / totalCupos) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida Institucional */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Periodo Lectivo {periodoActivo.codigo}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-emerald-400 font-medium">Plataforma Operativa 99.8%</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Bienvenido(a), {currentUser.nombreCompleto}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Sistema de Gestión Académica (SGA). Arquitectura multicapa desacoplada con Spring Boot, Hibernate y React 19.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('arquitectura')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <span>Ver Arquitectura en Capas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reglas de Negocio Destacadas - Acceso Rápido Directo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Regla 1: Cruce de Horario Docente */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <ClockAlert className="w-4 h-4" />
                <span>Regla de Negocio 1 (RF-06)</span>
              </div>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                Activa & Validada
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Restricción Estricta de Cruce de Horarios para Docentes
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El motor de negocio audita franjas de días y horas. Impide asignar un docente a dos grupos simultáneos con un error transaccional explícito.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Probar validación en vivo</span>
            <button
              onClick={() => onNavigate('grupos')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Ir a Grupos y Asignación</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card Regla 2: Matrícula de Asignaturas Estudiantil */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4" />
                <span>Regla de Negocio 2 (RF-07)</span>
              </div>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                Activa & Validada
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Inscripción de Asignaturas para Estudiantes
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Módulo de matrícula con verificación de cupos en tiempo real, bloqueo de inscripciones duplicadas y chequeo de colisiones de horario estudiantil.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Gestionar o matricular materias</span>
            <button
              onClick={() => onNavigate('matricula')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Ir a Matrícula Académica</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Métricas e Indicadores de Rendimiento (RF-10) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Estudiantes Activos</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {totalEstudiantesActivos}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Matriculados en pregrado
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Docentes en Planta</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {totalDocentesActivos}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Con carga académica asignada
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Catálogo Asignaturas</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {asignaturas.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Planes de estudio vigentes
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ocupación de Cupos</span>
            <CalendarDays className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {porcentajeOcupacion}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalCuposOcupados} de {totalCupos} cupos totales
          </p>
        </div>
      </div>

      {/* Atajos de Navegación por Rol Actual */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Módulos Recomendados para Rol: {currentUser.rol}
          </h3>
          <span className="text-xs text-slate-500">Acceso Seguro RBAC</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentUser.rol === 'ESTUDIANTE' ? (
            <>
              <button
                onClick={() => onNavigate('matricula')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all"
              >
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>Inscribir Materias</span>
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-xs text-slate-500">Selecciona grupos y cupos disponibles</p>
              </button>
              <button
                onClick={() => onNavigate('portal-estudiante')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all"
              >
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>Mi Horario y Calificaciones</span>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500">Consulta de notas de cortes y horario semanal</p>
              </button>
            </>
          ) : currentUser.rol === 'DOCENTE' ? (
            <>
              <button
                onClick={() => onNavigate('calificaciones')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all"
              >
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>Registrar Notas de Estudiantes</span>
                  <Award className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-xs text-slate-500">Corte 1, Corte 2 y Examen Final ponderado</p>
              </button>
              <button
                onClick={() => onNavigate('reportes')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all"
              >
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>Reporte de Mis Grupos</span>
                  <Users className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-xs text-slate-500">Listados de clase y asistencia</p>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('grupos')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all"
              >
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>Asignar Docentes a Grupos</span>
                  <ClockAlert className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-xs text-slate-500">Con validación automática de colisiones</p>
              </button>
              <button
                onClick={() => onNavigate('matricula')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all"
              >
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>Matrícula de Estudiantes</span>
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500">Inscripción y validación de prerrequisitos</p>
              </button>
              <button
                onClick={() => onNavigate('auditoria')}
                className="p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all"
              >
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>Trazabilidad y Auditoría</span>
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-xs text-slate-500">Registro inmutable de eventos</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
