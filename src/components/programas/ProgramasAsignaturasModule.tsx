/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProgramaAcademico, Asignatura } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Layers,
  GraduationCap,
  Award,
  Edit,
  X,
  Sparkles
} from 'lucide-react';

interface ProgramasAsignaturasModuleProps {
  onShowNotification: (
    tipo: 'success' | 'error' | 'warning' | 'info',
    titulo: string,
    mensaje: string,
    detalles?: string
  ) => void;
}

export const ProgramasAsignaturasModule: React.FC<ProgramasAsignaturasModuleProps> = ({
  onShowNotification
}) => {
  const [programas, setProgramas] = useState<ProgramaAcademico[]>(StorageService.getProgramas());
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>(StorageService.getAsignaturas());

  const [programaSeleccionadoId, setProgramaSeleccionadoId] = useState<string>(
    programas[0]?.id || ''
  );
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroSemestre, setFiltroSemestre] = useState('TODOS');

  // Modal Asignatura
  const [modalAsigOpen, setModalAsigOpen] = useState(false);
  const [editingAsig, setEditingAsig] = useState<Asignatura | null>(null);

  const [formCodigo, setFormCodigo] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formCreditos, setFormCreditos] = useState(3);
  const [formSemestre, setFormSemestre] = useState(1);
  const [formHoras, setFormHoras] = useState(4);
  const [formPrerrequisitos, setFormPrerrequisitos] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');

  const programaActual = programas.find((p) => p.id === programaSeleccionadoId) || programas[0];

  const refrescar = () => {
    setProgramas(StorageService.getProgramas());
    setAsignaturas(StorageService.getAsignaturas());
  };

  const handleOpenCrearAsig = () => {
    setEditingAsig(null);
    setFormCodigo('SIS-');
    setFormNombre('');
    setFormCreditos(3);
    setFormSemestre(1);
    setFormHoras(4);
    setFormPrerrequisitos('');
    setFormDescripcion('');
    setModalAsigOpen(true);
  };

  const handleOpenEditarAsig = (asig: Asignatura) => {
    setEditingAsig(asig);
    setFormCodigo(asig.codigo);
    setFormNombre(asig.nombre);
    setFormCreditos(asig.creditos);
    setFormSemestre(asig.semestreNivel);
    setFormHoras(asig.horasSemanales);
    setFormPrerrequisitos(asig.prerrequisitos.join(', '));
    setFormDescripcion(asig.descripcion);
    setModalAsigOpen(true);
  };

  const handleSubmitAsig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCodigo.trim() || !formNombre.trim()) {
      onShowNotification('error', 'Campos requeridos', 'Código y nombre de asignatura son obligatorios.');
      return;
    }

    const prereqArray = formPrerrequisitos
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0);

    const asigAGuardar: Asignatura = {
      id: editingAsig ? editingAsig.id : `asig-${Date.now()}`,
      codigo: formCodigo.trim().toUpperCase(),
      nombre: formNombre.trim(),
      programaId: programaActual.id,
      creditos: formCreditos,
      semestreNivel: formSemestre,
      horasSemanales: formHoras,
      prerrequisitos: prereqArray,
      descripcion: formDescripcion.trim(),
      estado: 'Activa'
    };

    StorageService.saveAsignatura(asigAGuardar);
    refrescar();
    setModalAsigOpen(false);
    onShowNotification(
      'success',
      editingAsig ? 'Asignatura Actualizada' : 'Asignatura Creada',
      `La materia ${asigAGuardar.codigo} - ${asigAGuardar.nombre} fue registrada exitosamente en el pensum.`
    );
  };

  // Filtrado de asignaturas del programa seleccionado
  const asignaturasFiltradas = asignaturas.filter((a) => {
    if (a.programaId !== programaActual.id) return false;

    const coincideTexto =
      filtroTexto === '' ||
      a.codigo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      a.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      a.descripcion.toLowerCase().includes(filtroTexto.toLowerCase());

    const coincideSemestre =
      filtroSemestre === 'TODOS' || a.semestreNivel === Number(filtroSemestre);

    return coincideTexto && coincideSemestre;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Programas Académicos y Malla Curricular (RF-05)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Catálogo de Asignaturas y Créditos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de planes de estudio, niveles semestrales, créditos académicos y reglas de prerrequisitos.
          </p>
        </div>

        <button
          onClick={handleOpenCrearAsig}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Asignatura</span>
        </button>
      </div>

      {/* Selector de Programa Académico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {programas.map((prog) => {
          const isSelected = prog.id === programaActual.id;
          const totalAsigs = asignaturas.filter((a) => a.programaId === prog.id).length;

          return (
            <button
              key={prog.id}
              onClick={() => setProgramaSeleccionadoId(prog.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-400 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  {prog.codigo}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 font-mono">
                  {prog.totalCreditos} Créditos
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                {prog.nombre}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {prog.facultad} · {prog.duracionSemestres} Semestres · {totalAsigs} Asignaturas
              </p>
            </button>
          );
        })}
      </div>

      {/* Filtros de Asignaturas */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código o nombre de la asignatura..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filtroSemestre}
            onChange={(e) => setFiltroSemestre(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Todos los Semestres</option>
            {Array.from({ length: programaActual.duracionSemestres }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s.toString()}>
                Semestre {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Malla de Asignaturas del Pensum */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Código / Asignatura</th>
                <th className="py-3 px-3 text-center">Nivel</th>
                <th className="py-3 px-3 text-center">Créditos</th>
                <th className="py-3 px-3 text-center">Horas / Sem</th>
                <th className="py-3 px-4">Prerrequisitos</th>
                <th className="py-3 px-4">Descripción Curricular</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {asignaturasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No se encontraron asignaturas registradas para este programa y filtro.
                  </td>
                </tr>
              ) : (
                asignaturasFiltradas.map((asig) => (
                  <tr key={asig.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {asig.nombre}
                      </div>
                      <div className="font-mono text-[11px] text-indigo-700 font-semibold">
                        {asig.codigo}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-semibold">
                      Sem {asig.semestreNivel}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                      {asig.creditos}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-slate-600">
                      {asig.horasSemanales}h
                    </td>

                    <td className="py-3 px-4">
                      {asig.prerrequisitos.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {asig.prerrequisitos.map((pr, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold border border-slate-200"
                            >
                              {pr}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Ninguno</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-[11px] max-w-sm line-clamp-2">
                      {asig.descripcion}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenEditarAsig(asig)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Editar asignatura"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR ASIGNATURA */}
      {modalAsigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="text-sm font-bold">
                {editingAsig ? 'Editar Asignatura Curricular' : 'Crear Asignatura en Pensum (RF-05)'}
              </h3>
              <button
                onClick={() => setModalAsigOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAsig} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código de Asignatura
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SIS-302"
                    value={formCodigo}
                    onChange={(e) => setFormCodigo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semestre / Nivel
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formSemestre}
                    onChange={(e) => setFormSemestre(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de la Asignatura
                </label>
                <input
                  type="text"
                  required
                  placeholder="Arquitectura de Software y Patrones"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Créditos Académicos
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formCreditos}
                    onChange={(e) => setFormCreditos(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Horas Semanales
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formHoras}
                    onChange={(e) => setFormHoras(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prerrequisitos (Códigos separados por coma)
                </label>
                <input
                  type="text"
                  placeholder="SIS-201, SIS-202"
                  value={formPrerrequisitos}
                  onChange={(e) => setFormPrerrequisitos(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción Curricular / Syllabus Sintético
                </label>
                <textarea
                  rows={3}
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  placeholder="Competencias, contenidos programáticos y resultados de aprendizaje..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalAsigOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Guardar Asignatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
