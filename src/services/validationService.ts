/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FranjaHoraria,
  Grupo,
  Docente,
  Estudiante,
  Matricula,
  Asignatura,
  ValidacionResultado
} from '../types/academic';

/**
 * Convierte un formato HH:mm a minutos desde las 00:00 para comparación aritmética precisa
 */
export function convertirHoraAMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Determina si dos intervalos de tiempo se solapan
 * Condición de cruce: max(inicioA, inicioB) < min(finA, finB)
 */
export function hayTraslapeHorario(
  inicioA: string,
  finA: string,
  inicioB: string,
  finB: string
): boolean {
  const startA = convertirHoraAMinutos(inicioA);
  const endA = convertirHoraAMinutos(finA);
  const startB = convertirHoraAMinutos(inicioB);
  const endB = convertirHoraAMinutos(finB);

  return Math.max(startA, startB) < Math.min(endA, endB);
}

/**
 * REGLA DE NEGOCIO CRÍTICA (Docente):
 * "Aplicar una regla a la asignación de asignaturas al docente para que no lo pueda registrar en el mismo horario"
 *
 * Valida que un docente no tenga otro grupo asignado en el mismo periodo con franja horaria coincidente.
 */
export function validarCruceHorarioDocente(
  docente: Docente,
  horariosPropuestos: FranjaHoraria[],
  periodoId: string,
  gruposExistentes: Grupo[],
  asignaturas: Asignatura[],
  excluirGrupoId?: string
): ValidacionResultado {
  if (!docente.activo) {
    return {
      esValido: false,
      codigoError: 'DOCENTE_INACTIVO',
      mensaje: `El docente ${docente.nombreCompleto} se encuentra inactivo en el sistema institucional.`
    };
  }

  // Filtrar grupos asignados a este docente en el mismo periodo (excluyendo el grupo actual si se está editando)
  const gruposDocente = gruposExistentes.filter(
    (g) => g.docenteId === docente.id && g.periodoId === periodoId && g.id !== excluirGrupoId
  );

  for (const franjaNueva of horariosPropuestos) {
    for (const grupoAsignado of gruposDocente) {
      for (const franjaExistente of grupoAsignado.horarios) {
        if (franjaNueva.dia === franjaExistente.dia) {
          if (
            hayTraslapeHorario(
              franjaNueva.horaInicio,
              franjaNueva.horaFin,
              franjaExistente.horaInicio,
              franjaExistente.horaFin
            )
          ) {
            const asignatura = asignaturas.find((a) => a.id === grupoAsignado.asignaturaId);
            const asigNombre = asignatura ? `${asignatura.codigo} - ${asignatura.nombre}` : grupoAsignado.codigo;

            return {
              esValido: false,
              codigoError: 'CRUCE_HORARIO_DOCENTE',
              mensaje: `Conflicto de Horario Docente: ${docente.nombreCompleto} ya tiene asignada la asignatura "${asigNombre}" (Grupo ${grupoAsignado.codigo}) el día ${franjaNueva.dia} de ${franjaExistente.horaInicio} a ${franjaExistente.horaFin} en ${franjaExistente.aula}. No es posible registrar dos asignaturas en el mismo horario.`,
              detalles: {
                dia: franjaNueva.dia,
                horaInicioConflicto: franjaExistente.horaInicio,
                horaFinConflicto: franjaExistente.horaFin,
                aulaConflicto: franjaExistente.aula,
                grupoConflictoCodigo: grupoAsignado.codigo,
                asignaturaConflicto: asigNombre
              }
            };
          }
        }
      }
    }
  }

  return {
    esValido: true,
    mensaje: `Horario validado satisfactoriamente. No existen colisiones de agenda para el docente ${docente.nombreCompleto}.`
  };
}

/**
 * REGLA DE NEGOCIO CRÍTICA (Estudiante):
 * "Permitir registrar las asignaturas a los estudiantes"
 *
 * Valida cupos disponibles, ausencia de matrículas previas de la misma materia y no colisión de horarios con materias ya inscritas.
 */
