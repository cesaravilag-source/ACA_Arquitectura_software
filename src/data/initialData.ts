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
  RegistroAuditoria
} from '../types/academic';

export const INITIAL_PROGRAMAS: ProgramaAcademico[] = [
  {
    id: 'prog-1',
    codigo: 'ING-SIS',
    nombre: 'Ingeniería de Sistemas',
    facultad: 'Facultad de Ingeniería y Ciencias Aplicadas',
    nivelAcademico: 'Pregrado',
    totalCreditos: 160,
    duracionSemestres: 10,
    estado: 'Activo',
    descripcion: 'Formación integral en diseño de software, arquitectura de sistemas distribuidos, bases de datos y ciberseguridad.'
  },
  {
    id: 'prog-2',
    codigo: 'ADM-EMP',
    nombre: 'Administración de Empresas',
    facultad: 'Facultad de Ciencias Económicas y Administrativas',
    nivelAcademico: 'Pregrado',
    totalCreditos: 145,
    duracionSemestres: 9,
    estado: 'Activo',
    descripcion: 'Desarrollo de líderes estratégicos con competencias en finanzas, operaciones, innovación y gestión del talento.'
  },
  {
    id: 'prog-3',
    codigo: 'CON-PUB',
    nombre: 'Contaduría Pública',
    facultad: 'Facultad de Ciencias Económicas y Administrativas',
    nivelAcademico: 'Pregrado',
    totalCreditos: 150,
    duracionSemestres: 9,
    estado: 'Activo',
    descripcion: 'Especialistas en auditoría integral, tributación, estándares NIIF y control financiero institucional.'
  }
];

export const INITIAL_ASIGNATURAS: Asignatura[] = [
  // Semestre 1 - Ing. Sistemas
  {
    id: 'asig-sis-101',
    codigo: 'SIS-101',
    nombre: 'Introducción a la Programación',
    programaId: 'prog-1',
    creditos: 3,
    semestreNivel: 1,
    horasSemanales: 4,
    prerrequisitos: [],
    descripcion: 'Fundamentos de algoritmia, lógica de programación estructurada, tipos de datos y control de flujo.',
    estado: 'Activa'
  },
  {
    id: 'asig-sis-102',
    codigo: 'SIS-102',
    nombre: 'Cálculo Diferencial',
    programaId: 'prog-1',
    creditos: 4,
    semestreNivel: 1,
    horasSemanales: 5,
    prerrequisitos: [],
    descripcion: 'Límites, continuidad, derivadas y aplicaciones en optimización matemática.',
    estado: 'Activa'
  },
  // Semestre 2 - Ing. Sistemas
  {
    id: 'asig-sis-201',
    codigo: 'SIS-201',
    nombre: 'Programación Orientada a Objetos',
    programaId: 'prog-1',
    creditos: 4,
    semestreNivel: 2,
    horasSemanales: 4,
    prerrequisitos: ['SIS-101'],
    descripcion: 'Paradigmas de clases, herencia, polimorfismo, interfaces y diseño modular en Java/C#.',
    estado: 'Activa'
  },
  {
    id: 'asig-sis-202',
    codigo: 'SIS-202',
    nombre: 'Estructuras de Datos y Algoritmos',
    programaId: 'prog-1',
    creditos: 3,
    semestreNivel: 2,
    horasSemanales: 4,
    prerrequisitos: ['SIS-101'],
    descripcion: 'Listas, pilas, colas, árboles balanceados, grafos y análisis de complejidad asintótica.',
    estado: 'Activa'
  },
  // Semestre 3 - Ing. Sistemas
  {
    id: 'asig-sis-301',
    codigo: 'SIS-301',
    nombre: 'Bases de Datos Relacionales',
    programaId: 'prog-1',
    creditos: 3,
    semestreNivel: 3,
    horasSemanales: 4,
    prerrequisitos: ['SIS-201'],
    descripcion: 'Modelo entidad-relación, álgebra relacional, normalización, SQL avanzado y transacciones ACID.',
    estado: 'Activa'
  },
  {
    id: 'asig-sis-302',
    codigo: 'SIS-302',
    nombre: 'Arquitectura de Software y Patrones',
    programaId: 'prog-1',
    creditos: 4,
    semestreNivel: 3,
    horasSemanales: 4,
    prerrequisitos: ['SIS-201', 'SIS-202'],
    descripcion: 'Arquitectura en capas, principios SOLID, patrones GoF, microservicios y Spring Boot empresarial.',
    estado: 'Activa'
  },
  // Semestre 4 - Ing. Sistemas
  {
    id: 'asig-sis-401',
    codigo: 'SIS-401',
    nombre: 'Desarrollo Web Full-Stack',
    programaId: 'prog-1',
    creditos: 4,
    semestreNivel: 4,
    horasSemanales: 5,
    prerrequisitos: ['SIS-301', 'SIS-302'],
    descripcion: 'APIs RESTful con Spring Boot, interfaces modernas React/TypeScript, seguridad OAuth2/JWT.',
    estado: 'Activa'
  },
  // Asignaturas Administración
  {
    id: 'asig-adm-101',
    codigo: 'ADM-101',
    nombre: 'Fundamentos de Administración',
    programaId: 'prog-2',
    creditos: 3,
    semestreNivel: 1,
    horasSemanales: 3,
    prerrequisitos: [],
    descripcion: 'Teorías organizacionales, proceso administrativo de planeación, organización, dirección y control.',
    estado: 'Activa'
  },
  {
    id: 'asig-adm-201',
    codigo: 'ADM-201',
    nombre: 'Gestión Estratégica y Liderazgo',
    programaId: 'prog-2',
    creditos: 3,
    semestreNivel: 2,
    horasSemanales: 3,
    prerrequisitos: ['ADM-101'],
    descripcion: 'Formulación y ejecución de planes estratégicos de negocio, matrices FODA y toma de decisiones.',
    estado: 'Activa'
  }
];

