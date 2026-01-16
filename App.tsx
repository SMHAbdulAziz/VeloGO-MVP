
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { RiderDashboard } from './components/RiderDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { TripsView } from './components/TripsView';
import { SupportView } from './components/SupportView';
import { WalletView } from './components/WalletView';
import { VeloLongView } from './components/VeloLongView';
import { UserRole } from './types';

type Screen = 'HOME' | 'PROFILE' | 'SETTINGS' | 'TRIPS' | 'SUPPORT' | 'WALLET' | 'VELO_LONG';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.RIDER);
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentRole(UserRole.ADMIN);
        setCurrentScreen('HOME');
      }
    };
    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    return () => window.removeEventListener('hashchange', handleLocationChange);
  }, []);

  const toggleRole = () => {
    setCurrentScreen('HOME');
    if (currentRole === UserRole.RIDER) {
      setCurrentRole(UserRole.DRIVER);
    } else {
      setCurrentRole(UserRole.RIDER);
    }
  };

  const renderView = () => {
    // Top-level modal screens
    if (currentScreen === 'PROFILE') {
      return <ProfileView role={currentRole} onBack={() => setCurrentScreen('HOME')} />;
    }
    
    if (currentScreen === 'SETTINGS') {
      return <SettingsView role={currentRole} onBack={() => setCurrentScreen('HOME')} />;
    }

    if (currentScreen === 'VELO_LONG') {
      return <VeloLongView onBack={() => setCurrentScreen('HOME')} />;
    }

    // Bottom Navigation Screens
    switch (currentScreen) {
      case 'TRIPS':
        return <TripsView />;
      case 'SUPPORT':
        return <SupportView />;
      case 'WALLET':
        return <WalletView />;
      case 'HOME':
      default:
        switch (currentRole) {
          case UserRole.RIDER:
            return <RiderDashboard />;
          case UserRole.DRIVER:
            return <DriverDashboard />;
          case UserRole.ADMIN:
            return <AdminDashboard />;
          default:
            return <RiderDashboard />;
        }
    }
  };

  const getTitle = () => {
    if (currentScreen === 'PROFILE') return 'Member Profile';
    if (currentScreen === 'SETTINGS') return 'Settings';
    if (currentScreen === 'TRIPS') return 'My Trips';
    if (currentScreen === 'SUPPORT') return 'Concierge';
    if (currentScreen === 'WALLET') return 'Membership Wallet';
    if (currentScreen === 'VELO_LONG') return 'VeloGO Long';
    if (currentRole === UserRole.ADMIN) return 'Admin Console';
    return currentRole === UserRole.DRIVER ? 'Driver Mode' : 'Rider Mode';
  };

  return (
    <Layout 
      title={getTitle()}
      role={currentRole}
      activeTab={currentScreen}
      onTabChange={(tab: string) => setCurrentScreen(tab.toUpperCase() as Screen)}
      onToggleRole={currentRole === UserRole.ADMIN ? undefined : toggleRole}
      onViewProfile={() => setCurrentScreen('PROFILE')}
      onViewSettings={() => setCurrentScreen('SETTINGS')}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
