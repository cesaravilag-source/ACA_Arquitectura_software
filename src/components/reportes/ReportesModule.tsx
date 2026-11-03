/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import {
  BarChart3,
  Download,
  Printer,
  Filter,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

export const ReportesModule: React.FC = () => {
  const estudiantes = StorageService.getEstudiantes();
  const grupos = StorageService.getGrupos();
  const asignaturas = StorageService.getAsignaturas();
  const docentes = StorageService.getDocentes();
  const matriculas = StorageService.getMatriculas();
  const calificaciones = StorageService.getCalificaciones();
  const programas = StorageService.getProgramas();
  const periodos = StorageService.getPeriodos();
  const periodoActivo = StorageService.getPeriodoActivo();

  const [tipoReporte, setTipoReporte] = useState<'matriculas' | 'ocupacion' | 'calificaciones'>('matriculas');
  const [periodoFiltro, setPeriodoFiltro] = useState(periodoActivo.id);
  const [programaFiltro, setProgramaFiltro] = useState('TODOS');

  // Exportar a CSV (Interoperabilidad RNF-08)
  const handleExportarCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (tipoReporte === 'matriculas') {
      csvContent += 'Codigo_Estudiante,Nombre_Completo,Programa,Semestre,Asignatura_Codigo,Asignatura_Nombre,Grupo_Codigo,Fecha_Matricula\n';
      matriculas.forEach((m) => {
        const est = estudiantes.find((e) => e.id === m.estudianteId);
        const asig = asignaturas.find((a) => a.id === m.asignaturaId);
        const grp = grupos.find((g) => g.id === m.grupoId);
        const prog = programas.find((p) => p.id === est?.programaId);

        csvContent += `"${est?.codigoEstudiante || ''}","${est?.nombreCompleto || ''}","${prog?.nombre || ''}",${est?.semestreActual || 1},"${asig?.codigo || ''}","${asig?.nombre || ''}","${grp?.codigo || ''}","${m.fechaMatricula}"\n`;
      });
    } else if (tipoReporte === 'ocupacion') {
      csvContent += 'Grupo_Codigo,Asignatura,Docente,Cupo_Maximo,Cupos_Ocupados,Cupos_Disponibles,Porcentaje_Ocupacion\n';
      grupos.forEach((g) => {
        const asig = asignaturas.find((a) => a.id === g.asignaturaId);
        const doc = docentes.find((d) => d.id === g.docenteId);
        const pct = Math.round((g.cuposOcupados / g.cupoMaximo) * 100);

        csvContent += `"${g.codigo}","${asig?.nombre || ''}","${doc?.nombreCompleto || 'Sin Asignar'}",${g.cupoMaximo},${g.cuposOcupados},${g.cupoMaximo - g.cuposOcupados},${pct}%\n`;
      });
    } else {
      csvContent += 'Codigo_Estudiante,Estudiante,Asignatura,Corte_1,Corte_2,Examen_Final,Definitiva,Estado\n';
      calificaciones.forEach((c) => {
        const est = estudiantes.find((e) => e.id === c.estudianteId);
        const asig = asignaturas.find((a) => a.id === c.asignaturaId);

        csvContent += `"${est?.codigoEstudiante || ''}","${est?.nombreCompleto || ''}","${asig?.nombre || ''}",${c.corte1 ?? ''},${c.corte2 ?? ''},${c.examenFinal ?? ''},${c.definitiva ?? ''},"${c.estado}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_${tipoReporte}_${periodoActivo.codigo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Reportes Académicos y Estadísticas (RF-10)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Exportación CSV e Impresión
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Informes consolidados de matrículas, ocupación de cupos y resultados académicos con filtros multidimensionales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportarCSV}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Exportar Datos (CSV)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Imprimir Informe</span>
          </button>
        </div>
      </div>

      {/* Selector de Tipo de Reporte y Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center p-1 bg-slate-100 rounded-lg w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setTipoReporte('matriculas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              tipoReporte === 'matriculas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Estudiantes Matriculados
          </button>
          <button
            onClick={() => setTipoReporte('ocupacion')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              tipoReporte === 'ocupacion'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ocupación de Grupos
          </button>
          <button
            onClick={() => setTipoReporte('calificaciones')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              tipoReporte === 'calificaciones'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resultados y Rendimiento
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={periodoFiltro}
            onChange={(e) => setPeriodoFiltro(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {periodos.map((p) => (
              <option key={p.id} value={p.id}>
                Periodo {p.codigo}
              </option>
            ))}
          </select>

          <select
            value={programaFiltro}
            onChange={(e) => setProgramaFiltro(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Todos los Programas</option>
            {programas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visualización de Tabla del Reporte Seleccionado */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {tipoReporte === 'matriculas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Estudiante / Código</th>
                  <th className="py-3 px-4">Programa</th>
                  <th className="py-3 px-4">Asignatura</th>
                  <th className="py-3 px-3 text-center">Grupo</th>
                  <th className="py-3 px-3 text-center">Fecha de Matrícula</th>
                  <th className="py-3 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matriculas.map((m) => {
                  const est = estudiantes.find((e) => e.id === m.estudianteId);
                  const asig = asignaturas.find((a) => a.id === m.asignaturaId);
                  const grp = grupos.find((g) => g.id === m.grupoId);
                  const prog = programas.find((p) => p.id === est?.programaId);

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{est?.nombreCompleto}</div>
                        <div className="text-[11px] font-mono text-slate-500">{est?.codigoEstudiante}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{prog?.nombre}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{asig?.nombre}</div>
                        <div className="text-[11px] font-mono text-slate-500">{asig?.codigo} ({asig?.creditos} Cr)</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">
                        {grp?.codigo}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600 text-[11px]">
                        {new Date(m.fechaMatricula).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {m.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tipoReporte === 'ocupacion' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Código Grupo</th>
                  <th className="py-3 px-4">Asignatura</th>
                  <th className="py-3 px-4">Docente Titular</th>
                  <th className="py-3 px-3 text-center">Capacidad Máxima</th>
                  <th className="py-3 px-3 text-center">Ocupados</th>
                  <th className="py-3 px-3 text-center">Disponibles</th>
                  <th className="py-3 px-3 text-center">% Ocupación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grupos.map((g) => {
                  const asig = asignaturas.find((a) => a.id === g.asignaturaId);
                  const doc = docentes.find((d) => d.id === g.docenteId);
                  const pct = Math.round((g.cuposOcupados / g.cupoMaximo) * 100);

                  return (
                    <tr key={g.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">{g.codigo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{asig?.nombre}</td>
                      <td className="py-3 px-4 text-slate-700">{doc?.nombreCompleto || 'Sin Asignar'}</td>
                      <td className="py-3 px-3 text-center font-mono">{g.cupoMaximo}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold">{g.cuposOcupados}</td>
                      <td className="py-3 px-3 text-center font-mono">{g.cupoMaximo - g.cuposOcupados}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        <span className={pct >= 90 ? 'text-rose-600' : 'text-slate-800'}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tipoReporte === 'calificaciones' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Estudiante</th>
                  <th className="py-3 px-4">Asignatura</th>
                  <th className="py-3 px-3 text-center">Corte 1 (30%)</th>
                  <th className="py-3 px-3 text-center">Corte 2 (30%)</th>
                  <th className="py-3 px-3 text-center">Examen Final (40%)</th>
                  <th className="py-3 px-3 text-center">Definitiva</th>
                  <th className="py-3 px-3 text-center">Estado Académico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calificaciones.map((c) => {
                  const est = estudiantes.find((e) => e.id === c.estudianteId);
                  const asig = asignaturas.find((a) => a.id === c.asignaturaId);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{est?.nombreCompleto}</div>
                        <div className="text-[11px] font-mono text-slate-500">{est?.codigoEstudiante}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{asig?.nombre}</td>
                      <td className="py-3 px-3 text-center font-mono">{c.corte1 ?? '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{c.corte2 ?? '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{c.examenFinal ?? '-'}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">
                        {c.definitiva !== null ? c.definitiva.toFixed(1) : '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            c.estado === 'Aprobado'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : c.estado === 'Reprobado'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