export const INITIAL_PERIODOS: PeriodoAcademico[] = [
  {
    id: 'per-2026-1',
    codigo: '2026-I',
    nombre: 'Primer Periodo Académico 2026',
    fechaInicio: '2026-02-02',
    fechaFin: '2026-06-20',
    estado: 'ACTIVO',
    esVigente: true
  },
  {
    id: 'per-2026-2',
    codigo: '2026-II',
    nombre: 'Segundo Periodo Académico 2026',
    fechaInicio: '2026-08-03',
    fechaFin: '2026-12-15',
    estado: 'PLANIFICACION',
    esVigente: false
  },
  {
    id: 'per-2025-2',
    codigo: '2025-II',
    nombre: 'Segundo Periodo Académico 2025',
    fechaInicio: '2025-08-01',
    fechaFin: '2025-12-10',
    estado: 'CERRADO',
    esVigente: false
  }
];

export const INITIAL_DOCENTES: Docente[] = [
  {
    id: 'doc-1',
    usuarioId: 'usr-doc-1',
    codigoDocente: 'DOC-1001',
    nombreCompleto: 'Dr. Carlos Arturo Mendoza',
    documentoIdentidad: '79845210',
    email: 'carlos.mendoza@universidad.edu.co',
    telefono: '+57 310 452 8901',
    tituloAcademico: 'Doctor en Ciencias de la Computación',
    especialidad: 'Arquitectura de Software y Sistemas Distribuidos',
    departamento: 'Ingeniería de Sistemas',
    dedicacion: 'Tiempo Completo',
    activo: true,
    maxHorasSemanales: 20
  },
  {
    id: 'doc-2',
    usuarioId: 'usr-doc-2',
    codigoDocente: 'DOC-1002',
    nombreCompleto: 'M.Sc. Laura Sofía Peña',
    documentoIdentidad: '52389144',
    email: 'laura.pena@universidad.edu.co',
    telefono: '+57 315 889 1234',
    tituloAcademico: 'Magíster en Ingeniería de Software',
    especialidad: 'Desarrollo Web Full-Stack y Microservicios',
    departamento: 'Ingeniería de Sistemas',
    dedicacion: 'Tiempo Completo',
    activo: true,
    maxHorasSemanales: 20
  },
  {
    id: 'doc-3',
    usuarioId: 'usr-doc-3',
    codigoDocente: 'DOC-1003',
    nombreCompleto: 'Ing. Roberto Gómez Silva',
    documentoIdentidad: '80123987',
    email: 'roberto.gomez@universidad.edu.co',
    telefono: '+57 320 671 4590',
    tituloAcademico: 'Especialista en Bases de Datos y Cloud Computing',
    especialidad: 'Bases de Datos Relacionales y NoSQL',
    departamento: 'Ingeniería de Sistemas',
    dedicacion: 'Medio Tiempo',
    activo: true,
    maxHorasSemanales: 12
  },
  {
    id: 'doc-4',
    usuarioId: 'usr-doc-4',
    codigoDocente: 'DOC-1004',
    nombreCompleto: 'Dra. María Elena Restrepo',
    documentoIdentidad: '41908234',
    email: 'elena.restrepo@universidad.edu.co',
    telefono: '+57 300 234 5678',
    tituloAcademico: 'Doctora en Administración y Estrategia',
    especialidad: 'Gestión Estratégica y Talento Organizacional',
    departamento: 'Ciencias Administrativas',
    dedicacion: 'Tiempo Completo',
    activo: true,
    maxHorasSemanales: 20
  }
];

