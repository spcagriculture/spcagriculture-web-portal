import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { SETTINGS_COLLECTION, SETTINGS_DOC_ID, PortalSettings, defaultSettings } from '@/integrations/firebase/portalSettings';
import MaintenancePage from '@/pages/MaintenancePage';

export const MaintenanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PortalSettings;
        setIsMaintenanceMode(data.isMaintenanceMode ?? false);
      } else {
        setIsMaintenanceMode(defaultSettings.isMaintenanceMode ?? false);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error listening to maintenance mode', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname.startsWith('/login');

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  // If maintenance mode is active and it's not an admin/login route, show maintenance page
  if (isMaintenanceMode && !isAdminRoute && !isLoginRoute) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
};
