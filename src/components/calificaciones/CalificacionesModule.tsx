/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Usuario, Grupo, Asignatura, Docente, Calificacion, Estudiante } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import { calcularNotaDefinitiva } from '../../services/validationService';
import {
  Award,
  Save,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

interface CalificacionesModuleProps {
  currentUser: Usuario;
  onShowNotification: (
    tipo: 'success' | 'error' | 'warning' | 'info',
    titulo: string,
    mensaje: string,
    detalles?: string
  ) => void;
}

export const CalificacionesModule: React.FC<CalificacionesModuleProps> = ({
  currentUser,
  onShowNotification
}) => {
  const grupos = StorageService.getGrupos();
  const asignaturas = StorageService.getAsignaturas();
  const docentes = StorageService.getDocentes();
  const estudiantes = StorageService.getEstudiantes();
  const periodoActivo = StorageService.getPeriodoActivo();

  // Filtrar grupos si el usuario es docente
  const docenteAsociado = docentes.find(
    (d) => d.id === currentUser.referenciaId || d.email === currentUser.email
  );

  const gruposDisponibles =
    currentUser.rol === 'DOCENTE' && docenteAsociado
      ? grupos.filter((g) => g.docenteId === docenteAsociado.id && g.periodoId === periodoActivo.id)
      : grupos.filter((g) => g.periodoId === periodoActivo.id);

  const [grupoSeleccionadoId, setGrupoSeleccionadoId] = useState<string>(
    gruposDisponibles[0]?.id || grupos[0]?.id || ''
  );

  const [calificaciones, setCalificaciones] = useState<Calificacion[]>(
    StorageService.getCalificaciones()
  );

  // Buffer de edición temporal en memoria
  const [edicionNotas, setEdicionNotas] = useState<
    Record<
      string,
      {
        corte1: string;
        corte2: string;
        examenFinal: string;
        observaciones: string;
      }
    >
  >({});

  const grupoActual = grupos.find((g) => g.id === grupoSeleccionadoId);
  const asignaturaActual = asignaturas.find((a) => a.id === grupoActual?.asignaturaId);
  const docenteActual = docentes.find((d) => d.id === grupoActual?.docenteId);

  // Calificaciones correspondientes al grupo actual
  const calificacionesGrupo = calificaciones.filter((c) => c.grupoId === grupoSeleccionadoId);

  // Inicializar o sincronizar el buffer de edición cuando cambia el grupo
  React.useEffect(() => {
    const buffer: Record<
      string,
      { corte1: string; corte2: string; examenFinal: string; observaciones: string }
    > = {};

    calificacionesGrupo.forEach((c) => {
      buffer[c.id] = {
        corte1: c.corte1 !== null ? c.corte1.toString() : '',
        corte2: c.corte2 !== null ? c.corte2.toString() : '',
        examenFinal: c.examenFinal !== null ? c.examenFinal.toString() : '',
        observaciones: c.observaciones || ''
      };
    });

    setEdicionNotas(buffer);
  }, [grupoSeleccionadoId, calificaciones.length]);

  const handleNotaChange = (
    calificacionId: string,
    campo: 'corte1' | 'corte2' | 'examenFinal' | 'observaciones',
    valor: string
  ) => {
    setEdicionNotas((prev) => ({
      ...prev,
      [calificacionId]: {
        ...(prev[calificacionId] || { corte1: '', corte2: '', examenFinal: '', observaciones: '' }),
        [campo]: valor
      }
    }));
  };

  const handleGuardarFila = (calificacionId: string) => {
    const edit = edicionNotas[calificacionId];
    if (!edit) return;

    const c1 = edit.corte1.trim() !== '' ? parseFloat(edit.corte1) : null;
    const c2 = edit.corte2.trim() !== '' ? parseFloat(edit.corte2) : null;
    const ef = edit.examenFinal.trim() !== '' ? parseFloat(edit.examenFinal) : null;

    const res = StorageService.actualizarCalificacion(
      calificacionId,
      c1,
      c2,
      ef,
      edit.observaciones
    );

    if (!res.esValido) {
      onShowNotification('error', 'Calificación Inválida', res.mensaje);
      return;
    }

    setCalificaciones(StorageService.getCalificaciones());
    onShowNotification('success', 'Calificación Actualizada', res.mensaje);
  };

  const handleGuardarTodoElGrupo = () => {
    let errores = 0;
    calificacionesGrupo.forEach((c) => {
      const edit = edicionNotas[c.id];
      if (edit) {
        const c1 = edit.corte1.trim() !== '' ? parseFloat(edit.corte1) : null;
        const c2 = edit.corte2.trim() !== '' ? parseFloat(edit.corte2) : null;
        const ef = edit.examenFinal.trim() !== '' ? parseFloat(edit.examenFinal) : null;

        const res = StorageService.actualizarCalificacion(
          c.id,
          c1,
          c2,
          ef,
          edit.observaciones
        );
        if (!res.esValido) errores++;
      }
    });

    setCalificaciones(StorageService.getCalificaciones());

    if (errores > 0) {
      onShowNotification(
        'warning',
        'Guardado Parcial',
        `Se guardaron algunas notas, pero ${errores} registros tenían valores fuera de rango (0.0 a 5.0).`
      );
    } else {
      onShowNotification(
        'success',
        'Planilla de Calificaciones Guardada',
        `Se han registrado y publicado las calificaciones ponderadas de todos los estudiantes del grupo ${grupoActual?.codigo}.`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Registro y Publicación de Calificaciones (RF-08)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Ponderación: C1 (30%) · C2 (30%) · Examen (40%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluación continua institucional con cálculo automático de definitivas, estado aprobatorio (≥ 3.0) y auditoría inmutable.
          </p>
        </div>

        {calificacionesGrupo.length > 0 && (
          <button
            onClick={handleGuardarTodoElGrupo}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Guardar Toda la Planilla</span>
          </button>
        )}
      </div>

      {/* Selector de Grupo */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Seleccionar Grupo Académico Asignado
            </label>
            <select
              value={grupoSeleccionadoId}
              onChange={(e) => setGrupoSeleccionadoId(e.target.value)}
              className="w-full sm:w-96 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {gruposDisponibles.map((g) => {
                const a = asignaturas.find((as) => as.id === g.asignaturaId);
                return (
                  <option key={g.id} value={g.id}>
                    {g.codigo} - {a?.nombre} ({g.cuposOcupados} inscritos)
                  </option>
                );
              })}
            </select>
          </div>

          {grupoActual && (
            <div className="flex items-center gap-4 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Docente Titular:</span>
                <span className="font-semibold text-slate-800">{docenteActual?.nombreCompleto || 'Sin Asignar'}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-500 block">Asignatura:</span>
                <span className="font-semibold text-slate-800">{asignaturaActual?.nombre} ({asignaturaActual?.creditos} Cr)</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-500 block">Estudiantes Matriculados:</span>
                <span className="font-bold font-mono text-indigo-700">{calificacionesGrupo.length} alumnos</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Planilla de Calificaciones */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-3 text-center">Corte 1 (30%)</th>
                <th className="py-3 px-3 text-center">Corte 2 (30%)</th>
                <th className="py-3 px-3 text-center">Examen Final (40%)</th>
                <th className="py-3 px-3 text-center">Definitiva</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-4">Observaciones del Docente</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calificacionesGrupo.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No hay estudiantes matriculados en este grupo para calificar.
                  </td>
                </tr>
              ) : (
                calificacionesGrupo.map((cal) => {
                  const est = estudiantes.find((e) => e.id === cal.estudianteId);
                  const edit = edicionNotas[cal.id] || {
                    corte1: '',
                    corte2: '',
                    examenFinal: '',
                    observaciones: ''
                  };

                  // Cálculo en vivo para previsualización instantánea
                  const v1 = edit.corte1.trim() !== '' ? parseFloat(edit.corte1) : null;
                  const v2 = edit.corte2.trim() !== '' ? parseFloat(edit.corte2) : null;
                  const vf = edit.examenFinal.trim() !== '' ? parseFloat(edit.examenFinal) : null;
                  const preview = calcularNotaDefinitiva(v1, v2, vf);

                  return (
                    <tr key={cal.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {est?.nombreCompleto || 'Estudiante'}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {est?.codigoEstudiante} · Semestre {est?.semestreActual}
                        </div>
                      </td>

                      {/* Corte 1 */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0.0"
                          max="5.0"
                          placeholder="0.0"
                          value={edit.corte1}
                          onChange={(e) => handleNotaChange(cal.id, 'corte1', e.target.value)}
                          className="w-16 px-2 py-1 text-center font-mono text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Corte 2 */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0.0"
                          max="5.0"
                          placeholder="0.0"
                          value={edit.corte2}
                          onChange={(e) => handleNotaChange(cal.id, 'corte2', e.target.value)}
                          className="w-16 px-2 py-1 text-center font-mono text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Examen Final */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0.0"
                          max="5.0"
                          placeholder="0.0"
                          value={edit.examenFinal}
                          onChange={(e) => handleNotaChange(cal.id, 'examenFinal', e.target.value)}
                          className="w-16 px-2 py-1 text-center font-mono text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Definitiva Ponderada */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-sm">
                        {preview.definitiva !== null ? (
                          <span
                            className={
                              preview.definitiva >= 3.0 ? 'text-emerald-700' : 'text-rose-700'
                            }
                          >
                            {preview.definitiva.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal text-xs">-</span>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            preview.estado === 'Aprobado'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : preview.estado === 'Reprobado'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {preview.estado}
                        </span>
                      </td>

                      {/* Observaciones */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Observaciones pedagógicas..."
                          value={edit.observaciones}
                          onChange={(e) =>
                            handleNotaChange(cal.id, 'observaciones', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Botón Guardar Fila */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleGuardarFila(cal.id)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Guardar calificación de este estudiante"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
