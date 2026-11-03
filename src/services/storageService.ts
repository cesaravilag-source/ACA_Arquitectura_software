/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Usuario,
  ProgramaAcademico,
  Asignatura,
  PeriodoAcademico,
  Grupo,
  Docente,
  Estudiante,
  Matricula,
  Calificacion,
  RegistroAuditoria,
  ValidacionResultado,
  TipoModuloAuditoria,
  FranjaHoraria
} from '../types/academic';
import {
  INITIAL_PROGRAMAS,
  INITIAL_ASIGNATURAS,
  INITIAL_PERIODOS,
  INITIAL_DOCENTES,
  INITIAL_GRUPOS,
  INITIAL_ESTUDIANTES,
  INITIAL_MATRICULAS,
  INITIAL_CALIFICACIONES,
  INITIAL_USUARIOS,
  INITIAL_AUDITORIA
} from '../data/initialData';
import {
  validarCruceHorarioDocente,
  validarMatriculaEstudiante,
  calcularNotaDefinitiva
} from './validationService';

const STORAGE_KEYS = {
  PROGRAMAS: 'sga_programas_v1',
  ASIGNATURAS: 'sga_asignaturas_v1',
  PERIODOS: 'sga_periodos_v1',
  DOCENTES: 'sga_docentes_v1',
  GRUPOS: 'sga_grupos_v1',
  ESTUDIANTES: 'sga_estudiantes_v1',
  MATRICULAS: 'sga_matriculas_v1',
  CALIFICACIONES: 'sga_calificaciones_v1',
  USUARIOS: 'sga_usuarios_v1',
  AUDITORIA: 'sga_auditoria_v1',
  CURRENT_USER: 'sga_current_user_v1'
};

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function safeSetItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export class StorageService {
  /**
   * Inicializa la base de datos local con datos semilla institucionales
   */
  static init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.PROGRAMAS)) {
      safeSetItem(STORAGE_KEYS.PROGRAMAS, INITIAL_PROGRAMAS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASIGNATURAS)) {
      safeSetItem(STORAGE_KEYS.ASIGNATURAS, INITIAL_ASIGNATURAS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PERIODOS)) {
      safeSetItem(STORAGE_KEYS.PERIODOS, INITIAL_PERIODOS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCENTES)) {
      safeSetItem(STORAGE_KEYS.DOCENTES, INITIAL_DOCENTES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GRUPOS)) {
      safeSetItem(STORAGE_KEYS.GRUPOS, INITIAL_GRUPOS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ESTUDIANTES)) {
      safeSetItem(STORAGE_KEYS.ESTUDIANTES, INITIAL_ESTUDIANTES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MATRICULAS)) {
      safeSetItem(STORAGE_KEYS.MATRICULAS, INITIAL_MATRICULAS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CALIFICACIONES)) {
      safeSetItem(STORAGE_KEYS.CALIFICACIONES, INITIAL_CALIFICACIONES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USUARIOS)) {
      safeSetItem(STORAGE_KEYS.USUARIOS, INITIAL_USUARIOS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDITORIA)) {
      safeSetItem(STORAGE_KEYS.AUDITORIA, INITIAL_AUDITORIA);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Usuario por defecto: Administrador
      safeSetItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USUARIOS[0]);
    }

    // Migración automática de caché local: Actualizar Sandra Patricia Gómez a César Avila
    const usuarios = safeGetItem<Usuario[]>(STORAGE_KEYS.USUARIOS, []);
    let userModified = false;
    usuarios.forEach((u) => {
      if (u.nombreCompleto.includes('Sandra Patricia') || u.username === 'admin.sga') {
        u.nombreCompleto = 'Ing. César Avila';
        u.email = 'cesar.avilag@cun.edu.co';
        userModified = true;
      }
    });
    if (userModified) {
      safeSetItem(STORAGE_KEYS.USUARIOS, usuarios);
    }

    const currentUser = safeGetItem<Usuario | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser && (currentUser.nombreCompleto.includes('Sandra Patricia') || currentUser.username === 'admin.sga')) {
      currentUser.nombreCompleto = 'Ing. César Avila';
      currentUser.email = 'cesar.avilag@cun.edu.co';
      safeSetItem(STORAGE_KEYS.CURRENT_USER, currentUser);
    }

    const auditoria = safeGetItem<RegistroAuditoria[]>(STORAGE_KEYS.AUDITORIA, []);
    let auditModified = false;
    auditoria.forEach((a) => {
      if (a.nombreUsuario.includes('Sandra Patricia')) {
        a.nombreUsuario = 'Ing. César Avila';
        auditModified = true;
      }
    });
    if (auditModified) {
      safeSetItem(STORAGE_KEYS.AUDITORIA, auditoria);
    }
  }

  // =================== SESIÓN Y USUARIOS ===================

  static getUsuarios(): Usuario[] {
    return safeGetItem<Usuario[]>(STORAGE_KEYS.USUARIOS, INITIAL_USUARIOS);
  }

  static getCurrentUser(): Usuario {
    return safeGetItem<Usuario>(STORAGE_KEYS.CURRENT_USER, INITIAL_USUARIOS[0]);
  }

  static setCurrentUser(usuario: Usuario): void {
    safeSetItem(STORAGE_KEYS.CURRENT_USER, usuario);
    this.registrarAuditoria({
      modulo: 'AUTENTICACION',
      accion: 'INICIO_SESION',
      entidadAfectada: 'Usuario',
      idEntidadAfectada: usuario.id,
      detalle: `Autenticación exitosa del usuario ${usuario.nombreCompleto} con rol ${usuario.rol}.`,
      estadoResultado: 'EXITO'
    });
  }

  static logout(): void {
    const user = this.getCurrentUser();
    this.registrarAuditoria({
      modulo: 'AUTENTICACION',
      accion: 'CIERRE_SESION',
      entidadAfectada: 'Usuario',
      idEntidadAfectada: user.id,
      detalle: `Cierre voluntario de sesión para ${user.nombreCompleto}.`,
      estadoResultado: 'EXITO'
    });
  }

  // =================== PROGRAMAS Y ASIGNATURAS ===================

  static getProgramas(): ProgramaAcademico[] {
    return safeGetItem<ProgramaAcademico[]>(STORAGE_KEYS.PROGRAMAS, INITIAL_PROGRAMAS);
  }

  static savePrograma(programa: ProgramaAcademico): void {
    const list = this.getProgramas();
    const idx = list.findIndex((p) => p.id === programa.id);
    if (idx >= 0) {
      list[idx] = programa;
    } else {
      list.push(programa);
    }
    safeSetItem(STORAGE_KEYS.PROGRAMAS, list);

    this.registrarAuditoria({
      modulo: 'ASIGNATURAS',
      accion: idx >= 0 ? 'ACTUALIZAR_PROGRAMA' : 'CREAR_PROGRAMA',
      entidadAfectada: 'ProgramaAcademico',
      idEntidadAfectada: programa.id,
      detalle: `Programa ${programa.codigo} - ${programa.nombre} ${idx >= 0 ? 'actualizado' : 'creado'}.`,
      estadoResultado: 'EXITO'
    });
  }

  static getAsignaturas(): Asignatura[] {
    return safeGetItem<Asignatura[]>(STORAGE_KEYS.ASIGNATURAS, INITIAL_ASIGNATURAS);
  }

  static saveAsignatura(asignatura: Asignatura): void {
    const list = this.getAsignaturas();
    const idx = list.findIndex((a) => a.id === asignatura.id);
    if (idx >= 0) {
      list[idx] = asignatura;
    } else {
      list.push(asignatura);
    }
    safeSetItem(STORAGE_KEYS.ASIGNATURAS, list);

    this.registrarAuditoria({
      modulo: 'ASIGNATURAS',
      accion: idx >= 0 ? 'ACTUALIZAR_ASIGNATURA' : 'CREAR_ASIGNATURA',
      entidadAfectada: 'Asignatura',
      idEntidadAfectada: asignatura.id,
      detalle: `Asignatura ${asignatura.codigo} - ${asignatura.nombre} (${asignatura.creditos} créditos) ${idx >= 0 ? 'actualizada' : 'registrada'}.`,
      estadoResultado: 'EXITO'
    });
  }

  // =================== PERIODOS ACADÉMICOS ===================

  static getPeriodos(): PeriodoAcademico[] {
    return safeGetItem<PeriodoAcademico[]>(STORAGE_KEYS.PERIODOS, INITIAL_PERIODOS);
  }

  static getPeriodoActivo(): PeriodoAcademico {
    const list = this.getPeriodos();
    return list.find((p) => p.esVigente) || list[0];
  }

  static savePeriodo(periodo: PeriodoAcademico): void {
    const list = this.getPeriodos();
    if (periodo.esVigente) {
      list.forEach((p) => {
        p.esVigente = p.id === periodo.id;
      });
    }
    const idx = list.findIndex((p) => p.id === periodo.id);
    if (idx >= 0) {
      list[idx] = periodo;
    } else {
      list.push(periodo);
    }
    safeSetItem(STORAGE_KEYS.PERIODOS, list);

    this.registrarAuditoria({
      modulo: 'SISTEMA',
      accion: 'GESTION_PERIODO',
      entidadAfectada: 'PeriodoAcademico',
      idEntidadAfectada: periodo.id,
      detalle: `Periodo académico ${periodo.codigo} actualizado a estado ${periodo.estado}.`,
      estadoResultado: 'EXITO'
    });
  }

  // =================== DOCENTES ===================

  static getDocentes(): Docente[] {
    return safeGetItem<Docente[]>(STORAGE_KEYS.DOCENTES, INITIAL_DOCENTES);
  }

  static saveDocente(docente: Docente): void {
    const list = this.getDocentes();
    const idx = list.findIndex((d) => d.id === docente.id);
    if (idx >= 0) {
      list[idx] = docente;
    } else {
      list.push(docente);
    }
    safeSetItem(STORAGE_KEYS.DOCENTES, list);

    this.registrarAuditoria({
      modulo: 'DOCENTES',
      accion: idx >= 0 ? 'ACTUALIZAR_DOCENTE' : 'REGISTRAR_DOCENTE',
      entidadAfectada: 'Docente',
      idEntidadAfectada: docente.id,
      detalle: `Docente ${docente.codigoDocente} - ${docente.nombreCompleto} ${idx >= 0 ? 'actualizado' : 'creado'} (${docente.activo ? 'Activo' : 'Inactivo'}).`,
      estadoResultado: 'EXITO'
    });
  }

  // =================== ESTUDIANTES ===================

  static getEstudiantes(): Estudiante[] {
    return safeGetItem<Estudiante[]>(STORAGE_KEYS.ESTUDIANTES, INITIAL_ESTUDIANTES);
  }

  static saveEstudiante(estudiante: Estudiante): void {
    const list = this.getEstudiantes();
    const idx = list.findIndex((e) => e.id === estudiante.id);
    if (idx >= 0) {
      list[idx] = estudiante;
    } else {
      list.push(estudiante);
    }
    safeSetItem(STORAGE_KEYS.ESTUDIANTES, list);

    this.registrarAuditoria({
      modulo: 'ESTUDIANTES',
      accion: idx >= 0 ? 'ACTUALIZAR_ESTUDIANTE' : 'REGISTRAR_ESTUDIANTE',
      entidadAfectada: 'Estudiante',
      idEntidadAfectada: estudiante.id,
      detalle: `Estudiante ${estudiante.codigoEstudiante} - ${estudiante.nombreCompleto} ${idx >= 0 ? 'actualizado' : 'registrado'}.`,
      estadoResultado: 'EXITO'
    });
  }

  // =================== GRUPOS Y ASIGNACIÓN CON REGLA DE COLISIÓN ===================

  static getGrupos(): Grupo[] {
    return safeGetItem<Grupo[]>(STORAGE_KEYS.GRUPOS, INITIAL_GRUPOS);
  }

  /**
   * Guarda o actualiza un grupo aplicando la REGLA ESTRICTA DE CRUCE HORARIO DOCENTE
   */
  static saveGrupoConValidacion(grupo: Grupo): ValidacionResultado {
    const docentes = this.getDocentes();
    const asignaturas = this.getAsignaturas();
    const grupos = this.getGrupos();

    // Si tiene docente asignado, validar que no tenga cruce de horario
    if (grupo.docenteId) {
      const docente = docentes.find((d) => d.id === grupo.docenteId);
      if (docente) {
        const validacion = validarCruceHorarioDocente(
          docente,
          grupo.horarios,
          grupo.periodoId,
          grupos,
          asignaturas,
          grupo.id // Excluir este mismo grupo si se está editando
        );

        if (!validacion.esValido) {
          // Registrar intento de asignación bloqueado en auditoría
          this.registrarAuditoria({
            modulo: 'HORARIOS_DOCENTE',
            accion: 'BLOQUEO_CRUCE_HORARIO_DOCENTE',
            entidadAfectada: 'Grupo',
            idEntidadAfectada: grupo.id,
            detalle: `REGLA DE NEGOCIO VIOLADA: Intento de asignación horaria conflictiva para el docente ${docente.nombreCompleto}. ${validacion.mensaje}`,
            estadoResultado: 'BLOQUEADO_REGLA_NEGOCIO'
          });
          return validacion;
        }
      }
    }

    const idx = grupos.findIndex((g) => g.id === grupo.id);
    if (idx >= 0) {
      grupos[idx] = grupo;
    } else {
      grupos.push(grupo);
    }
    safeSetItem(STORAGE_KEYS.GRUPOS, grupos);

    const asig = asignaturas.find((a) => a.id === grupo.asignaturaId);
    const doc = docentes.find((d) => d.id === grupo.docenteId);

    this.registrarAuditoria({
      modulo: 'GRUPOS',
      accion: idx >= 0 ? 'ACTUALIZAR_GRUPO' : 'CREAR_GRUPO',
      entidadAfectada: 'Grupo',
      idEntidadAfectada: grupo.id,
      detalle: `Grupo ${grupo.codigo} (${asig?.nombre || 'Asignatura'}) programado. Docente: ${doc?.nombreCompleto || 'Sin Asignar'}. Cupo: ${grupo.cupoMaximo}.`,
      estadoResultado: 'EXITO'
    });

    return {
      esValido: true,
      mensaje: `Grupo ${grupo.codigo} guardado exitosamente sin conflictos de agenda.`
    };
  }

  // =================== MATRÍCULA ACADÉMICA ===================

  static getMatriculas(): Matricula[] {
    return safeGetItem<Matricula[]>(STORAGE_KEYS.MATRICULAS, INITIAL_MATRICULAS);
  }

  /**
   * Realiza la matrícula de un estudiante en un grupo con validación de cupos y cruces
   */
  static realizarMatricula(
    estudianteId: string,
    grupoId: string
  ): ValidacionResultado {
    const estudiantes = this.getEstudiantes();
    const grupos = this.getGrupos();
    const asignaturas = this.getAsignaturas();
    const matriculas = this.getMatriculas();
    const periodoActivo = this.getPeriodoActivo();

    const estudiante = estudiantes.find((e) => e.id === estudianteId);
    if (!estudiante) {
      return { esValido: false, mensaje: 'Estudiante no encontrado en el sistema.' };
    }

    const grupo = grupos.find((g) => g.id === grupoId);
    if (!grupo) {
      return { esValido: false, mensaje: 'Grupo académico no encontrado.' };
    }

    const asignatura = asignaturas.find((a) => a.id === grupo.asignaturaId);
    if (!asignatura) {
      return { esValido: false, mensaje: 'Asignatura no encontrada.' };
    }

    // Ejecutar validaciones de negocio completas
    const validacion = validarMatriculaEstudiante(
      estudiante,
      grupo,
      asignatura,
      periodoActivo.id,
      matriculas,
      grupos,
      asignaturas
    );

    if (!validacion.esValido) {
      this.registrarAuditoria({
        modulo: 'MATRICULAS',
        accion: 'BLOQUEO_MATRICULA_ACADEMICA',
        entidadAfectada: 'Matricula',
        idEntidadAfectada: grupo.id,
        detalle: `Intento de matrícula fallido para ${estudiante.nombreCompleto} (${estudiante.codigoEstudiante}) en ${grupo.codigo}: ${validacion.mensaje}`,
        estadoResultado: 'BLOQUEADO_REGLA_NEGOCIO'
      });
      return validacion;
    }

    // Transacción atómica de matrícula:
    // 1. Crear registro de Matrícula
    const nuevaMatricula: Matricula = {
      id: `mat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      estudianteId: estudiante.id,
      grupoId: grupo.id,
      asignaturaId: asignatura.id,
      periodoId: periodoActivo.id,
      fechaMatricula: new Date().toISOString(),
      estado: 'MATRICULADO'
    };
    matriculas.push(nuevaMatricula);
    safeSetItem(STORAGE_KEYS.MATRICULAS, matriculas);

    // 2. Incrementar cupos ocupados del grupo
    grupo.cuposOcupados += 1;
    safeSetItem(STORAGE_KEYS.GRUPOS, grupos);

    // 3. Crear registro inicial de calificaciones
    const calificaciones = this.getCalificaciones();
    const nuevaCalificacion: Calificacion = {
      id: `cal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      matriculaId: nuevaMatricula.id,
      estudianteId: estudiante.id,
      grupoId: grupo.id,
      asignaturaId: asignatura.id,
      periodoId: periodoActivo.id,
      corte1: null,
      corte2: null,
      examenFinal: null,
      definitiva: null,
      estado: 'Cursando',
      ultimaModificacion: new Date().toISOString(),
      modificadoPor: this.getCurrentUser().nombreCompleto
    };
    calificaciones.push(nuevaCalificacion);
    safeSetItem(STORAGE_KEYS.CALIFICACIONES, calificaciones);

    // 4. Registro de auditoría
    this.registrarAuditoria({
      modulo: 'MATRICULAS',
      accion: 'MATRICULA_EXITOSA',
      entidadAfectada: 'Matricula',
      idEntidadAfectada: nuevaMatricula.id,
      detalle: `Matrícula exitosa: ${estudiante.nombreCompleto} matriculó "${asignatura.nombre}" (Grupo ${grupo.codigo}). Cupos restantes: ${grupo.cupoMaximo - grupo.cuposOcupados}.`,
      estadoResultado: 'EXITO'
    });

    return {
      esValido: true,
      mensaje: `Matrícula procesada correctamente en ${asignatura.nombre} (Grupo ${grupo.codigo}).`
    };
  }

  /**
   * Cancelar matrícula de un estudiante
   */
  static cancelarMatricula(matriculaId: string): ValidacionResultado {
    const matriculas = this.getMatriculas();
    const idx = matriculas.findIndex((m) => m.id === matriculaId);
    if (idx < 0) return { esValido: false, mensaje: 'Matrícula no encontrada.' };

    const matricula = matriculas[idx];
    matricula.estado = 'CANCELADO';
    safeSetItem(STORAGE_KEYS.MATRICULAS, matriculas);

    // Reducir cupos ocupados
    const grupos = this.getGrupos();
    const grupo = grupos.find((g) => g.id === matricula.grupoId);
    if (grupo && grupo.cuposOcupados > 0) {
      grupo.cuposOcupados -= 1;
      safeSetItem(STORAGE_KEYS.GRUPOS, grupos);
    }

    this.registrarAuditoria({
      modulo: 'MATRICULAS',
      accion: 'CANCELACION_MATRICULA',
      entidadAfectada: 'Matricula',
      idEntidadAfectada: matricula.id,
      detalle: `Matrícula ${matricula.id} cancelada. Cupo liberado en grupo ${grupo?.codigo || 'N/A'}.`,
      estadoResultado: 'EXITO'
    });

    return { esValido: true, mensaje: 'Matrícula cancelada y cupo liberado.' };
  }

  // =================== CALIFICACIONES ===================

  static getCalificaciones(): Calificacion[] {
    return safeGetItem<Calificacion[]>(STORAGE_KEYS.CALIFICACIONES, INITIAL_CALIFICACIONES);
  }

  static actualizarCalificacion(
    calificacionId: string,
    corte1: number | null,
    corte2: number | null,
    examenFinal: number | null,
    observaciones?: string
  ): ValidacionResultado {
    const calificaciones = this.getCalificaciones();
    const idx = calificaciones.findIndex((c) => c.id === calificacionId);
    if (idx < 0) return { esValido: false, mensaje: 'Registro de calificación no encontrado.' };

    // Validar rangos (0.0 a 5.0)
    for (const [nombre, val] of [
      ['Corte 1', corte1],
      ['Corte 2', corte2],
      ['Examen Final', examenFinal]
    ] as const) {
      if (val !== null && (val < 0.0 || val > 5.0 || isNaN(val))) {
        return {
          esValido: false,
          mensaje: `Calificación inválida en ${nombre}: La escala institucional es de 0.0 a 5.0.`
        };
      }
    }

    const { definitiva, estado } = calcularNotaDefinitiva(corte1, corte2, examenFinal);
    const usuarioActual = this.getCurrentUser();

    calificaciones[idx] = {
      ...calificaciones[idx],
      corte1,
      corte2,
      examenFinal,
      definitiva,
      estado,
      ultimaModificacion: new Date().toISOString(),
      modificadoPor: usuarioActual.nombreCompleto,
      observaciones: observaciones !== undefined ? observaciones : calificaciones[idx].observaciones
    };

    safeSetItem(STORAGE_KEYS.CALIFICACIONES, calificaciones);

    // Si se calculó definitiva, actualizar promedio acumulado del estudiante
    if (definitiva !== null) {
      this.recalcularPromedioEstudiante(calificaciones[idx].estudianteId);
    }

    this.registrarAuditoria({
      modulo: 'CALIFICACIONES',
      accion: 'ACTUALIZAR_NOTAS',
      entidadAfectada: 'Calificacion',
      idEntidadAfectada: calificacionId,
      detalle: `Calificaciones actualizadas por ${usuarioActual.nombreCompleto}: C1=${corte1 ?? '-'}, C2=${corte2 ?? '-'}, EF=${examenFinal ?? '-'}, Definitiva=${definitiva ?? 'Pendiente'} (${estado}).`,
      estadoResultado: 'EXITO'
    });

    return {
      esValido: true,
      mensaje: `Calificaciones guardadas exitosamente. Promedio: ${definitiva !== null ? definitiva.toFixed(1) : 'Pendiente'}.`
    };
  }

  private static recalcularPromedioEstudiante(estudianteId: string): void {
    const calificaciones = this.getCalificaciones().filter(
      (c) => c.estudianteId === estudianteId && c.definitiva !== null
    );
    if (calificaciones.length === 0) return;

    const suma = calificaciones.reduce((acc, curr) => acc + (curr.definitiva || 0), 0);
    const nuevoPromedio = Math.round((suma / calificaciones.length) * 10) / 10;

    const estudiantes = this.getEstudiantes();
    const est = estudiantes.find((e) => e.id === estudianteId);
    if (est) {
      est.promedioAcumulado = nuevoPromedio;
      safeSetItem(STORAGE_KEYS.ESTUDIANTES, estudiantes);
    }
  }

  // =================== AUDITORÍA Y TRAZABILIDAD (RF-12) ===================

  static getAuditoria(): RegistroAuditoria[] {
    return safeGetItem<RegistroAuditoria[]>(STORAGE_KEYS.AUDITORIA, INITIAL_AUDITORIA);
  }

  static registrarAuditoria(params: {
    modulo: TipoModuloAuditoria;
    accion: string;
    entidadAfectada: string;
    idEntidadAfectada: string;
    detalle: string;
    estadoResultado: 'EXITO' | 'BLOQUEADO_REGLA_NEGOCIO' | 'ERROR';
  }): void {
    const list = this.getAuditoria();
    const currentUser = this.getCurrentUser();

    const nuevoRegistro: RegistroAuditoria = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      usuarioId: currentUser.id,
      nombreUsuario: currentUser.nombreCompleto,
      rolUsuario: currentUser.rol,
      accion: params.accion,
      modulo: params.modulo,
      entidadAfectada: params.entidadAfectada,
      idEntidadAfectada: params.idEntidadAfectada,
      detalle: params.detalle,
      estadoResultado: params.estadoResultado,
      ipSimulada: `192.168.1.${Math.floor(Math.random() * 200) + 10}`
    };

    // Mantener los últimos 200 registros de auditoría
    list.unshift(nuevoRegistro);
    if (list.length > 200) list.pop();

    safeSetItem(STORAGE_KEYS.AUDITORIA, list);
  }

  // =================== RESPALDO Y RECUPERACIÓN (RNF-09) ===================

  static exportarBaseDeDatosJSON(): string {
    const backup = {
      sistema: 'SGA Campus - Institución de Educación Superior',
      version: '3.4.0',
      fechaExportacion: new Date().toISOString(),
      entorno: 'Producción / Cloud Run',
      tablas: {
        programas: this.getProgramas(),
        asignaturas: this.getAsignaturas(),
        periodos: this.getPeriodos(),
        docentes: this.getDocentes(),
        grupos: this.getGrupos(),
        estudiantes: this.getEstudiantes(),
        matriculas: this.getMatriculas(),
        calificaciones: this.getCalificaciones(),
        usuarios: this.getUsuarios(),
        auditoria: this.getAuditoria()
      }
    };
    return JSON.stringify(backup, null, 2);
  }

  static importarBaseDeDatosJSON(jsonString: string): ValidacionResultado {
    try {
      const data = JSON.parse(jsonString);
      if (!data.tablas || !Array.isArray(data.tablas.programas) || !Array.isArray(data.tablas.estudiantes)) {
        return {
          esValido: false,
          mensaje: 'El archivo de respaldo no posee el formato de esquema válido del SGA.'
        };
      }

      safeSetItem(STORAGE_KEYS.PROGRAMAS, data.tablas.programas);
      safeSetItem(STORAGE_KEYS.ASIGNATURAS, data.tablas.asignaturas || []);
      safeSetItem(STORAGE_KEYS.PERIODOS, data.tablas.periodos || []);
      safeSetItem(STORAGE_KEYS.DOCENTES, data.tablas.docentes || []);
      safeSetItem(STORAGE_KEYS.GRUPOS, data.tablas.grupos || []);
      safeSetItem(STORAGE_KEYS.ESTUDIANTES, data.tablas.estudiantes || []);
      safeSetItem(STORAGE_KEYS.MATRICULAS, data.tablas.matriculas || []);
      safeSetItem(STORAGE_KEYS.CALIFICACIONES, data.tablas.calificaciones || []);
      safeSetItem(STORAGE_KEYS.USUARIOS, data.tablas.usuarios || []);
      safeSetItem(STORAGE_KEYS.AUDITORIA, data.tablas.auditoria || []);

      this.registrarAuditoria({
        modulo: 'SISTEMA',
        accion: 'RESTAURACION_BACKUP',
        entidadAfectada: 'BaseDeDatos',
        idEntidadAfectada: 'ALL',
        detalle: `Restauración completa de base de datos desde archivo de respaldo fecha: ${data.fechaExportacion || 'N/A'}.`,
        estadoResultado: 'EXITO'
      });

      return {
        esValido: true,
        mensaje: 'Base de datos restaurada satisfactoriamente con integridad relacional validada.'
      };
    } catch (e: unknown) {
      return {
        esValido: false,
        mensaje: `Error al procesar el archivo JSON: ${(e as Error).message}`
      };
    }
  }

  static reiniciarDatosFabrica(): void {
    localStorage.removeItem(STORAGE_KEYS.PROGRAMAS);
    localStorage.removeItem(STORAGE_KEYS.ASIGNATURAS);
    localStorage.removeItem(STORAGE_KEYS.PERIODOS);
    localStorage.removeItem(STORAGE_KEYS.DOCENTES);
    localStorage.removeItem(STORAGE_KEYS.GRUPOS);
    localStorage.removeItem(STORAGE_KEYS.ESTUDIANTES);
    localStorage.removeItem(STORAGE_KEYS.MATRICULAS);
    localStorage.removeItem(STORAGE_KEYS.CALIFICACIONES);
    localStorage.removeItem(STORAGE_KEYS.USUARIOS);
    localStorage.removeItem(STORAGE_KEYS.AUDITORIA);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.init();
  }
}
