/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Estudiante, ProgramaAcademico } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import {
  Users,
  Plus,
  Search,
  Filter,
  UserCheck,
  UserX,
  Edit,
  GraduationCap,
  Mail,
  Phone,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface EstudiantesModuleProps {
  onShowNotification: (
    tipo: 'success' | 'error' | 'warning' | 'info',
    titulo: string,
    mensaje: string,
    detalles?: string
  ) => void;
}

export const EstudiantesModule: React.FC<EstudiantesModuleProps> = ({ onShowNotification }) => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(StorageService.getEstudiantes());
  const programas = StorageService.getProgramas();

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroPrograma, setFiltroPrograma] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Estudiante | null>(null);

  // Form states
  const [formCodigo, setFormCodigo] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formDocumento, setFormDocumento] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formProgramaId, setFormProgramaId] = useState(programas[0]?.id || '');
  const [formSemestre, setFormSemestre] = useState(1);
  const [formEstadoAcademico, setFormEstadoAcademico] = useState<'Regular' | 'Prueba Académica' | 'Graduado' | 'Inactivo'>('Regular');

  const refrescar = () => {
    setEstudiantes(StorageService.getEstudiantes());
  };

  const handleOpenCrear = () => {
    setEditingStudent(null);
    setFormCodigo(`EST-2026-${Math.floor(Math.random() * 900) + 100}`);
    setFormNombre('');
    setFormDocumento('');
    setFormEmail('');
    setFormTelefono('+57 3');
    setFormProgramaId(programas[0]?.id || '');
    setFormSemestre(1);
    setFormEstadoAcademico('Regular');
    setModalOpen(true);
  };

  const handleOpenEditar = (est: Estudiante) => {
    setEditingStudent(est);
    setFormCodigo(est.codigoEstudiante);
    setFormNombre(est.nombreCompleto);
    setFormDocumento(est.documentoIdentidad);
    setFormEmail(est.email);
    setFormTelefono(est.telefono);
    setFormProgramaId(est.programaId);
    setFormSemestre(est.semestreActual);
    setFormEstadoAcademico(est.estadoAcademico);
    setModalOpen(true);
  };

  const handleToggleActivo = (est: Estudiante) => {
    const updated: Estudiante = {
      ...est,
      activo: !est.activo
    };
    StorageService.saveEstudiante(updated);
    refrescar();
    onShowNotification(
      'info',
      updated.activo ? 'Estudiante Activado' : 'Estudiante Desactivado',
      `El expediente de ${est.nombreCompleto} ha sido ${updated.activo ? 'activado' : 'desactivado'}.`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim() || !formDocumento.trim()) {
      onShowNotification('error', 'Campos Incompletos', 'Nombre y Documento de Identidad son requeridos.');
      return;
    }

    const emailCalculado = formEmail.trim() || `${formNombre.toLowerCase().replace(/\s+/g, '.')}@estudiante.edu.co`;

    const estudianteAGuardar: Estudiante = {
      id: editingStudent ? editingStudent.id : `est-${Date.now()}`,
      usuarioId: editingStudent ? editingStudent.usuarioId : `usr-est-${Date.now()}`,
      codigoEstudiante: formCodigo.trim(),
      nombreCompleto: formNombre.trim(),
      documentoIdentidad: formDocumento.trim(),
      email: emailCalculado,
      telefono: formTelefono.trim(),
      programaId: formProgramaId,
      semestreActual: formSemestre,
      promedioAcumulado: editingStudent ? editingStudent.promedioAcumulado : 4.0,
      creditosAprobados: editingStudent ? editingStudent.creditosAprobados : 0,
      estadoAcademico: formEstadoAcademico,
      activo: editingStudent ? editingStudent.activo : true
    };

    StorageService.saveEstudiante(estudianteAGuardar);
    refrescar();
    setModalOpen(false);
    onShowNotification(
      'success',
      editingStudent ? 'Estudiante Actualizado' : 'Estudiante Registrado',
      `El expediente de ${estudianteAGuardar.nombreCompleto} (${estudianteAGuardar.codigoEstudiante}) se guardó exitosamente.`
    );
  };

  const estudiantesFiltrados = estudiantes.filter((est) => {
    const coincideTexto =
      filtroTexto === '' ||
      est.nombreCompleto.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      est.codigoEstudiante.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      est.documentoIdentidad.includes(filtroTexto) ||
      est.email.toLowerCase().includes(filtroTexto.toLowerCase());

    const coincideProg = filtroPrograma === 'TODOS' || est.programaId === filtroPrograma;
    const coincideEst =
      filtroEstado === 'TODOS' ||
      (filtroEstado === 'ACTIVO' && est.activo) ||
      (filtroEstado === 'INACTIVO' && !est.activo);

    return coincideTexto && coincideProg && coincideEst;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Gestión Integral de Estudiantes (RF-03)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Directorio y Expediente Académico
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registro, actualización, activación y trazabilidad de estudiantes por programa y cohorte.
          </p>
        </div>

        <button
          onClick={handleOpenCrear}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Estudiante</span>
        </button>
      </div>

      {/* Filtros de Búsqueda (RF-11) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, código estudiantil, documento o correo institucional..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filtroPrograma}
            onChange={(e) => setFiltroPrograma(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Todos los Programas</option>
            {programas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Tabla de Estudiantes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Código / Estudiante</th>
                <th className="py-3 px-4">Programa Académico</th>
                <th className="py-3 px-4">Documento / Contacto</th>
                <th className="py-3 px-3 text-center">Nivel</th>
                <th className="py-3 px-3 text-center">Promedio</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {estudiantesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No se encontraron estudiantes con los filtros especificados.
                  </td>
                </tr>
              ) : (
                estudiantesFiltrados.map((est) => {
                  const prog = programas.find((p) => p.id === est.programaId);

                  return (
                    <tr key={est.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {est.nombreCompleto}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {est.codigoEstudiante}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {prog?.nombre}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {prog?.codigo} · {prog?.nivelAcademico}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-mono">
                          CC: {est.documentoIdentidad}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{est.email}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-semibold">
                        Semestre {est.semestreActual}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">
                        {est.promedioAcumulado.toFixed(1)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            est.activo
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {est.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditar(est)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Editar expediente"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActivo(est)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              est.activo
                                ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={est.activo ? 'Desactivar estudiante' : 'Activar estudiante'}
                          >
                            {est.activo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
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

      {/* MODAL REGISTRAR / EDITAR ESTUDIANTE */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="text-sm font-bold">
                {editingStudent ? 'Actualizar Expediente Estudiantil' : 'Registrar Nuevo Estudiante (RF-03)'}
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
                    Código Estudiantil
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
                    Documento de Identidad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1018475920"
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
                  placeholder="Andrés Felipe Morales"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo Institucional
                  </label>
                  <input
                    type="email"
                    placeholder="andres.morales@estudiante.edu.co"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono Móvil
                  </label>
                  <input
                    type="text"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Programa Académico
                </label>
                <select
                  value={formProgramaId}
                  onChange={(e) => setFormProgramaId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {programas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} - {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semestre Actual
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estado Académico
                  </label>
                  <select
                    value={formEstadoAcademico}
                    onChange={(e) => setFormEstadoAcademico(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Prueba Académica">Prueba Académica</option>
                    <option value="Graduado">Graduado</option>
                    <option value="Inactivo">Inactivo</option>
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
                  Guardar Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
