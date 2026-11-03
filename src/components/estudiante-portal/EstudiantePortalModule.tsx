/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Usuario, Estudiante, Matricula, Calificacion, Grupo, Asignatura, Docente, DiaSemana } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import {
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  Printer,
  Clock,
  Building2,
  CheckCircle2,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface EstudiantePortalModuleProps {
  currentUser: Usuario;
}

const DIAS_SEMANA: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const EstudiantePortalModule: React.FC<EstudiantePortalModuleProps> = ({ currentUser }) => {
  const estudiantes = StorageService.getEstudiantes();
  const matriculas = StorageService.getMatriculas();
  const calificaciones = StorageService.getCalificaciones();
  const grupos = StorageService.getGrupos();
  const asignaturas = StorageService.getAsignaturas();
  const docentes = StorageService.getDocentes();
  const programas = StorageService.getProgramas();
  const periodoActivo = StorageService.getPeriodoActivo();

  // Seleccionar estudiante asociado o el primero para demostración
  const estudianteActual =
    currentUser.rol === 'ESTUDIANTE'
      ? estudiantes.find((e) => e.id === currentUser.referenciaId || e.email === currentUser.email) || estudiantes[0]
      : estudiantes[0];

  const programa = programas.find((p) => p.id === estudianteActual?.programaId);

  const [vistaActiva, setVistaActiva] = useState<'horario' | 'calificaciones'>('horario');

  // Matrículas del estudiante en el periodo actual
  const matriculasEstudiante = matriculas.filter(
    (m) =>
      m.estudianteId === estudianteActual?.id &&
      m.periodoId === periodoActivo.id &&
      m.estado === 'MATRICULADO'
  );

  const totalCreditos = matriculasEstudiante.reduce((acc, m) => {
    const asig = asignaturas.find((a) => a.id === m.asignaturaId);
    return acc + (asig?.creditos || 0);
  }, 0);

  // Calificaciones de las asignaturas matriculadas
  const notasEstudiante = calificaciones.filter(
    (c) => c.estudianteId === estudianteActual?.id && c.periodoId === periodoActivo.id
  );

  return (
    <div className="space-y-6">
      {/* Encabezado del Portal Estudiantil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Portal del Estudiante: Horario y Resultados (RF-09)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-sky-50 text-sky-700 font-semibold border border-sky-200">
              Periodo {periodoActivo.codigo}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Consulta consolidada de asignaturas inscritas, malla horaria semanal y notas oficiales publicadas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setVistaActiva('horario')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                vistaActiva === 'horario'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Horario Semanal
            </button>
            <button
              onClick={() => setVistaActiva('calificaciones')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                vistaActiva === 'calificaciones'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Boletín de Notas
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Tarjeta del Estudiante & Resumen Académico */}
      {estudianteActual && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Estudiante
            </div>
            <div className="text-sm font-bold text-slate-900">
              {estudianteActual.nombreCompleto}
            </div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">
              Cód: {estudianteActual.codigoEstudiante}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Programa Académico
            </div>
            <div className="text-sm font-bold text-slate-900">
              {programa?.nombre}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Semestre Actual: {estudianteActual.semestreActual}°
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Promedio Acumulado (GPA)
            </div>
            <div className="text-xl font-bold font-mono text-indigo-700">
              {estudianteActual.promedioAcumulado.toFixed(1)} / 5.0
            </div>
            <div className="text-xs text-emerald-600 mt-0.5 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Rendimiento Destacado</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Créditos Aprobados
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">
              {estudianteActual.creditosAprobados} Cr
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {totalCreditos} créditos inscritos en 2026-I
            </div>
          </div>
        </div>
      )}

      {/* VISTA 1: HORARIO SEMANAL VISUAL (LUNES A SÁBADO) */}
      {vistaActiva === 'horario' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Malla Horaria Semanal · {periodoActivo.codigo}
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {matriculasEstudiante.length} asignaturas inscritas
            </span>
          </div>

          {matriculasEstudiante.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No tienes asignaturas matriculadas actualmente para visualizar en el horario.
            </div>
          ) : (
            <div className="p-4 overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 min-w-[700px]">
                {DIAS_SEMANA.map((dia) => {
                  // Obtener franjas que caigan en este día
                  const clasesDelDia: Array<{
                    grupo: Grupo;
                    asig: Asignatura;
                    doc?: Docente;
                    inicio: string;
                    fin: string;
                    aula: string;
                  }> = [];

                  matriculasEstudiante.forEach((m) => {
                    const grupo = grupos.find((g) => g.id === m.grupoId);
                    const asig = asignaturas.find((a) => a.id === m.asignaturaId);
                    const doc = docentes.find((d) => d.id === grupo?.docenteId);

                    if (grupo && asig) {
                      grupo.horarios.forEach((h) => {
                        if (h.dia === dia) {
                          clasesDelDia.push({
                            grupo,
                            asig,
                            doc,
                            inicio: h.horaInicio,
                            fin: h.horaFin,
                            aula: h.aula
                          });
                        }
                      });
                    }
                  });

                  // Ordenar por hora de inicio
                  clasesDelDia.sort((a, b) => a.inicio.localeCompare(b.inicio));

                  return (
                    <div
                      key={dia}
                      className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col min-h-[300px]"
                    >
                      <div className="text-center pb-2 border-b border-slate-200 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                          {dia}
                        </span>
                      </div>

                      <div className="space-y-2 flex-1">
                        {clasesDelDia.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-[11px] text-slate-400 italic">
                            Sin clases programadas
                          </div>
                        ) : (
                          clasesDelDia.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-white border border-indigo-200 shadow-2xs hover:shadow-xs transition-shadow"
                            >
                              <div className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded inline-block">
                                {item.inicio} - {item.fin}
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
                                {item.asig.nombre}
                              </h5>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {item.grupo.codigo} · {item.asig.creditos} Cr
                              </div>
                              <div className="text-[10px] text-slate-600 mt-1 truncate">
                                {item.aula}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                {item.doc?.nombreCompleto || 'Por designar'}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: BOLETÍN DE NOTAS Y CALIFICACIONES PUBLICADAS */}
      {vistaActiva === 'calificaciones' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Boletín Oficial de Calificaciones · {periodoActivo.codigo}
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Escala Oficial: 0.0 a 5.0 (Aprobatoria ≥ 3.0)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Asignatura</th>
                  <th className="py-3 px-3 text-center">Créditos</th>
                  <th className="py-3 px-3 text-center">Corte 1 (30%)</th>
                  <th className="py-3 px-3 text-center">Corte 2 (30%)</th>
                  <th className="py-3 px-3 text-center">Examen Final (40%)</th>
                  <th className="py-3 px-3 text-center">Definitiva</th>
                  <th className="py-3 px-3 text-center">Estado</th>
                  <th className="py-3 px-4">Observaciones del Docente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notasEstudiante.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No hay registros de calificaciones para mostrar en este periodo.
                    </td>
                  </tr>
                ) : (
                  notasEstudiante.map((nota) => {
                    const asig = asignaturas.find((a) => a.id === nota.asignaturaId);
                    const grupo = grupos.find((g) => g.id === nota.grupoId);
                    const doc = docentes.find((d) => d.id === grupo?.docenteId);

                    return (
                      <tr key={nota.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            {asig?.nombre}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {grupo?.codigo} · Docente: {doc?.nombreCompleto || 'Por designar'}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-semibold">
                          {asig?.creditos}
                        </td>

                        <td className="py-3 px-3 text-center font-mono">
                          {nota.corte1 !== null ? (
                            <span className="font-semibold text-slate-800">{nota.corte1.toFixed(1)}</span>
                          ) : (
                            <span className="text-slate-400">Pendiente</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center font-mono">
                          {nota.corte2 !== null ? (
                            <span className="font-semibold text-slate-800">{nota.corte2.toFixed(1)}</span>
                          ) : (
                            <span className="text-slate-400">Pendiente</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center font-mono">
                          {nota.examenFinal !== null ? (
                            <span className="font-semibold text-slate-800">{nota.examenFinal.toFixed(1)}</span>
                          ) : (
                            <span className="text-slate-400">Pendiente</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-bold text-sm">
                          {nota.definitiva !== null ? (
                            <span
                              className={
                                nota.definitiva >= 3.0 ? 'text-emerald-700' : 'text-rose-700'
                              }
                            >
                              {nota.definitiva.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal text-xs">-</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              nota.estado === 'Aprobado'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : nota.estado === 'Reprobado'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {nota.estado}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600 text-[11px]">
                          {nota.observaciones || <span className="text-slate-400 italic">Sin observaciones</span>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