export const INITIAL_GRUPOS: Grupo[] = [
  // Grupo 1: SIS-302 Arquitectura de Software - Docente: Carlos Mendoza
  // Horario: Lunes de 08:00 a 10:00 y Miércoles de 08:00 a 10:00
  {
    id: 'grp-sis-302-g1',
    codigo: 'SIS-302-G1',
    asignaturaId: 'asig-sis-302',
    periodoId: 'per-2026-1',
    docenteId: 'doc-1', // Carlos Mendoza
    cupoMaximo: 25,
    cuposOcupados: 2,
    horarios: [
      {
        id: 'frj-1',
        dia: 'Lunes',
        horaInicio: '08:00',
        horaFin: '10:00',
        aula: 'Edificio de Ingeniería - Aula 302',
        modalidad: 'Presencial'
      },
      {
        id: 'frj-2',
        dia: 'Miércoles',
        horaInicio: '08:00',
        horaFin: '10:00',
        aula: 'Edificio de Ingeniería - Aula 302',
        modalidad: 'Presencial'
      }
    ],
    estado: 'Abierto',
    observaciones: 'Enfoque en Clean Architecture, Spring Boot 3 y Microservicios.'
  },
  // Grupo 2: SIS-401 Desarrollo Web Full-Stack - Docente: Laura Peña
  // Horario: Martes 14:00 a 17:00 y Jueves 14:00 a 16:00
  {
    id: 'grp-sis-401-g1',
    codigo: 'SIS-401-G1',
    asignaturaId: 'asig-sis-401',
    periodoId: 'per-2026-1',
    docenteId: 'doc-2', // Laura Peña
    cupoMaximo: 20,
    cuposOcupados: 2,
    horarios: [
      {
        id: 'frj-3',
        dia: 'Martes',
        horaInicio: '14:00',
        horaFin: '17:00',
        aula: 'Laboratorio de Cómputo 4',
        modalidad: 'Presencial'
      },
      {
        id: 'frj-4',
        dia: 'Jueves',
        horaInicio: '14:00',
        horaFin: '16:00',
        aula: 'Laboratorio de Cómputo 4',
        modalidad: 'Presencial'
      }
    ],
    estado: 'Abierto',
    observaciones: 'Desarrollo con React 19, TypeScript y Spring Boot RESTful.'
  },
  // Grupo 3: SIS-301 Bases de Datos Relacionales - Docente: Roberto Gómez
  // Horario: Lunes 10:00 a 12:00 y Viernes 10:00 a 12:00
  {
    id: 'grp-sis-301-g1',
    codigo: 'SIS-301-G1',
    asignaturaId: 'asig-sis-301',
    periodoId: 'per-2026-1',
    docenteId: 'doc-3', // Roberto Gómez
    cupoMaximo: 30,
    cuposOcupados: 1,
    horarios: [
      {
        id: 'frj-5',
        dia: 'Lunes',
        horaInicio: '10:00',
        horaFin: '12:00',
        aula: 'Laboratorio de Base de Datos 1',
        modalidad: 'Presencial'
      },
      {
        id: 'frj-6',
        dia: 'Viernes',
        horaInicio: '10:00',
        horaFin: '12:00',
        aula: 'Laboratorio de Base de Datos 1',
        modalidad: 'Presencial'
      }
    ],
    estado: 'Abierto',
    observaciones: 'Modelado relacional, PostgreSQL y optimización de índices.'
  },
  // Grupo 4: SIS-201 Programación Orientada a Objetos - Sin docente asignado inicialmente
  // Horario: Lunes 09:00 a 11:00 (Diseñado para probar validación de colisión de horario docente!)
  {
    id: 'grp-sis-201-g1',
    codigo: 'SIS-201-G1',
    asignaturaId: 'asig-sis-201',
    periodoId: 'per-2026-1',
    docenteId: null, // Pendiente por asignar
    cupoMaximo: 25,
    cuposOcupados: 0,
    horarios: [
      {
        id: 'frj-7',
        dia: 'Lunes',
        horaInicio: '09:00',
        horaFin: '11:00',
        aula: 'Edificio Central - Aula 201',
        modalidad: 'Presencial'
      },
      {
        id: 'frj-8',
        dia: 'Miércoles',
        horaInicio: '09:00',
        horaFin: '11:00',
        aula: 'Edificio Central - Aula 201',
        modalidad: 'Presencial'
      }
    ],
    estado: 'Abierto',
    observaciones: 'Grupo disponible para asignación docente (ideal para probar regla de cruce).'
  },
  // Grupo 5: ADM-101 Fundamentos de Administración - Docente: Dra. María Restrepo
  {
    id: 'grp-adm-101-g1',
    codigo: 'ADM-101-G1',
    asignaturaId: 'asig-adm-101',
    periodoId: 'per-2026-1',
    docenteId: 'doc-4',
    cupoMaximo: 35,
    cuposOcupados: 1,
    horarios: [
      {
        id: 'frj-9',
        dia: 'Miércoles',
        horaInicio: '18:00',
        horaFin: '21:00',
        aula: 'Auditorio de Negocios A',
        modalidad: 'Híbrida'
      }
    ],
    estado: 'Abierto',
    observaciones: 'Clase magistral con estudios de caso de Harvard Business School.'
  }
];

