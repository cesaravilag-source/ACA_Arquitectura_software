/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RegistroAuditoria, TipoModuloAuditoria } from '../../types/academic';
import { StorageService } from '../../services/storageService';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const AuditoriaModule: React.FC = () => {
  const [registros, setRegistros] = useState<RegistroAuditoria[]>(StorageService.getAuditoria());
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroModulo, setFiltroModulo] = useState<string>('TODOS');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  const refrescar = () => {
    setRegistros(StorageService.getAuditoria());
  };

  const registrosFiltrados = registros.filter((reg) => {
    const coincideTexto =
      filtroTexto === '' ||
      reg.nombreUsuario.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      reg.accion.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      reg.detalle.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      reg.entidadAfectada.toLowerCase().includes(filtroTexto.toLowerCase());

    const coincideModulo = filtroModulo === 'TODOS' || reg.modulo === filtroModulo;
    const coincideEstado = filtroEstado === 'TODOS' || reg.estadoResultado === filtroEstado;

    return coincideTexto && coincideModulo && coincideEstado;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Auditoría y Trazabilidad Transaccional (RF-12 / RNF-10)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Registro Inmutable de Eventos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bitácora de seguridad institucional: Inicios de sesión, cambios de rol, matrículas, notas modificadas y bloqueos por reglas de negocio.
          </p>
        </div>

        <button
          onClick={refrescar}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
        >
          Refrescar Bitácora
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por usuario, acción, entidad o detalle de la operación..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filtroModulo}
            onChange={(e) => setFiltroModulo(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Todos los Módulos</option>
            <option value="HORARIOS_DOCENTE">Horarios Docente</option>
            <option value="MATRICULAS">Matrículas</option>
            <option value="CALIFICACIONES">Calificaciones</option>
            <option value="AUTENTICACION">Autenticación</option>
            <option value="ESTUDIANTES">Estudiantes</option>
            <option value="DOCENTES">Docentes</option>
            <option value="GRUPOS">Grupos</option>
            <option value="SISTEMA">Sistema</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="TODOS">Todos los Resultados</option>
            <option value="EXITO">Éxito</option>
            <option value="BLOQUEADO_REGLA_NEGOCIO">Bloqueado por Regla</option>
            <option value="ERROR">Error</option>
          </select>
        </div>
      </div>

      {/* Tabla de Registros de Auditoría */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Usuario Responsable</th>
                <th className="py-3 px-3">Módulo</th>
                <th className="py-3 px-4">Acción Transaccional</th>
                <th className="py-3 px-3 text-center">Resultado</th>
                <th className="py-3 px-4">Detalle / Registro Afectado</th>
                <th className="py-3 px-3 font-mono text-right">IP Origen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No hay registros de auditoría que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                registrosFiltrados.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                      {new Date(reg.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 leading-tight">
                        {reg.nombreUsuario}
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-1 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                        {reg.rolUsuario}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] font-mono text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {reg.modulo}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 text-[11px]">
                      {reg.accion}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                          reg.estadoResultado === 'EXITO'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : reg.estadoResultado === 'BLOQUEADO_REGLA_NEGOCIO'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {reg.estadoResultado === 'BLOQUEADO_REGLA_NEGOCIO' ? 'Bloqueo Regla' : reg.estadoResultado}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 text-[11px] leading-relaxed max-w-md">
                      {reg.detalle}
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Entidad: {reg.entidadAfectada} · ID: {reg.idEntidadAfectada}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px] text-right whitespace-nowrap">
                      {reg.ipSimulada}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
