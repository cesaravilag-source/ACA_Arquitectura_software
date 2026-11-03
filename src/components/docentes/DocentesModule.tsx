/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Docente, Grupo } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import {
  Briefcase,
  Plus,
  Search,
  UserCheck,
  UserX,
  Edit,
  Mail,
  Phone,
  BookOpen,
  X,
  ClockAlert
} from 'lucide-react';

interface DocentesModuleProps {
  onShowNotification: (
    tipo: 'success' | 'error' | 'warning' | 'info',
    titulo: string,
    mensaje: string,
    detalles?: string
  ) => void;
}

export const DocentesModule: React.FC<DocentesModuleProps> = ({ onShowNotification }) => {
  const [docentes, setDocentes] = useState<Docente[]>(StorageService.getDocentes());
  const grupos = StorageService.getGrupos();
  const periodoActivo = StorageService.getPeriodoActivo();

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroDedicacion, setFiltroDedicacion] = useState('TODOS');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDocente, setEditingDocente] = useState<Docente | null>(null);

  // Form states
  const [formCodigo, setFormCodigo] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formDocumento, setFormDocumento] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formTitulo, setFormTitulo] = useState('Magíster en Ciencias');
  const [formEspecialidad, setFormEspecialidad] = useState('');
  const [formDepartamento, setFormDepartamento] = useState('Ingeniería de Sistemas');
  const [formDedicacion, setFormDedicacion] = useState<'Tiempo Completo' | 'Medio Tiempo' | 'Cátedra'>('Tiempo Completo');
  const [formMaxHoras, setFormMaxHoras] = useState(20);

  const refrescar = () => {
    setDocentes(StorageService.getDocentes());
  };

  const handleOpenCrear = () => {
    setEditingDocente(null);
    setFormCodigo(`DOC-${Math.floor(Math.random() * 9000) + 1000}`);
    setFormNombre('');
    setFormDocumento('');
    setFormEmail('');
    setFormTelefono('+57 3');
    setFormTitulo('Magíster en Ingeniería');
    setFormEspecialidad('Arquitectura de Software y Cloud');
    setFormDepartamento('Ingeniería de Sistemas');
    setFormDedicacion('Tiempo Completo');
    setFormMaxHoras(20);
    setModalOpen(true);
  };

  const handleOpenEditar = (doc: Docente) => {
    setEditingDocente(doc);
    setFormCodigo(doc.codigoDocente);
    setFormNombre(doc.nombreCompleto);
    setFormDocumento(doc.documentoIdentidad);
    setFormEmail(doc.email);
    setFormTelefono(doc.telefono);
    setFormTitulo(doc.tituloAcademico);
    setFormEspecialidad(doc.especialidad);
    setFormDepartamento(doc.departamento);
    setFormDedicacion(doc.dedicacion);
    setFormMaxHoras(doc.maxHorasSemanales);
    setModalOpen(true);
  };

  const handleToggleActivo = (doc: Docente) => {
    const updated: Docente = {
      ...doc,
      activo: !doc.activo
    };
    StorageService.saveDocente(updated);
    refrescar();
    onShowNotification(
      'info',
      updated.activo ? 'Docente Activado' : 'Docente Desactivado',
      `El registro del docente ${doc.nombreCompleto} ha sido ${updated.activo ? 'activado' : 'desactivado'}.`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim() || !formDocumento.trim()) {
      onShowNotification('error', 'Campos Incompletos', 'Nombre y Documento de Identidad son requeridos.');
      return;
    }

    const emailCalculado = formEmail.trim() || `${formNombre.toLowerCase().replace(/\s+/g, '.')}@universidad.edu.co`;

    const docenteAGuardar: Docente = {
      id: editingDocente ? editingDocente.id : `doc-${Date.now()}`,
      usuarioId: editingDocente ? editingDocente.usuarioId : `usr-doc-${Date.now()}`,
      codigoDocente: formCodigo.trim(),
      nombreCompleto: formNombre.trim(),
      documentoIdentidad: formDocumento.trim(),
      email: emailCalculado,
      telefono: formTelefono.trim(),
      tituloAcademico: formTitulo.trim(),
      especialidad: formEspecialidad.trim(),
      departamento: formDepartamento.trim(),
      dedicacion: formDedicacion,
      activo: editingDocente ? editingDocente.activo : true,
      maxHorasSemanales: formMaxHoras
    };

    StorageService.saveDocente(docenteAGuardar);
    refrescar();
    setModalOpen(false);
    onShowNotification(
      'success',
      editingDocente ? 'Docente Actualizado' : 'Docente Registrado',
      `El profesor(a) ${docenteAGuardar.nombreCompleto} (${docenteAGuardar.codigoDocente}) fue guardado con éxito.`
    );
  };

  const docentesFiltrados = docentes.filter((doc) => {
    const coincideTexto =
      filtroTexto === '' ||
      doc.nombreCompleto.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      doc.codigoDocente.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      doc.especialidad.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      doc.departamento.toLowerCase().includes(filtroTexto.toLowerCase());

    const coincideDedicacion =
      filtroDedicacion === 'TODOS' || doc.dedicacion === filtroDedicacion;

    return coincideTexto && coincideDedicacion;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Gestión de Planta Docente (RF-04)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Carga Académica y Especialidad
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registro, actualización y control de disponibilidad de profesores para programación de grupos.
          </p>
        </div>

        <button
          onClick={handleOpenCrear}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Docente</span>
        </button>
      </div>

      {/* Filtros de Búsqueda (RF-11) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, código docente, especialidad o departamento..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filtroDedicacion}
            onChange={(e) => setFiltroDedicacion(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Todas las dedicaciones</option>
            <option value="Tiempo Completo">Tiempo Completo</option>
            <option value="Medio Tiempo">Medio Tiempo</option>
            <option value="Cátedra">Cátedra</option>
          </select>
        </div>
      </div>

      {/* Directorio de Docentes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Docente / Título</th>
                <th className="py-3 px-4">Especialidad & Depto</th>
                <th className="py-3 px-4">Contacto Institucional</th>
                <th className="py-3 px-3 text-center">Dedicación</th>
                <th className="py-3 px-3 text-center">Grupos Asignados</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docentesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No se encontraron docentes con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                docentesFiltrados.map((doc) => {
                  const gruposAsignados = grupos.filter(
                    (g) => g.docenteId === doc.id && g.periodoId === periodoActivo.id
                  );

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {doc.nombreCompleto}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {doc.tituloAcademico} · <span className="font-mono">{doc.codigoDocente}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {doc.especialidad}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {doc.departamento}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{doc.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {doc.telefono}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold text-slate-800 font-mono text-[11px]">
                          {doc.dedicacion}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Max: {doc.maxHorasSemanales}h / sem
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">
                        {gruposAsignados.length} grupos
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            doc.activo
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {doc.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditar(doc)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Editar docente"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActivo(doc)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              doc.activo
                                ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={doc.activo ? 'Desactivar docente' : 'Activar docente'}
                          >
                            {doc.activo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRAR / EDITAR DOCENTE */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="text-sm font-bold">
                {editingDocente ? 'Actualizar Ficha Docente' : 'Registrar Nuevo Docente (RF-04)'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código Docente
                  </label>
                  <input
                    type="text"
                    required
                    value={formCodigo}
                    onChange={(e) => setFormCodigo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cédula / Documento
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="79845210"
                    value={formDocumento}
                    onChange={(e) => setFormDocumento(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Carlos Arturo Mendoza"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título Académico Más Alto
                  </label>
                  <input
                    type="text"
                    placeholder="Doctor en Ciencias de la Computación"
                    value={formTitulo}
                    onChange={(e) => setFormTitulo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Especialidad Principal
                  </label>
                  <input
                    type="text"
                    placeholder="Arquitectura de Software"
                    value={formEspecialidad}
                    onChange={(e) => setFormEspecialidad(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Departamento Académico
                  </label>
                  <input
                    type="text"
                    value={formDepartamento}
                    onChange={(e) => setFormDepartamento(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dedicación Contractual
                  </label>
                  <select
                    value={formDedicacion}
                    onChange={(e) => setFormDedicacion(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Tiempo Completo">Tiempo Completo (40h)</option>
                    <option value="Medio Tiempo">Medio Tiempo (20h)</option>
                    <option value="Cátedra">Cátedra</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Guardar Docente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