export const INITIAL_ESTUDIANTES: Estudiante[] = [
  {
    id: 'est-1',
    usuarioId: 'usr-est-1',
    codigoEstudiante: 'EST-2024-001',
    nombreCompleto: 'Andrés Felipe Morales',
    documentoIdentidad: '1018475920',
    email: 'andres.morales@estudiante.edu.co',
    telefono: '+57 312 901 2345',
    programaId: 'prog-1',
    semestreActual: 4,
    promedioAcumulado: 4.4,
    creditosAprobados: 48,
    estadoAcademico: 'Regular',
    activo: true
  },
  {
    id: 'est-2',
    usuarioId: 'usr-est-2',
    codigoEstudiante: 'EST-2024-002',
    nombreCompleto: 'Camila Andrea Torres',
    documentoIdentidad: '1020849312',
    email: 'camila.torres@estudiante.edu.co',
    telefono: '+57 318 456 7890',
    programaId: 'prog-1',
    semestreActual: 4,
    promedioAcumulado: 4.7,
    creditosAprobados: 52,
    estadoAcademico: 'Regular',
    activo: true
  },
  {
    id: 'est-3',
    usuarioId: 'usr-est-3',
    codigoEstudiante: 'EST-2025-015',
    nombreCompleto: 'Mateo Sebastián Rivas',
    documentoIdentidad: '1032489110',
    email: 'mateo.rivas@estudiante.edu.co',
    telefono: '+57 314 789 0123',
    programaId: 'prog-1',
    semestreActual: 2,
    promedioAcumulado: 3.8,
    creditosAprobados: 18,
    estadoAcademico: 'Regular',
    activo: true
  },
  {
    id: 'est-4',
    usuarioId: 'usr-est-4',
    codigoEstudiante: 'EST-2024-088',
    nombreCompleto: 'Valentina Castro Duque',
    documentoIdentidad: '1015693482',
    email: 'valentina.castro@estudiante.edu.co',
    telefono: '+57 301 654 3210',
    programaId: 'prog-2',
    semestreActual: 3,
    promedioAcumulado: 4.1,
    creditosAprobados: 32,
    estadoAcademico: 'Regular',
    activo: true
  }
];

