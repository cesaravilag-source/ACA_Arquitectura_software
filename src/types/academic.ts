/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Rol = 'ADMIN' | 'COORDINADOR' | 'DOCENTE' | 'ESTUDIANTE';

export interface Usuario {
  id: string;
  username: string;
  nombreCompleto: string;
  email: string;
  rol: Rol;
  documentoIdentidad: string;
  telefono: string;
  activo: boolean;
  avatarUrl?: string;
  fechaCreacion: string;
  referenciaId?: string; // ID del estudiante o docente vinculado
}

export interface ProgramaAcademico {
  id: string;
  codigo: string; // ej: 'ING-SIS'
  nombre: string;
  facultad: string;
  nivelAcademico: 'Pregrado' | 'Posgrado' | 'Tecnología';
  totalCreditos: number;
  duracionSemestres: number;
  estado: 'Activo' | 'Inactivo';
  descripcion: string;
}

export interface Asignatura {
  id: string;
  codigo: string; // ej: 'SIS-101'
  nombre: string;
  programaId: string;
  creditos: number;
  semestreNivel: number;
  horasSemanales: number;
  prerrequisitos: string[]; // códigos de asignaturas
  descripcion: string;
  estado: 'Activa' | 'Inactiva';
}

export type PeriodoEstado = 'PLANIFICACION' | 'ACTIVO' | 'CERRADO';

export interface PeriodoAcademico {
  id: string;
  codigo: string; // ej: '2026-I'
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: PeriodoEstado;
  esVigente: boolean;
}

export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

export interface FranjaHoraria {
  id: string;
  dia: DiaSemana;
  horaInicio: string; // Formato HH:mm (e.g. '07:00', '18:00')
  horaFin: string;    // Formato HH:mm (e.g. '09:00', '20:00')
  aula: string;       // ej: 'Edificio B - Aula 204' o 'Laboratorio Redes 3'
  modalidad: 'Presencial' | 'Virtual' | 'Híbrida';
}

export interface Grupo {
  id: string;
  codigo: string; // ej: 'SIS-101-G1'
  asignaturaId: string;
  periodoId: string;
  docenteId: string | null;
  cupoMaximo: number;
  cuposOcupados: number;
  horarios: FranjaHoraria[];
  estado: 'Abierto' | 'Cerrado';
  observaciones?: string;
}

export interface Docente {
  id: string;
  usuarioId: string;
  codigoDocente: string;
  nombreCompleto: string;
  documentoIdentidad: string;
  email: string;
  telefono: string;
  tituloAcademico: string;
  especialidad: string;
  departamento: string;
  dedicacion: 'Tiempo Completo' | 'Medio Tiempo' | 'Cátedra';
  activo: boolean;
  maxHorasSemanales: number;
}

export interface Estudiante {
  id: string;
  usuarioId: string;
  codigoEstudiante: string;
  nombreCompleto: string;
  documentoIdentidad: string;
  email: string;
  telefono: string;
  programaId: string;
  semestreActual: number;
  promedioAcumulado: number;
  creditosAprobados: number;
  estadoAcademico: 'Regular' | 'Prueba Académica' | 'Graduado' | 'Inactivo';
  activo: boolean;
}

export type MatriculaEstado = 'MATRICULADO' | 'CANCELADO' | 'COMPLETADO';

export interface Matricula {
  id: string;
  estudianteId: string;
  grupoId: string;
  asignaturaId: string;
  periodoId: string;
  fechaMatricula: string;
  estado: MatriculaEstado;
}

export interface Calificacion {
  id: string;
  matriculaId: string;
  estudianteId: string;
  grupoId: string;
  asignaturaId: string;
  periodoId: string;
  corte1: number | null; // 30% (0.0 a 5.0)
  corte2: number | null; // 30% (0.0 a 5.0)
  examenFinal: number | null; // 40% (0.0 a 5.0)
  definitiva: number | null; // Calculada automáticamente
  estado: 'Cursando' | 'Aprobado' | 'Reprobado';
  ultimaModificacion: string;
  modificadoPor: string;
  observaciones?: string;
}

export type TipoModuloAuditoria = 
  | 'AUTENTICACION'
  | 'ESTUDIANTES'
  | 'DOCENTES'
  | 'ASIGNATURAS'
  | 'GRUPOS'
  | 'HORARIOS_DOCENTE'
  | 'MATRICULAS'
  | 'CALIFICACIONES'
  | 'REPORTES'
  | 'SISTEMA';

export interface RegistroAuditoria {
  id: string;
  timestamp: string;
  usuarioId: string;
  nombreUsuario: string;
  rolUsuario: Rol;
  accion: string;
  modulo: TipoModuloAuditoria;
  entidadAfectada: string;
  idEntidadAfectada: string;
  detalle: string;
  estadoResultado: 'EXITO' | 'BLOQUEADO_REGLA_NEGOCIO' | 'ERROR';
  ipSimulada: string;
}

export interface ValidacionResultado {
  esValido: boolean;
  mensaje: string;
  codigoError?: string;
  detalles?: Record<string, unknown>;
}
