/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Usuario } from './types/academic';
import { StorageService } from './services/storageService';
import { Header } from './components/common/Header';
import { Sidebar, NavigationTab } from './components/common/Sidebar';
import { NotificationToast, ToastMessage } from './components/common/NotificationToast';
import { LoginModal } from './components/auth/LoginModal';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { EstudiantesModule } from './components/estudiantes/EstudiantesModule';
import { DocentesModule } from './components/docentes/DocentesModule';
import { ProgramasAsignaturasModule } from './components/programas/ProgramasAsignaturasModule';
import { GruposPeriodosModule } from './components/grupos/GruposPeriodosModule';
import { MatriculaModule } from './components/matricula/MatriculaModule';
import { CalificacionesModule } from './components/calificaciones/CalificacionesModule';
import { EstudiantePortalModule } from './components/estudiante-portal/EstudiantePortalModule';
import { ReportesModule } from './components/reportes/ReportesModule';
import { AuditoriaModule } from './components/auditoria/AuditoriaModule';
import { ArquitecturaModule } from './components/arquitectura/ArquitecturaModule';

export default function App() {
  // Inicialización de la base de datos institucional en almacenamiento local
  useEffect(() => {
    StorageService.init();
  }, []);

  const [currentUser, setCurrentUser] = useState<Usuario>(() => StorageService.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Disparar notificaciones emergentes
  const handleShowNotification = (
    tipo: 'success' | 'error' | 'warning' | 'info',
    titulo: string,
    mensaje: string,
    detalles?: string
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, tipo, titulo, mensaje, detalles };
    setToasts((prev) => [...prev, newToast]);

    // Auto descartar después de 6 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Redireccionar inteligentemente según el rol si cambia de usuario
  const handleUserChange = (newUser: Usuario) => {
    setCurrentUser(newUser);

    if (newUser.rol === 'ESTUDIANTE') {
      // Si pasa a estudiante y está en un módulo administrativo, mover a portal de estudiante
      if (['estudiantes', 'docentes', 'programas', 'grupos', 'auditoria'].includes(currentTab)) {
        setCurrentTab('portal-estudiante');
      }
    } else if (newUser.rol === 'DOCENTE') {
      if (['estudiantes', 'programas', 'auditoria'].includes(currentTab)) {
        setCurrentTab('calificaciones');
      }
    }

    handleShowNotification(
      'info',
      'Sesión Actualizada',
      `Actuando ahora con perfil ${newUser.rol}: ${newUser.nombreCompleto}.`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased">
      {/* Barra Superior Institucional */}
      <Header
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onOpenArchitecture={() => setCurrentTab('arquitectura')}
        onOpenLoginModal={() => setLoginModalOpen(true)}
      />

      {/* Contenedor Principal: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Barra Lateral de Navegación por Roles */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          currentUser={currentUser}
        />

        {/* Viewport de Contenido */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardOverview
                currentUser={currentUser}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'estudiantes' && (
              <EstudiantesModule onShowNotification={handleShowNotification} />
            )}

            {currentTab === 'docentes' && (
              <DocentesModule onShowNotification={handleShowNotification} />
            )}

            {currentTab === 'programas' && (
              <ProgramasAsignaturasModule onShowNotification={handleShowNotification} />
            )}

            {currentTab === 'grupos' && (
              <GruposPeriodosModule onShowNotification={handleShowNotification} />
            )}

            {currentTab === 'matricula' && (
              <MatriculaModule
                currentUser={currentUser}
                onShowNotification={handleShowNotification}
              />
            )}

            {currentTab === 'calificaciones' && (
              <CalificacionesModule
                currentUser={currentUser}
                onShowNotification={handleShowNotification}
              />
            )}

            {currentTab === 'portal-estudiante' && (
              <EstudiantePortalModule currentUser={currentUser} />
            )}

            {currentTab === 'reportes' && <ReportesModule />}

            {currentTab === 'auditoria' && <AuditoriaModule />}

            {currentTab === 'arquitectura' && (
              <ArquitecturaModule onShowNotification={handleShowNotification} />
            )}
          </div>
        </main>
      </div>

      {/* Modal de Autenticación Individual */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleUserChange}
        currentUser={currentUser}
      />

      {/* Sistema de Alertas y Notificaciones Flotantes */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