export const INITIAL_MATRICULAS: Matricula[] = [
  // Andrés Morales matriculado en SIS-302-G1
  {
    id: 'mat-1',
    estudianteId: 'est-1',
    grupoId: 'grp-sis-302-g1',
    asignaturaId: 'asig-sis-302',
    periodoId: 'per-2026-1',
    fechaMatricula: '2026-02-05T09:30:00Z',
    estado: 'MATRICULADO'
  },
  // Andrés Morales matriculado en SIS-401-G1
  {
    id: 'mat-2',
    estudianteId: 'est-1',
    grupoId: 'grp-sis-401-g1',
    asignaturaId: 'asig-sis-401',
    periodoId: 'per-2026-1',
    fechaMatricula: '2026-02-05T09:35:00Z',
    estado: 'MATRICULADO'
  },
  // Camila Torres matriculada en SIS-302-G1
  {
    id: 'mat-3',
    estudianteId: 'est-2',
    grupoId: 'grp-sis-302-g1',
    asignaturaId: 'asig-sis-302',
    periodoId: 'per-2026-1',
    fechaMatricula: '2026-02-04T11:15:00Z',
    estado: 'MATRICULADO'
  },
  // Camila Torres matriculada en SIS-401-G1
  {
    id: 'mat-4',
    estudianteId: 'est-2',
    grupoId: 'grp-sis-401-g1',
    asignaturaId: 'asig-sis-401',
    periodoId: 'per-2026-1',
    fechaMatricula: '2026-02-04T11:20:00Z',
    estado: 'MATRICULADO'
  },
  // Valentina Castro matriculada en ADM-101-G1
  {
    id: 'mat-5',
    estudianteId: 'est-4',
    grupoId: 'grp-adm-101-g1',
    asignaturaId: 'asig-adm-101',
    periodoId: 'per-2026-1',
    fechaMatricula: '2026-02-03T16:00:00Z',
    estado: 'MATRICULADO'
  }
];

