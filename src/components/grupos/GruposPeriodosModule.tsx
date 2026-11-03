/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Grupo, Docente, Asignatura, FranjaHoraria, DiaSemana } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import { validarCruceHorarioDocente } from '../../services/validationService';
import {
  CalendarDays,
  Plus,
  UserCheck,
  ClockAlert,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Filter,
  Building2,
  Users,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface GruposPeriodosModuleProps {
  onShowNotification: (
    tipo: 'success' | 'error' | 'warning' | 'info',
    titulo: string,
    mensaje: string,
    detalles?: string
  ) => void;
}

export const GruposPeriodosModule: React.FC<GruposPeriodosModuleProps> = ({
  onShowNotification
}) => {
  const [grupos, setGrupos] = useState<Grupo[]>(StorageService.getGrupos());
  const docentes = StorageService.getDocentes();
  const asignaturas = StorageService.getAsignaturas();
  const periodos = StorageService.getPeriodos();
  const periodoActivo = StorageService.getPeriodoActivo();

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroAsignatura, setFiltroAsignatura] = useState('TODAS');
  const [modalAsignarOpen, setModalAsignarOpen] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo | null>(null);
  const [docenteSeleccionadoId, setDocenteSeleccionadoId] = useState<string>('');
  const [alertaConflicto, setAlertaConflicto] = useState<string | null>(null);

  // Modal Crear Grupo
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevaAsignaturaId, setNuevaAsignaturaId] = useState(asignaturas[0]?.id || '');
  const [nuevoDocenteId, setNuevoDocenteId] = useState('');
  const [nuevoCupoMaximo, setNuevoCupoMaximo] = useState(25);
  const [nuevasFranjas, setNuevasFranjas] = useState<FranjaHoraria[]>([
    {
      id: 'frj-temp-1',
      dia: 'Lunes',
      horaInicio: '08:00',
      horaFin: '10:00',
      aula: 'Edificio A - Aula 101',
      modalidad: 'Presencial'
    }
  ]);

  const refrescarGrupos = () => {
    setGrupos(StorageService.getGrupos());
  };

  const handleOpenAsignarModal = (grupo: Grupo) => {
    setGrupoSeleccionado(grupo);
    setDocenteSeleccionadoId(grupo.docenteId || '');
    setAlertaConflicto(null);
    setModalAsignarOpen(true);
  };

  const handleGuardarAsignacion = () => {
    if (!grupoSeleccionado) return;

    if (!docenteSeleccionadoId) {
      // Desasignar docente
      const grupoActualizado: Grupo = {
        ...grupoSeleccionado,
        docenteId: null
      };
      StorageService.saveGrupoConValidacion(grupoActualizado);
      refrescarGrupos();
      setModalAsignarOpen(false);
      onShowNotification('info', 'Docente Desasignado', `El grupo ${grupoSeleccionado.codigo} quedó sin docente asignado.`);
      return;
    }

    const docente = docentes.find((d) => d.id === docenteSeleccionadoId);
    if (!docente) return;

    // Ejecutar validación de cruce de horario docente
    const resultado = validarCruceHorarioDocente(
      docente,
      grupoSeleccionado.horarios,
      grupoSeleccionado.periodoId,
      grupos,
      asignaturas,
      grupoSeleccionado.id
    );

    if (!resultado.esValido) {
      setAlertaConflicto(resultado.mensaje);
      onShowNotification(
        'error',
        'Bloqueo por Cruce de Horario Docente',
        resultado.mensaje,
        `Regla RF-06: El docente ya tiene clase en el mismo día y franja horaria coincidente.`
      );
      return;
    }

    // Si es válido, guardar asignación
    const grupoActualizado: Grupo = {
      ...grupoSeleccionado,
      docenteId: docente.id
    };

    const saveResult = StorageService.saveGrupoConValidacion(grupoActualizado);
    if (saveResult.esValido) {
      refrescarGrupos();
      setModalAsignarOpen(false);
      onShowNotification(
        'success',
        'Asignación Docente Exitosa',
        `El docente ${docente.nombreCompleto} fue asignado al grupo ${grupoSeleccionado.codigo} sin conflictos horarios.`
      );
    } else {
      setAlertaConflicto(saveResult.mensaje);
    }
  };

  /**
   * Disparador de Prueba Rápida de la Regla de Negocio
   */
  const handleProbarCruceDocente = () => {
    // Dr. Carlos Mendoza ya está asignado a SIS-302-G1 (Lunes 08:00 - 10:00)
    // Buscamos o creamos un grupo candidato que coincida con Lunes 09:00 - 11:00
    const grupo201 = grupos.find((g) => g.codigo === 'SIS-201-G1') || grupos[0];
    const docenteCarlos = docentes.find((d) => d.id === 'doc-1') || docentes[0];

    setGrupoSeleccionado(grupo201);
    setDocenteSeleccionadoId(docenteCarlos.id);
    setModalAsignarOpen(true);

    // Pre-validar y mostrar el bloqueo en vivo
    const resultado = validarCruceHorarioDocente(
      docenteCarlos,
      grupo201.horarios,
      grupo201.periodoId,
      grupos,
      asignaturas,
      grupo201.id
    );

    if (!resultado.esValido) {
      setAlertaConflicto(resultado.mensaje);
      onShowNotification(
        'warning',
        'Simulación de Cruce de Horario',
        `El grupo ${grupo201.codigo} tiene franja ${grupo201.horarios[0]?.dia} ${grupo201.horarios[0]?.horaInicio}-${grupo201.horarios[0]?.horaFin}, la cual colisiona con la clase actual del ${docenteCarlos.nombreCompleto}.`,
        resultado.mensaje
      );
    }
  };

  const handleCrearGrupo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCodigo.trim()) {
      onShowNotification('error', 'Código Requerido', 'Debe ingresar un código para el grupo (ej. SIS-101-G2).');
      return;
    }

    const nuevoGrupo: Grupo = {
      id: `grp-${Date.now()}`,
      codigo: nuevoCodigo.trim().toUpperCase(),
      asignaturaId: nuevaAsignaturaId,
      periodoId: periodoActivo.id,
      docenteId: nuevoDocenteId || null,
      cupoMaximo: nuevoCupoMaximo,
      cuposOcupados: 0,
      horarios: nuevasFranjas,
      estado: 'Abierto'
    };

    const res = StorageService.saveGrupoConValidacion(nuevoGrupo);
    if (!res.esValido) {
      onShowNotification('error', 'Error al crear grupo', res.mensaje);
      return;
    }

    refrescarGrupos();
    setModalCrearOpen(false);
    setNuevoCodigo('');
    onShowNotification('success', 'Grupo Creado', `El grupo ${nuevoGrupo.codigo} ha sido programado exitosamente.`);
  };

  const handleAgregarFranja = () => {
    setNuevasFranjas([
      ...nuevasFranjas,
      {
        id: `frj-${Date.now()}`,
        dia: 'Miércoles',
        horaInicio: '10:00',
        horaFin: '12:00',
        aula: 'Edificio B - Aula 202',
        modalidad: 'Presencial'
      }
    ]);
  };

  const handleEliminarFranja = (index: number) => {
    if (nuevasFranjas.length <= 1) return;
    setNuevasFranjas(nuevasFranjas.filter((_, i) => i !== index));
  };

  // Filtrado de grupos
  const gruposFiltrados = grupos.filter((g) => {
    const asig = asignaturas.find((a) => a.id === g.asignaturaId);
    const doc = docentes.find((d) => d.id === g.docenteId);

    const coincideTexto =
      filtroTexto === '' ||
      g.codigo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      asig?.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      doc?.nombreCompleto.toLowerCase().includes(filtroTexto.toLowerCase());

    const coincideAsignatura =
      filtroAsignatura === 'TODAS' || g.asignaturaId === filtroAsignatura;

    return coincideTexto && coincideAsignatura;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Grupos, Periodos y Asignación Docente (RF-06)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Regla de Conflicto Activa
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Programación de horarios académicos con validación algorítmica para evitar que un docente sea asignado en el mismo horario.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleProbarCruceDocente}
            className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Prueba en vivo del bloqueo por solapamiento de horarios de docentes"
          >
            <ClockAlert className="w-4 h-4 text-amber-600" />
            <span>Simular Regla Cruce Docente</span>
          </button>

          <button
            onClick={() => setModalCrearOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Grupo</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda (RF-11) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código de grupo, asignatura o nombre del docente..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filtroAsignatura}
            onChange={(e) => setFiltroAsignatura(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-auto"
          >
            <option value="TODAS">Todas las asignaturas</option>
            {asignaturas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.codigo} - {a.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Grupos y Horarios */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Grupo / Asignatura</th>
                <th className="py-3 px-4">Docente Asignado</th>
                <th className="py-3 px-4">Horario y Aula</th>
                <th className="py-3 px-4 text-center">Cupos</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gruposFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No se encontraron grupos que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                gruposFiltrados.map((grupo) => {
                  const asig = asignaturas.find((a) => a.id === grupo.asignaturaId);
                  const doc = docentes.find((d) => d.id === grupo.docenteId);
                  const porcentajeCupos = Math.round((grupo.cuposOcupados / grupo.cupoMaximo) * 100);

                  return (
                    <tr key={grupo.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 font-mono">
                          {grupo.codigo}
                        </div>
                        <div className="text-slate-600 font-medium">
                          {asig?.nombre || 'Asignatura'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {asig?.codigo} · {asig?.creditos} créditos · Nivel {asig?.semestreNivel}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {doc ? (
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>{doc.nombreCompleto}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {doc.tituloAcademico}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {doc.codigoDocente} · {doc.dedicacion}
                            </div>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pendiente Asignar</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {grupo.horarios.map((franja, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] font-medium text-slate-700 flex items-center gap-2"
                            >
                              <span className="font-semibold text-slate-900 w-16">
                                {franja.dia}:
                              </span>
                              <span className="font-mono text-indigo-700 bg-indigo-50/70 px-1.5 py-0.2 rounded border border-indigo-100">
                                {franja.horaInicio} - {franja.horaFin}
                              </span>
                              <span className="text-slate-500 text-[11px] truncate max-w-xs">
                                ({franja.aula})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="font-mono font-semibold text-slate-900">
                          {grupo.cuposOcupados} / {grupo.cupoMaximo}
                        </div>
                        <div className="w-20 mx-auto bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full ${
                              porcentajeCupos >= 90
                                ? 'bg-rose-500'
                                : porcentajeCupos >= 50
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(porcentajeCupos, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {grupo.cupoMaximo - grupo.cuposOcupados} disponibles
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            grupo.estado === 'Abierto'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {grupo.estado}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAsignarModal(grupo)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors shadow-2xs"
                        >
                          {grupo.docenteId ? 'Cambiar Docente' : 'Asignar Docente'}
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

      {/* MODAL: ASIGNAR DOCENTE CON CONTROL ESTRICTO DE CRUCE DE HORARIO */}
      {modalAsignarOpen && grupoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <ClockAlert className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">
                  Asignación Docente y Validación de Horario (RF-06)
                </h3>
              </div>
              <button
                onClick={() => setModalAsignarOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Grupo Seleccionado
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {grupoSeleccionado.codigo}
                </div>
                <div className="text-xs text-slate-700">
                  {asignaturas.find((a) => a.id === grupoSeleccionado.asignaturaId)?.nombre}
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-600">Franjas a ocupar:</span>
                  <div className="mt-1 space-y-1">
                    {grupoSeleccionado.horarios.map((h, i) => (
                      <div key={i} className="text-xs font-mono text-slate-800 flex items-center gap-2">
                        <span className="font-semibold">{h.dia}:</span>
                        <span className="text-indigo-700">{h.horaInicio} a {h.horaFin}</span>
                        <span className="text-slate-500">({h.aula})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Seleccionar Docente a Asignar
                </label>
                <select
                  value={docenteSeleccionadoId}
                  onChange={(e) => {
                    setDocenteSeleccionadoId(e.target.value);
                    setAlertaConflicto(null);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Sin Docente Asignado --</option>
                  {docentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombreCompleto} ({d.especialidad}) - {d.dedicacion}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Nota: El sistema verificará de inmediato si el docente tiene clases asignadas en los mismos días y horas.
                </p>
              </div>

              {/* Banner de Conflicto en Rojo */}
              {alertaConflicto && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Bloqueo Transaccional por Cruce de Horario</span>
                  </div>
                  <p className="text-xs leading-relaxed text-rose-700">
                    {alertaConflicto}
                  </p>
                  <div className="text-[11px] font-mono text-rose-800 bg-white/70 p-2 rounded border border-rose-200">
                    Regla de Integridad RNF-07: Asignación rechazada para preservar la consistencia de horarios del docente.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalAsignarOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleGuardarAsignacion}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                >
                  Validar y Guardar Asignación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREAR NUEVO GRUPO */}
      {modalCrearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="text-sm font-bold">Crear Nuevo Grupo Académico</h3>
              <button
                onClick={() => setModalCrearOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearGrupo} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código del Grupo (ej. SIS-101-G2)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SIS-101-G2"
                    value={nuevoCodigo}
                    onChange={(e) => setNuevoCodigo(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cupo Máximo
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={nuevoCupoMaximo}
                    onChange={(e) => setNuevoCupoMaximo(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asignatura del Pensum
                </label>
                <select
                  value={nuevaAsignaturaId}
                  onChange={(e) => setNuevaAsignaturaId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {asignaturas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.codigo} - {a.nombre} ({a.creditos} créditos)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Docente Inicial (Opcional)
                </label>
                <select
                  value={nuevoDocenteId}
                  onChange={(e) => setNuevoDocenteId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">-- Sin Docente Asignado --</option>
                  {docentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombreCompleto} - {d.especialidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Franjas Horarias */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Franjas Horarias Semanales
                  </label>
                  <button
                    type="button"
                    onClick={handleAgregarFranja}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Día/Hora</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {nuevasFranjas.map((franja, index) => (
                    <div key={franja.id || index} className="flex items-center gap-2 text-xs bg-white p-2 rounded-lg border border-slate-200">
                      <select
                        value={franja.dia}
                        onChange={(e) => {
                          const copy = [...nuevasFranjas];
                          copy[index].dia = e.target.value as DiaSemana;
                          setNuevasFranjas(copy);
                        }}
                        className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800"
                      >
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                      </select>

                      <input
                        type="time"
                        value={franja.horaInicio}
                        onChange={(e) => {
                          const copy = [...nuevasFranjas];
                          copy[index].horaInicio = e.target.value;
                          setNuevasFranjas(copy);
                        }}
                        className="px-1.5 py-1 bg-slate-50 border border-slate-300 rounded font-mono"
                      />
                      <span>a</span>
                      <input
                        type="time"
                        value={franja.horaFin}
                        onChange={(e) => {
                          const copy = [...nuevasFranjas];
                          copy[index].horaFin = e.target.value;
                          setNuevasFranjas(copy);
                        }}
                        className="px-1.5 py-1 bg-slate-50 border border-slate-300 rounded font-mono"
                      />

                      <input
                        type="text"
                        placeholder="Aula / Sala"
                        value={franja.aula}
                        onChange={(e) => {
                          const copy = [...nuevasFranjas];
                          copy[index].aula = e.target.value;
                          setNuevasFranjas(copy);
                        }}
                        className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded"
                      />

                      {nuevasFranjas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleEliminarFranja(index)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalCrearOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Guardar Grupo Académico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
