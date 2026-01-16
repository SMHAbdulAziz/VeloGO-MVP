
import React, { useState } from 'react';
import { UserRole } from '../types';
import { SubSettingsView } from './SubSettingsView';

interface SettingsViewProps {
  role: UserRole;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ role, onBack }) => {
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out of VeloGO?')) {
      window.location.reload(); // Simple mock sign out
    }
  };

  const settingsGroups = [
    {
      title: 'Account Settings',
      items: [
        { icon: 'fa-user-shield', label: 'Privacy & Data', desc: 'Manage what you share' },
        { icon: 'fa-bell', label: 'Notifications', desc: 'Push, Email, SMS' },
        { icon: 'fa-credit-card', label: 'Payment Methods', desc: 'Stripe, Cards, Apple Pay' },
      ]
    },
    {
      title: role === UserRole.DRIVER ? 'Driver Preferences' : 'Rider Preferences',
      items: [
        { icon: 'fa-language', label: 'App Language', desc: 'English (US)' },
        { icon: 'fa-moon', label: 'Dark Mode', desc: 'Follow System' },
        { icon: 'fa-location-crosshairs', label: 'Location Accuracy', desc: 'High Precision' },
      ]
    },
    {
      title: 'Security',
      items: [
        { icon: 'fa-shield-halved', label: 'Security', desc: 'Manage account safety' },
        { icon: 'fa-key', label: 'Change Passcode', desc: 'Last changed 3 months ago' },
        { icon: 'fa-fingerprint', label: 'Biometric Login', desc: 'Enabled' },
      ]
    }
  ];

  if (activeSubPage) {
    return <SubSettingsView title={activeSubPage} onBack={() => setActiveSubPage(null)} />;
  }

  return (
    <div className="p-6 space-y-8 animate-slide-up bg-gray-50 min-h-full pb-20 overflow-y-auto">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-veloRed shadow-sm transition-all active:scale-90">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="font-black text-sm uppercase tracking-[0.2em] text-gray-800">Settings</h2>
        <div className="w-10"></div>
      </div>

      {settingsGroups.map((group, idx) => (
        <div key={idx} className="space-y-3">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
            {group.title}
          </h3>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {group.items.map((item, i) => (
              <button 
                key={i} 
                onClick={() => setActiveSubPage(item.label)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-veloRed transition-colors">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-800">{item.label}</p>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-4 space-y-3">
        <button 
          onClick={handleSignOut}
          className="w-full bg-white text-veloRed py-4 rounded-2xl font-bold text-sm shadow-sm border border-red-50 hover:bg-red-50 transition-colors uppercase tracking-widest active:scale-[0.98]"
        >
          Sign Out
        </button>
        <p className="text-[10px] text-center text-gray-400 font-medium">
          VeloGO v1.0.4-MVP • Built for the USA
        </p>
      </div>
    </div>
  );
};
