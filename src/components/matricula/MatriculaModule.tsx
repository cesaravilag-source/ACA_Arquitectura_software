/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Usuario, Estudiante, Grupo, Asignatura, Matricula, Docente } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Building2,
  Trash2,
  Printer,
  Calendar,
  BookOpen,
  User,
  ShieldAlert,
  Search,
  Sparkles
} from 'lucide-react';

interface MatriculaModuleProps {
  currentUser: Usuario;
  onShowNotification: (
    tipo: 'success' | 'error' | 'warning' | 'info',
    titulo: string,
    mensaje: string,
    detalles?: string
  ) => void;
}

export const MatriculaModule: React.FC<MatriculaModuleProps> = ({
  currentUser,
  onShowNotification
}) => {
  const estudiantes = StorageService.getEstudiantes();
  const grupos = StorageService.getGrupos();
  const asignaturas = StorageService.getAsignaturas();
  const docentes = StorageService.getDocentes();
  const programas = StorageService.getProgramas();
  const periodoActivo = StorageService.getPeriodoActivo();

  // Si el usuario es un estudiante, seleccionarlo por defecto
  const estudianteInicial =
    currentUser.rol === 'ESTUDIANTE'
      ? estudiantes.find((e) => e.id === currentUser.referenciaId || e.email === currentUser.email) || estudiantes[0]
      : estudiantes[0];

  const [estudianteSeleccionadoId, setEstudianteSeleccionadoId] = useState<string>(
    estudianteInicial?.id || ''
  );
  const [matriculas, setMatriculas] = useState<Matricula[]>(StorageService.getMatriculas());
  const [gruposState, setGruposState] = useState<Grupo[]>(StorageService.getGrupos());
  const [filtroTexto, setFiltroTexto] = useState('');
  const [mostrarComprobante, setMostrarComprobante] = useState(false);

  const estudianteActual = estudiantes.find((e) => e.id === estudianteSeleccionadoId) || estudiantes[0];
  const programaEstudiante = programas.find((p) => p.id === estudianteActual?.programaId);

  const refrescarMatriculas = () => {
    setMatriculas(StorageService.getMatriculas());
    setGruposState(StorageService.getGrupos());
  };

  // Matrículas activas del estudiante seleccionado en el periodo actual
  const matriculasDelEstudiante = matriculas.filter(
    (m) =>
      m.estudianteId === estudianteActual?.id &&
      m.periodoId === periodoActivo.id &&
      m.estado === 'MATRICULADO'
  );

  const totalCreditosInscritos = matriculasDelEstudiante.reduce((acc, m) => {
    const asig = asignaturas.find((a) => a.id === m.asignaturaId);
    return acc + (asig?.creditos || 0);
  }, 0);

  const handleMatricularGrupo = (grupo: Grupo) => {
    if (!estudianteActual) return;

    const res = StorageService.realizarMatricula(estudianteActual.id, grupo.id);

    if (!res.esValido) {
      onShowNotification(
        'error',
        'Matrícula No Permitida',
        res.mensaje,
        res.codigoError ? `Código de Regla: ${res.codigoError}` : undefined
      );
      return;
    }

    refrescarMatriculas();
    onShowNotification(
      'success',
      'Matrícula Registrada',
      res.mensaje
    );
  };

  const handleCancelarMatricula = (matriculaId: string) => {
    const res = StorageService.cancelarMatricula(matriculaId);
    if (!res.esValido) {
      onShowNotification('error', 'Error al cancelar', res.mensaje);
      return;
    }
    refrescarMatriculas();
    onShowNotification('info', 'Matrícula Cancelada', 'La asignatura fue desmatriculada y el cupo se liberó en el grupo.');
  };

  // Grupos disponibles para este periodo
  const gruposDisponibles = gruposState.filter((g) => {
    if (g.periodoId !== periodoActivo.id) return false;
    const asig = asignaturas.find((a) => a.id === g.asignaturaId);
    if (!asig) return false;

    // Buscar si coincide con texto
    const matchTexto =
      filtroTexto === '' ||
      g.codigo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      asig.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      asig.codigo.toLowerCase().includes(filtroTexto.toLowerCase());

    return matchTexto;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Matrícula Académica y Registro de Asignaturas (RF-07)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Validación de Cupos y Cruces
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Inscripción formal de materias para estudiantes con control de prerrequisitos, límites de cupos y no colisión de horarios.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {matriculasDelEstudiante.length > 0 && (
            <button
              onClick={() => setMostrarComprobante(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Ver Comprobante Oficial</span>
            </button>
          )}
        </div>
      </div>

      {/* Selector de Estudiante (Si no es rol Estudiante o para Coordinadores) */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Estudiante en Gestión de Matrícula
            </label>
            {currentUser.rol === 'ESTUDIANTE' ? (
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{estudianteActual?.nombreCompleto}</span>
                <span className="text-xs font-mono text-slate-500">
                  ({estudianteActual?.codigoEstudiante})
                </span>
              </div>
            ) : (
              <select
                value={estudianteSeleccionadoId}
                onChange={(e) => setEstudianteSeleccionadoId(e.target.value)}
                className="w-full sm:w-96 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {estudiantes.map((est) => (
                  <option key={est.id} value={est.id}>
                    {est.codigoEstudiante} - {est.nombreCompleto} ({est.estadoAcademico})
                  </option>
                ))}
              </select>
            )}
          </div>

          {estudianteActual && (
            <div className="flex items-center gap-4 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Programa:</span>
                <span className="font-semibold text-slate-800">{programaEstudiante?.nombre}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-500 block">Semestre Actual:</span>
                <span className="font-semibold text-slate-800">Nivel {estudianteActual.semestreActual}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-500 block">Créditos Inscritos:</span>
                <span className="font-bold font-mono text-indigo-700">{totalCreditosInscritos} Créditos</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 1: ASIGNATURAS YA MATRICULADAS EN EL PERIODO ACTUAL */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Asignaturas Inscritas en Periodo {periodoActivo.codigo} ({matriculasDelEstudiante.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-600">
            Total Créditos: {totalCreditosInscritos}
          </span>
        </div>

        {matriculasDelEstudiante.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <p className="text-xs font-medium">El estudiante aún no tiene asignaturas matriculadas en este periodo.</p>
            <p className="text-[11px] text-slate-400">Seleccione los grupos de la lista inferior para inscribirlos.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {matriculasDelEstudiante.map((m) => {
              const grupo = gruposState.find((g) => g.id === m.grupoId);
              const asig = asignaturas.find((a) => a.id === m.asignaturaId);
              const doc = docentes.find((d) => d.id === grupo?.docenteId);

              return (
                <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                        {grupo?.codigo}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        {asig?.nombre}
                      </span>
                      <span className="text-[11px] text-indigo-700 bg-indigo-50 font-mono px-1 rounded">
                        {asig?.creditos} Créditos
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-3">
                      <span>Docente: {doc?.nombreCompleto || 'Por designar'}</span>
                      <span className="text-slate-300">·</span>
                      <div className="flex items-center gap-2 font-mono">
                        {grupo?.horarios.map((h, i) => (
                          <span key={i} className="text-slate-700 bg-slate-100 px-1 rounded">
                            {h.dia} {h.horaInicio}-{h.horaFin} ({h.aula})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Inscrito
                    </span>
                    <button
                      onClick={() => handleCancelarMatricula(m.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Cancelar matrícula de esta asignatura"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECCIÓN 2: CATÁLOGO DE GRUPOS DISPONIBLES PARA MATRICULAR */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden space-y-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Oferta Académica Disponible para Matricular
            </h3>
            <p className="text-[11px] text-slate-500">
              Grupos programados con control de cupos y cruces de horario en tiempo real.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar asignatura o código..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gruposDisponibles.map((grupo) => {
            const asig = asignaturas.find((a) => a.id === grupo.asignaturaId);
            const doc = docentes.find((d) => d.id === grupo.docenteId);
            const yaInscrito = matriculasDelEstudiante.some((m) => m.grupoId === grupo.id);
            const yaInscritoEnMismaAsig = matriculasDelEstudiante.some((m) => m.asignaturaId === grupo.asignaturaId);
            const cuposDisponibles = grupo.cupoMaximo - grupo.cuposOcupados;
            const sinCupos = cuposDisponibles <= 0;

            return (
              <div
                key={grupo.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  yaInscrito
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : sinCupos
                    ? 'bg-slate-50/50 border-slate-200 opacity-70'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        {grupo.codigo}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {asig?.codigo}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono">
                      {sinCupos ? (
                        <span className="text-rose-600 font-semibold">Cupo Lleno</span>
                      ) : (
                        <span className="text-slate-600 font-medium">
                          {cuposDisponibles} cupos libres
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {asig?.nombre}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {asig?.creditos} Créditos · Nivel {asig?.semestreNivel} · Docente: {doc?.nombreCompleto || 'Por designar'}
                  </p>

                  <div className="mt-2.5 p-2 rounded bg-slate-50 border border-slate-100 space-y-1 text-[11px] font-mono text-slate-700">
                    {grupo.horarios.map((h, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span>{h.dia}: {h.horaInicio} - {h.horaFin}</span>
                        <span className="text-slate-400 text-[10px]">{h.aula}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Ocupación: {grupo.cuposOcupados}/{grupo.cupoMaximo}
                  </span>

                  {yaInscrito ? (
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Inscrita</span>
                    </div>
                  ) : yaInscritoEnMismaAsig ? (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Ya matriculada en otro grupo
                    </span>
                  ) : sinCupos ? (
                    <span className="text-xs font-semibold text-slate-400">
                      Sin cupos
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMatricularGrupo(grupo)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
                    >
                      Matricular Grupo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL / COMPROBANTE OFICIAL DE MATRÍCULA */}
      {mostrarComprobante && estudianteActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold">
                  Comprobante Oficial de Matrícula Académica (RF-07)
                </h3>
              </div>
              <button
                onClick={() => setMostrarComprobante(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-center pb-2 border-b border-slate-200">
                  <h4 className="font-bold text-sm text-slate-900 uppercase">
                    INSTITUCIÓN DE EDUCACIÓN SUPERIOR - SGA CAMPUS
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Registro de Inscripción y Horario · Periodo Lectivo {periodoActivo.codigo}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-slate-500 block">Estudiante:</span>
                    <span className="font-bold text-slate-900">{estudianteActual.nombreCompleto}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Código Estudiantil:</span>
                    <span className="font-bold font-mono text-slate-900">{estudianteActual.codigoEstudiante}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Programa:</span>
                    <span className="font-semibold text-slate-800">{programaEstudiante?.nombre}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Créditos Totales Inscritos:</span>
                    <span className="font-bold font-mono text-indigo-700">{totalCreditosInscritos} Créditos</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Asignaturas y Horarios Formalizados
                </h5>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-[11px] text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="py-2 px-3">Código</th>
                        <th className="py-2 px-3">Asignatura</th>
                        <th className="py-2 px-3">Créditos</th>
                        <th className="py-2 px-3">Horario</th>
                        <th className="py-2 px-3">Aula</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matriculasDelEstudiante.map((m) => {
                        const asig = asignaturas.find((a) => a.id === m.asignaturaId);
                        const grupo = gruposState.find((g) => g.id === m.grupoId);
                        return (
                          <tr key={m.id}>
                            <td className="py-2 px-3 font-mono font-semibold">{grupo?.codigo}</td>
                            <td className="py-2 px-3">{asig?.nombre}</td>
                            <td className="py-2 px-3 font-mono">{asig?.creditos}</td>
                            <td className="py-2 px-3 font-mono text-[11px]">
                              {grupo?.horarios.map((h) => `${h.dia} ${h.horaInicio}-${h.horaFin}`).join(', ')}
                            </td>
                            <td className="py-2 px-3">{grupo?.horarios[0]?.aula}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-[11px] text-slate-400">
                  Emitido electrónicamente · Firma Digital SGA Valida
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
                  >
                    Imprimir Comprobante
                  </button>
                  <button
                    onClick={() => setMostrarComprobante(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