export function validarMatriculaEstudiante(
  estudiante: Estudiante,
  grupoSeleccionado: Grupo,
  asignatura: Asignatura,
  periodoId: string,
  matriculasExistentes: Matricula[],
  gruposExistentes: Grupo[],
  todasAsignaturas: Asignatura[]
): ValidacionResultado {
  if (!estudiante.activo) {
    return {
      esValido: false,
      codigoError: 'ESTUDIANTE_INACTIVO',
      mensaje: `El estudiante ${estudiante.nombreCompleto} se encuentra inactivo y no puede realizar matrícula académica.`
    };
  }

  if (estudiante.estadoAcademico === 'Inactivo') {
    return {
      esValido: false,
      codigoError: 'ESTADO_ACADEMICO_NO_HABILITADO',
      mensaje: `Estado académico (${estudiante.estadoAcademico}) no permite inscripción de asignaturas.`
    };
  }

  if (grupoSeleccionado.estado !== 'Abierto') {
    return {
      esValido: false,
      codigoError: 'GRUPO_CERRADO',
      mensaje: `El grupo ${grupoSeleccionado.codigo} se encuentra cerrado para inscripciones.`
    };
  }

  // Validación 1: Cupos disponibles
  if (grupoSeleccionado.cuposOcupados >= grupoSeleccionado.cupoMaximo) {
    return {
      esValido: false,
      codigoError: 'CUPOS_AGOTADOS',
      mensaje: `Cupos agotados: El grupo ${grupoSeleccionado.codigo} ha alcanzado su capacidad máxima (${grupoSeleccionado.cupoMaximo} estudiantes).`
    };
  }

  // Validación 2: Matrícula duplicada en la misma asignatura dentro del mismo periodo
  const matriculasEstudianteEnPeriodo = matriculasExistentes.filter(
    (m) => m.estudianteId === estudiante.id && m.periodoId === periodoId && m.estado === 'MATRICULADO'
  );

  const yaMatriculadoEnAsignatura = matriculasEstudianteEnPeriodo.some(
    (m) => m.asignaturaId === asignatura.id
  );

  if (yaMatriculadoEnAsignatura) {
    return {
      esValido: false,
      codigoError: 'MATRICULA_DUPLICADA',
      mensaje: `Matrícula duplicada: El estudiante ya se encuentra matriculado en la asignatura "${asignatura.codigo} - ${asignatura.nombre}" en este periodo académico.`
    };
  }

  // Validación 3: Cruce de horarios con otras asignaturas ya matriculadas por el estudiante
  const gruposInscritosIds = matriculasEstudianteEnPeriodo.map((m) => m.grupoId);
  const gruposInscritos = gruposExistentes.filter((g) => gruposInscritosIds.includes(g.id));

  for (const franjaNueva of grupoSeleccionado.horarios) {
    for (const grupoInscrito of gruposInscritos) {
      for (const franjaInscrita of grupoInscrito.horarios) {
        if (franjaNueva.dia === franjaInscrita.dia) {
          if (
            hayTraslapeHorario(
              franjaNueva.horaInicio,
              franjaNueva.horaFin,
              franjaInscrita.horaInicio,
              franjaInscrita.horaFin
            )
          ) {
            const asigInscrita = todasAsignaturas.find((a) => a.id === grupoInscrito.asignaturaId);
            const nombreMateria = asigInscrita ? asigInscrita.nombre : grupoInscrito.codigo;

            return {
              esValido: false,
              codigoError: 'CRUCE_HORARIO_ESTUDIANTE',
              mensaje: `Cruce de Horario Académico: El horario del grupo ${grupoSeleccionado.codigo} (${franjaNueva.dia} ${franjaNueva.horaInicio} - ${franjaNueva.horaFin}) se cruza con su asignatura ya matriculada "${nombreMateria}" (${grupoInscrito.codigo}) programada el ${franjaInscrita.dia} de ${franjaInscrita.horaInicio} a ${franjaInscrita.horaFin}.`,
              detalles: {
                dia: franjaNueva.dia,
                horaInicio: franjaInscrita.horaInicio,
                horaFin: franjaInscrita.horaFin,
                materiaCruzada: nombreMateria,
                grupoCruzado: grupoInscrito.codigo
              }
            };
          }
        }
      }
    }
  }

  return {
    esValido: true,
    mensaje: `Matrícula autorizada: Verificación de cupos y disponibilidad horaria completada exitosamente.`
  };
}

/**
 * Cálculo ponderado institucional de calificaciones:
 * Corte 1: 30%
 * Corte 2: 30%
 * Examen Final: 40%
 * Escala 0.0 a 5.0. Aprobación >= 3.0
 */
export function calcularNotaDefinitiva(
  corte1: number | null,
  corte2: number | null,
  examenFinal: number | null
): { definitiva: number | null; estado: 'Cursando' | 'Aprobado' | 'Reprobado' } {
  if (corte1 === null || corte2 === null || examenFinal === null) {
    return {
      definitiva: null,
      estado: 'Cursando'
    };
  }

  const raw = corte1 * 0.3 + corte2 * 0.3 + examenFinal * 0.4;
  const definitiva = Math.round(raw * 10) / 10;
  const estado = definitiva >= 3.0 ? 'Aprobado' : 'Reprobado';

  return { definitiva, estado };
}