export const INITIAL_CALIFICACIONES: Calificacion[] = [
  // Andrés Morales - SIS-302 Arquitectura
  {
    id: 'cal-1',
    matriculaId: 'mat-1',
    estudianteId: 'est-1',
    grupoId: 'grp-sis-302-g1',
    asignaturaId: 'asig-sis-302',
    periodoId: 'per-2026-1',
    corte1: 4.5, // 30%
    corte2: 4.2, // 30%
    examenFinal: null, // Pendiente (40%)
    definitiva: null,
    estado: 'Cursando',
    ultimaModificacion: '2026-04-10T14:20:00Z',
    modificadoPor: 'Dr. Carlos Arturo Mendoza',
    observaciones: 'Excelente sustentación del proyecto de microservicios con Spring Boot.'
  },
  // Andrés Morales - SIS-401 Web Full-Stack
  {
    id: 'cal-2',
    matriculaId: 'mat-2',
    estudianteId: 'est-1',
    grupoId: 'grp-sis-401-g1',
    asignaturaId: 'asig-sis-401',
    periodoId: 'per-2026-1',
    corte1: 4.8,
    corte2: null,
    examenFinal: null,
    definitiva: null,
    estado: 'Cursando',
    ultimaModificacion: '2026-03-25T17:45:00Z',
    modificadoPor: 'M.Sc. Laura Sofía Peña',
    observaciones: 'Dominio destacado de hooks avanzados y TypeScript en React.'
  },
  // Camila Torres - SIS-302 Arquitectura
  {
    id: 'cal-3',
    matriculaId: 'mat-3',
    estudianteId: 'est-2',
    grupoId: 'grp-sis-302-g1',
    asignaturaId: 'asig-sis-302',
    periodoId: 'per-2026-1',
    corte1: 4.9,
    corte2: 4.8,
    examenFinal: null,
    definitiva: null,
    estado: 'Cursando',
    ultimaModificacion: '2026-04-10T14:22:00Z',
    modificadoPor: 'Dr. Carlos Arturo Mendoza',
    observaciones: 'Diseño arquitectónico impecable con diagramas C4 y DDD.'
  },
  // Camila Torres - SIS-401 Web Full-Stack
  {
    id: 'cal-4',
    matriculaId: 'mat-4',
    estudianteId: 'est-2',
    grupoId: 'grp-sis-401-g1',
    asignaturaId: 'asig-sis-401',
    periodoId: 'per-2026-1',
    corte1: 5.0,
    corte2: null,
    examenFinal: null,
    definitiva: null,
    estado: 'Cursando',
    ultimaModificacion: '2026-03-25T17:48:00Z',
    modificadoPor: 'M.Sc. Laura Sofía Peña'
  },
  // Valentina Castro - ADM-101
  {
    id: 'cal-5',
    matriculaId: 'mat-5',
    estudianteId: 'est-4',
    grupoId: 'grp-adm-101-g1',
    asignaturaId: 'asig-adm-101',
    periodoId: 'per-2026-1',
    corte1: 4.2,
    corte2: 3.9,
    examenFinal: null,
    definitiva: null,
    estado: 'Cursando',
    ultimaModificacion: '2026-04-05T19:10:00Z',
    modificadoPor: 'Dra. María Elena Restrepo'
  }
];

export const INITIAL_USUARIOS: Usuario[] = [
  {
    id: 'usr-admin',
    username: 'admin.sga',
    nombreCompleto: 'Ing. César Avila',
    email: 'cesar.avilag@cun.edu.co',
    rol: 'ADMIN',
    documentoIdentidad: '52890123',
    telefono: '+57 311 000 1122',
    activo: true,
    fechaCreacion: '2025-01-15T08:00:00Z'
  },
  {
    id: 'usr-coord',
    username: 'coord.sistemas',
    nombreCompleto: 'Mg. Mauricio Herrera Castro',
    email: 'coordinacion.sistemas@universidad.edu.co',
    rol: 'COORDINADOR',
    documentoIdentidad: '79654321',
    telefono: '+57 312 333 4455',
    activo: true,
    fechaCreacion: '2025-01-16T09:00:00Z'
  },
  {
    id: 'usr-doc-1',
    username: 'doc.carlos.mendoza',
    nombreCompleto: 'Dr. Carlos Arturo Mendoza',
    email: 'carlos.mendoza@universidad.edu.co',
    rol: 'DOCENTE',
    documentoIdentidad: '79845210',
    telefono: '+57 310 452 8901',
    activo: true,
    fechaCreacion: '2025-01-20T10:00:00Z',
    referenciaId: 'doc-1'
  },
  {
    id: 'usr-doc-2',
    username: 'doc.laura.pena',
    nombreCompleto: 'M.Sc. Laura Sofía Peña',
    email: 'laura.pena@universidad.edu.co',
    rol: 'DOCENTE',
    documentoIdentidad: '52389144',
    telefono: '+57 315 889 1234',
    activo: true,
    fechaCreacion: '2025-01-20T10:30:00Z',
    referenciaId: 'doc-2'
  },
  {
    id: 'usr-est-1',
    username: 'est.andres.morales',
    nombreCompleto: 'Andrés Felipe Morales',
    email: 'andres.morales@estudiante.edu.co',
    rol: 'ESTUDIANTE',
    documentoIdentidad: '1018475920',
    telefono: '+57 312 901 2345',
    activo: true,
    fechaCreacion: '2025-02-01T11:00:00Z',
    referenciaId: 'est-1'
  },
  {
    id: 'usr-est-2',
    username: 'est.camila.torres',
    nombreCompleto: 'Camila Andrea Torres',
    email: 'camila.torres@estudiante.edu.co',
    rol: 'ESTUDIANTE',
    documentoIdentidad: '1020849312',
    telefono: '+57 318 456 7890',
    activo: true,
    fechaCreacion: '2025-02-01T11:30:00Z',
    referenciaId: 'est-2'
  }
];

