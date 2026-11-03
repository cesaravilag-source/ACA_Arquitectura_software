/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import {
  Layers,
  Code2,
  Database,
  ShieldCheck,
  Server,
  Cpu,
  FileCode,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface ArquitecturaModuleProps {
  onShowNotification: (
    tipo: 'success' | 'error' | 'warning' | 'info',
    titulo: string,
    mensaje: string,
    detalles?: string
  ) => void;
}

export const ArquitecturaModule: React.FC<ArquitecturaModuleProps> = ({ onShowNotification }) => {
  const [subTab, setSubTab] = useState<'diagrama' | 'codigo' | 'api' | 'backup'>('diagrama');
  const [archivoCodigo, setArchivoCodigo] = useState<'cruce_docente' | 'matricula_service' | 'entidad_jpa' | 'controller_rest' | 'ddl_sql'>('cruce_docente');
  const [copiado, setCopiado] = useState(false);

  // Backup file upload
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importarBaseDeDatosJSON(content);
      if (res.esValido) {
        onShowNotification('success', 'Restauración Exitosa', res.mensaje);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        onShowNotification('error', 'Fallo de Restauración', res.mensaje);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadBackup = () => {
    const jsonStr = StorageService.exportarBaseDeDatosJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sga_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowNotification('success', 'Respaldo Generado', 'Archivo JSON de respaldo descargado con éxito.');
  };

  const handleResetData = () => {
    if (window.confirm('¿Está seguro de reiniciar los datos a la configuración inicial de fábrica?')) {
      StorageService.reiniciarDatosFabrica();
      onShowNotification('info', 'Datos Reiniciados', 'La base de datos institucional fue restablecida a los valores iniciales.');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Arquitectura del Software SGA & Spring Boot / Hibernate
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Nivel Senior Architect
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Diseño arquitectónico multicapa, persistencia JPA/Hibernate, control de concurrencia ACID y respaldo transaccional.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('diagrama')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              subTab === 'diagrama'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Capas & Componentes
          </button>
          <button
            onClick={() => setSubTab('codigo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              subTab === 'codigo'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Código Spring Boot 3
          </button>
          <button
            onClick={() => setSubTab('api')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              subTab === 'api'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            REST API (RNF-08)
          </button>
          <button
            onClick={() => setSubTab('backup')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              subTab === 'backup'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Respaldo / BD (RNF-09)
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DIAGRAMA DE ARQUITECTURA EN CAPAS */}
      {subTab === 'diagrama' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Arquitectura en Capas (Layered Architecture Pattern)
              </h3>
              <p className="text-xs text-slate-500">
                Separación rigurosa de responsabilidades con bajo acoplamiento y alta cohesión (RNF-05), diseñada para 300+ usuarios concurrentes (RNF-02).
              </p>
            </div>

            {/* Capas visuales */}
            <div className="space-y-3 max-w-4xl mx-auto">
              {/* Capa 1: Presentación */}
              <div className="p-4 rounded-xl bg-slate-50 border-2 border-indigo-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      Capa 1: Presentación & Experiencia de Usuario (Frontend SPA)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-700 font-semibold">
                    React 19 + TypeScript + Tailwind CSS
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Interfaz reactiva adaptativa (RNF-06 / RNF-12), sin pills innecesarias, con gestión de estado modular y validaciones preventivas en cliente.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-700">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Header & RBAC Switcher</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">GruposPeriodosModule</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">MatriculaModule</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">CalificacionesModule</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">EstudiantePortalModule</span>
                </div>
              </div>

              {/* Conector */}
              <div className="flex justify-center text-slate-400 font-mono text-xs">
                ↓ HTTPS / JSON REST API (RNF-01 / RNF-08) ↓
              </div>

              {/* Capa 2: Seguridad y Controladores */}
              <div className="p-4 rounded-xl bg-slate-50 border-2 border-sky-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      Capa 2: Controladores y Seguridad (Spring Boot REST & Spring Security 6)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-sky-700 font-semibold">
                    Spring Web + JWT Filter + BCrypt
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Exposición de endpoints RESTful versionados (<code className="font-mono">/api/v1/*</code>), deserialización de DTOs con Bean Validation (<code className="font-mono">@Valid</code>) y autorización granular por roles (<code className="font-mono">@PreAuthorize</code>).
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-700">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">DocenteRestController</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">MatriculaRestController</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">CalificacionRestController</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">JwtAuthenticationFilter</span>
                </div>
              </div>

              {/* Conector */}
              <div className="flex justify-center text-slate-400 font-mono text-xs">
                ↓ Invocación de Servicios de Dominio ↓
              </div>

              {/* Capa 3: Lógica de Negocio */}
              <div className="p-4 rounded-xl bg-slate-50 border-2 border-emerald-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      Capa 3: Lógica de Negocio & Servicios Transaccionales (Spring Service Layer)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    @Service + @Transactional + ACID
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Núcleo de reglas institucionales: Detección algorítmica de solapamiento de horarios docentes (<code className="font-mono">hayTraslapeHorario</code>), validación de cupos y prerrequisitos estudiantiles.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-700">
                  <span className="px-2 py-0.5 rounded bg-white border border-emerald-300 font-semibold text-emerald-900">ValidacionCruceHorarioDocenteService</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-emerald-300 font-semibold text-emerald-900">MatriculaTransactionalService</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">CalificacionCalculationEngine</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">AuditoriaAspect (AOP)</span>
                </div>
              </div>

              {/* Conector */}
              <div className="flex justify-center text-slate-400 font-mono text-xs">
                ↓ Mapeo Objeto-Relacional (ORM) ↓
              </div>

              {/* Capa 4: Persistencia y Repositorios */}
              <div className="p-4 rounded-xl bg-slate-50 border-2 border-amber-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      Capa 4: Acceso a Datos & Repositorios (Spring Data JPA / Hibernate)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-amber-700 font-semibold">
                    Hibernate ORM + Optimistic Locking (@Version)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Mapeo relacional de entidades, prevención de carreras de datos mediante bloqueo optimista en cupos y consultas JPQL optimizadas con índices.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-700">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">GrupoRepository</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">MatriculaRepository</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">DocenteRepository</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200">AuditoriaRepository</span>
                </div>
              </div>

              {/* Conector */}
              <div className="flex justify-center text-slate-400 font-mono text-xs">
                ↓ Conexión JDBC Pool HikariCP ↓
              </div>

              {/* Capa 5: Base de Datos Relacional */}
              <div className="p-4 rounded-xl bg-slate-900 text-white shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold uppercase">
                      Capa 5: Almacenamiento Relacional (PostgreSQL / MySQL)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-300 font-semibold">
                    ACID · Llaves Foráneas · Índices B-Tree
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Tablas normalizadas en Tercera Forma Normal (3FN), restricciones de unicidad en matrículas y auditoría con triggers o logs inmutables.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CÓDIGO SPRING BOOT 3 & HIBERNATE */}
      {subTab === 'codigo' && (
        <div className="space-y-4">
          {/* Selector de Archivo Fuente */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setArchivoCodigo('cruce_docente')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md font-mono transition-colors ${
                  archivoCodigo === 'cruce_docente'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                ValidacionCruceHorarioDocenteService.java
              </button>
              <button
                onClick={() => setArchivoCodigo('matricula_service')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md font-mono transition-colors ${
                  archivoCodigo === 'matricula_service'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                MatriculaTransactionalService.java
              </button>
              <button
                onClick={() => setArchivoCodigo('entidad_jpa')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md font-mono transition-colors ${
                  archivoCodigo === 'entidad_jpa'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                GrupoAcademicoEntity.java (JPA)
              </button>
              <button
                onClick={() => setArchivoCodigo('controller_rest')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md font-mono transition-colors ${
                  archivoCodigo === 'controller_rest'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                DocenteRestController.java
              </button>
              <button
                onClick={() => setArchivoCodigo('ddl_sql')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md font-mono transition-colors ${
                  archivoCodigo === 'ddl_sql'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                schema_ddl.sql
              </button>
            </div>

            <button
              onClick={() => {
                const code = getCodeContent(archivoCodigo);
                copyToClipboard(code);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md flex items-center gap-1.5 shrink-0 ml-3"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiado ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>

          {/* Visualizador de Código */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs shadow-md">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">
                src/main/java/edu/sga/academico/service/{archivoCodigo}.java
              </span>
              <span>Spring Boot 3.3.4 · Java 21 LTS · Jakarta EE 10</span>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed text-[11px]">
              <code>{getCodeContent(archivoCodigo)}</code>
            </pre>
          </div>
        </div>
      )}

      {/* SUBTAB 3: INTERACTIVE REST API EXPLORER */}
      {subTab === 'api' && (
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Catálogo de Interfaces RESTful (RNF-08 Interoperabilidad)
              </h3>
              <p className="text-xs text-slate-500">
                Especificación OpenAPI 3.0 / Swagger institucional para integración con sistemas universitarios.
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              HTTP / JSON v1
            </span>
          </div>

          <div className="space-y-3">
            {/* Endpoint 1 */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-600 text-white">
                  POST
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  /api/v1/grupos/{'{id}'}/asignar-docente
                </span>
                <span className="text-[11px] text-slate-500 ml-auto">
                  Roles: ADMIN, COORDINADOR
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Asigna un docente validando en tiempo real que no existan traslapes horarios con otros grupos asignados en el periodo activo. Retorna código 409 Conflict si hay cruce.
              </p>
            </div>

            {/* Endpoint 2 */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-600 text-white">
                  POST
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  /api/v1/matriculas
                </span>
                <span className="text-[11px] text-slate-500 ml-auto">
                  Roles: ESTUDIANTE, ADMIN, COORDINADOR
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Registra la matrícula de un estudiante en un grupo con reserva atómica de cupo y chequeo de colisiones de agenda.
              </p>
            </div>

            {/* Endpoint 3 */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-600 text-white">
                  PUT
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  /api/v1/calificaciones/{'{id}'}
                </span>
                <span className="text-[11px] text-slate-500 ml-auto">
                  Roles: DOCENTE, ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Actualiza calificaciones parciales (Corte 1, Corte 2, Examen Final) y recalcula automáticamente la definitiva ponderada y estado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: RESPALDO Y RECUPERACIÓN (RNF-09) */}
      {subTab === 'backup' && (
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Respaldo y Recuperación de Base de Datos Institucional (RNF-09)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Protección de datos ante contingencias: exportación en caliente, restauración validada y reseteo de entorno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Exportar Copia de Seguridad</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Genera un volcado JSON íntegro con todas las tablas: estudiantes, docentes, asignaturas, matrículas, notas y auditoría.
                </p>
              </div>
              <button
                onClick={handleDownloadBackup}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Backup JSON</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Restaurar desde Respaldo</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Carga un archivo de respaldo previo con validación estricta de esquema y verificación de relaciones foráneas.
                </p>
              </div>
              <label className="w-full py-2 px-3 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Seleccionar Archivo JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Reiniciar a Datos Semilla</span>
                </div>
                <p className="text-xs text-rose-700 mt-1">
                  Restablece toda la base de datos a los valores predeterminados de la institución para nuevas demostraciones y pruebas.
                </p>
              </div>
              <button
                onClick={handleResetData}
                className="w-full py-2 px-3 text-xs font-semibold text-rose-800 bg-white hover:bg-rose-100 border border-rose-300 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restablecer Fábrica</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Código fuente de Spring Boot 3 para visualización
function getCodeContent(file: string): string {
  switch (file) {
    case 'cruce_docente':
      return `package edu.sga.academico.service.impl;

import edu.sga.academico.domain.entity.Docente;
import edu.sga.academico.domain.entity.FranjaHoraria;
import edu.sga.academico.domain.entity.Grupo;
import edu.sga.academico.exception.DocenteHorarioConflictException;
import edu.sga.academico.repository.DocenteRepository;
import edu.sga.academico.repository.GrupoRepository;
import edu.sga.academico.service.ValidacionCruceHorarioDocenteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

/**
 * REGLA DE NEGOCIO CRÍTICA (RF-06):
 * "No se puede registrar un docente en el mismo horario".
 * 
 * Implementación robusta en Spring Boot 3 con transaccionalidad de solo lectura.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ValidacionCruceHorarioDocenteServiceImpl implements ValidacionCruceHorarioDocenteService {

    private final GrupoRepository grupoRepository;
    private final DocenteRepository docenteRepository;

    @Override
    @Transactional(readOnly = true)
    public void validarDisponibilidadHorario(Long docenteId, Long periodoId, List<FranjaHoraria> horariosPropuestos, Long grupoExcluidoId) {
        Docente docente = docenteRepository.findById(docenteId)
                .orElseThrow(() -> new IllegalArgumentException("Docente no encontrado con ID: " + docenteId));

        if (!docente.isActivo()) {
            throw new IllegalStateException("El docente " + docente.getNombreCompleto() + " se encuentra inactivo.");
        }

        // Obtener todos los grupos ya asignados al docente en el periodo lectivo vigente
        List<Grupo> gruposAsignados = grupoRepository.findGruposActivosPorDocenteYPeriodo(docenteId, periodoId);

        for (FranjaHoraria nuevaFranja : horariosPropuestos) {
            for (Grupo grupoAsignado : gruposAsignados) {
                // Si estamos editando un grupo existente, ignoramos el mismo
                if (grupoExcluidoId != null && grupoAsignado.getId().equals(grupoExcluidoId)) {
                    continue;
                }

                for (FranjaHoraria franjaExistente : grupoAsignado.getHorarios()) {
                    if (nuevaFranja.getDiaSemana() == franjaExistente.getDiaSemana()) {
                        if (hayTraslape(nuevaFranja.getHoraInicio(), nuevaFranja.getHoraFin(),
                                        franjaExistente.getHoraInicio(), franjaExistente.getHoraFin())) {
                            
                            log.warn("CONFLICTO DETECTADO: Docente {} colisiona en {} entre {} y {}",
                                    docente.getNombreCompleto(), nuevaFranja.getDiaSemana(),
                                    franjaExistente.getHoraInicio(), franjaExistente.getHoraFin());

                            throw new DocenteHorarioConflictException(String.format(
                                    "Conflicto de Horario Docente: El docente %s ya tiene asignado el grupo %s el día %s de %s a %s en %s.",
                                    docente.getNombreCompleto(),
                                    grupoAsignado.getCodigo(),
                                    nuevaFranja.getDiaSemana(),
                                    franjaExistente.getHoraInicio(),
                                    franjaExistente.getHoraFin(),
                                    franjaExistente.getAula()
                            ));
                        }
                    }
                }
            }
        }
    }

    /**
     * Comprobación matemática de solapamiento de intervalos temporales semiabiertos [inicio, fin)
     */
    private boolean hayTraslape(LocalTime startA, LocalTime endA, LocalTime startB, LocalTime endB) {
        LocalTime maxInicio = startA.isAfter(startB) ? startA : startB;
        LocalTime minFin = endA.isBefore(endB) ? endA : endB;
        return maxInicio.isBefore(minFin);
    }
}`;

    case 'matricula_service':
      return `package edu.sga.academico.service.impl;

import edu.sga.academico.domain.entity.*;
import edu.sga.academico.domain.enums.EstadoMatricula;
import edu.sga.academico.exception.CupoAgotadoException;
import edu.sga.academico.exception.MatriculaDuplicadaException;
import edu.sga.academico.repository.*;
import edu.sga.academico.service.MatriculaTransactionalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * REGLA DE NEGOCIO (RF-07): "Permitir registrar asignaturas a estudiantes".
 * Garantiza consistencia estricta ACID mediante nivel de aislamiento SERIALIZABLE
 * y bloqueo optimista (@Version) para prevenir carreras en la adjudicación de cupos.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MatriculaTransactionalServiceImpl implements MatriculaTransactionalService {

    private final EstudianteRepository estudianteRepository;
    private final GrupoRepository grupoRepository;
    private final MatriculaRepository matriculaRepository;
    private final CalificacionRepository calificacionRepository;
    private final AuditoriaService auditoriaService;

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Matricula registrarMatricula(Long estudianteId, Long grupoId) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado"));

        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new IllegalArgumentException("Grupo académico no existe"));

        // 1. Validar duplicidad
        boolean yaInscrito = matriculaRepository.existsByEstudianteIdAndAsignaturaIdAndPeriodoId(
                estudiante.getId(), grupo.getAsignatura().getId(), grupo.getPeriodo().getId());
        if (yaInscrito) {
            throw new MatriculaDuplicadaException("El estudiante ya se encuentra matriculado en esta asignatura.");
        }

        // 2. Validar cupos en tiempo real
        if (grupo.getCuposOcupados() >= grupo.getCupoMaximo()) {
            throw new CupoAgotadoException("El grupo " + grupo.getCodigo() + " ha agotado sus cupos disponibles.");
        }

        // 3. Incrementar cupos (protegido por @Version en GrupoEntity)
        grupo.setCuposOcupados(grupo.getCuposOcupados() + 1);
        grupoRepository.save(grupo);

        // 4. Crear registro formal de matrícula
        Matricula matricula = Matricula.builder()
                .estudiante(estudiante)
                .grupo(grupo)
                .asignatura(grupo.getAsignatura())
                .periodo(grupo.getPeriodo())
                .fechaMatricula(LocalDateTime.now())
                .estado(EstadoMatricula.MATRICULADO)
                .build();
        matricula = matriculaRepository.save(matricula);

        // 5. Inicializar registro de calificaciones
        Calificacion cal = Calificacion.builder()
                .matricula(matricula)
                .estudiante(estudiante)
                .grupo(grupo)
                .estado("Cursando")
                .ultimaModificacion(LocalDateTime.now())
                .build();
        calificacionRepository.save(cal);

        // 6. Auditoría inmutable (RF-12)
        auditoriaService.registrarEvento("MATRICULA", "MATRICULA_EXITOSA", matricula.getId().toString(),
                "Estudiante " + estudiante.getCodigoEstudiante() + " matriculó " + grupo.getCodigo());

        return matricula;
    }
}`;

    case 'entidad_jpa':
      return `package edu.sga.academico.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA con mapeo ORM Hibernate y control de concurrencia optimista (@Version).
 */
@Entity
@Table(name = "grupos_academicos", uniqueConstraints = {
    @UniqueConstraint(name = "uk_grupo_codigo_periodo", columnNames = {"codigo", "periodo_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false, length = 30)
    private String codigo; // Ej: "SIS-302-G1"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asignatura_id", nullable = false)
    private Asignatura asignatura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "periodo_id", nullable = false)
    private PeriodoAcademico periodo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id")
    private Docente docente;

    @Column(name = "cupo_maximo", nullable = false)
    private Integer cupoMaximo;

    @Column(name = "cupos_ocupados", nullable = false)
    private Integer cuposOcupados;

    @OneToMany(mappedBy = "grupo", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FranjaHoraria> horarios = new ArrayList<>();

    @Column(nullable = false, length = 20)
    private String estado; // "Abierto", "Cerrado"

    /**
     * Control de bloqueo optimista para prevenir colisiones en solicitudes concurrentes (RNF-02 / RNF-07).
     */
    @Version
    private Long version;
}`;

    case 'controller_rest':
      return `package edu.sga.academico.controller;

import edu.sga.academico.dto.AsignarDocenteRequest;
import edu.sga.academico.dto.GrupoResponse;
import edu.sga.academico.service.GrupoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/grupos")
@RequiredArgsConstructor
@Tag(name = "Grupos Académicos", description = "Endpoints de gestión horaria y asignación docente")
public class DocenteRestController {

    private final GrupoService grupoService;

    @PostMapping("/{grupoId}/asignar-docente")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    @Operation(summary = "Asigna un docente a un grupo validando ausencia de cruces de horario")
    public ResponseEntity<GrupoResponse> asignarDocente(
            @PathVariable Long grupoId,
            @RequestBody @Valid AsignarDocenteRequest request) {

        GrupoResponse response = grupoService.asignarDocenteConValidacionHoraria(grupoId, request.getDocenteId());
        return ResponseEntity.ok(response);
    }
}`;

    case 'ddl_sql':
      return `-- ========================================================
-- SISTEMA DE GESTIÓN ACADÉMICA (SGA) - POSTGRESQL DDL
-- ========================================================

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(120) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    rol VARCHAR(30) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE periodos_academicos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) NOT NULL,
    es_vigente BOOLEAN DEFAULT FALSE
);

CREATE TABLE programas_academicos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    facultad VARCHAR(150) NOT NULL,
    total_creditos INT NOT NULL
);

CREATE TABLE asignaturas (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    programa_id BIGINT REFERENCES programas_academicos(id),
    creditos INT NOT NULL,
    semestre_nivel INT NOT NULL
);

CREATE TABLE grupos_academicos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL,
    asignatura_id BIGINT NOT NULL REFERENCES asignaturas(id),
    periodo_id BIGINT NOT NULL REFERENCES periodos_academicos(id),
    docente_id BIGINT,
    cupo_maximo INT NOT NULL,
    cupos_ocupados INT NOT NULL DEFAULT 0,
    version BIGINT DEFAULT 0,
    CONSTRAINT uk_grupo_periodo UNIQUE (codigo, periodo_id)
);

CREATE TABLE franjas_horarias (
    id BIGSERIAL PRIMARY KEY,
    grupo_id BIGINT NOT NULL REFERENCES grupos_academicos(id) ON DELETE CASCADE,
    dia_semana VARCHAR(15) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    aula VARCHAR(80) NOT NULL
);

CREATE TABLE matriculas (
    id BIGSERIAL PRIMARY KEY,
    estudiante_id BIGINT NOT NULL,
    grupo_id BIGINT NOT NULL REFERENCES grupos_academicos(id),
    periodo_id BIGINT NOT NULL REFERENCES periodos_academicos(id),
    fecha_matricula TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL,
    CONSTRAINT uk_matricula_estudiante_grupo UNIQUE (estudiante_id, grupo_id)
);

CREATE TABLE auditoria_sistema (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_id VARCHAR(50) NOT NULL,
    accion VARCHAR(60) NOT NULL,
    modulo VARCHAR(40) NOT NULL,
    entidad_afectada VARCHAR(60),
    detalle TEXT,
    estado_resultado VARCHAR(30) NOT NULL
);`;

    default:
      return '';
  }
}