export const INITIAL_AUDITORIA: RegistroAuditoria[] = [
  {
    id: 'aud-001',
    timestamp: '2026-02-02T08:00:00Z',
    usuarioId: 'usr-admin',
    nombreUsuario: 'Ing. César Avila',
    rolUsuario: 'ADMIN',
    accion: 'APERTURA_PERIODO_ACADEMICO',
    modulo: 'SISTEMA',
    entidadAfectada: 'PeriodoAcademico',
    idEntidadAfectada: 'per-2026-1',
    detalle: 'Apertura oficial del periodo 2026-I para matrícula y programación académica.',
    estadoResultado: 'EXITO',
    ipSimulada: '192.168.10.15'
  },
  {
    id: 'aud-002',
    timestamp: '2026-02-03T10:15:00Z',
    usuarioId: 'usr-coord',
    nombreUsuario: 'Mg. Mauricio Herrera Castro',
    rolUsuario: 'COORDINADOR',
    accion: 'ASIGNACION_DOCENTE_GRUPO',
    modulo: 'HORARIOS_DOCENTE',
    entidadAfectada: 'Grupo',
    idEntidadAfectada: 'grp-sis-302-g1',
    detalle: 'Docente Dr. Carlos Arturo Mendoza asignado exitosamente al grupo SIS-302-G1 (Lunes y Miércoles 08:00-10:00). Validación de colisión horaria superada.',
    estadoResultado: 'EXITO',
    ipSimulada: '192.168.10.42'
  },
  {
    id: 'aud-003',
    timestamp: '2026-02-04T11:15:00Z',
    usuarioId: 'usr-est-2',
    nombreUsuario: 'Camila Andrea Torres',
    rolUsuario: 'ESTUDIANTE',
    accion: 'MATRICULA_ACADEMICA_REALIZADA',
    modulo: 'MATRICULAS',
    entidadAfectada: 'Matricula',
    idEntidadAfectada: 'mat-3',
    detalle: 'Estudiante EST-2024-002 matriculó exitosamente SIS-302-G1 (Cupo restante: 23).',
    estadoResultado: 'EXITO',
    ipSimulada: '186.84.112.5'
  },
  {
    id: 'aud-004',
    timestamp: '2026-04-10T14:20:00Z',
    usuarioId: 'usr-doc-1',
    nombreUsuario: 'Dr. Carlos Arturo Mendoza',
    rolUsuario: 'DOCENTE',
    accion: 'CALIFICACION_CORTE_REGISTRADA',
    modulo: 'CALIFICACIONES',
    entidadAfectada: 'Calificacion',
    idEntidadAfectada: 'cal-1',
    detalle: 'Registro de calificaciones de Corte 1 (4.5) y Corte 2 (4.2) para el estudiante Andrés Felipe Morales en SIS-302-G1.',
    estadoResultado: 'EXITO',
    ipSimulada: '190.144.201.88'
  }
];
