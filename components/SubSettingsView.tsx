
import React, { useState } from 'react';

interface SubSettingsViewProps {
  title: string;
  onBack: () => void;
}

export const SubSettingsView: React.FC<SubSettingsViewProps> = ({ title, onBack }) => {
  // Local state for interactive elements
  const [notifications, setNotifications] = useState({
    'Push Notifications': true,
    'Email Alerts': false,
    'SMS Updates': true,
    'Promotional Offers': false,
  });
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [selectedDarkMode, setSelectedDarkMode] = useState('System Default');
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [passcode, setPasscode] = useState<number[]>([]);

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }));
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Data export request received. A download link will be sent to your verified email within 24 hours.');
    }, 1500);
  };

  const handleAdjustPermissions = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      alert(`Current Geolocation status: ${result.state}. Please check your browser or system settings to change this manually.`);
    } catch (e) {
      alert('Manual permission adjustment required in system settings.');
    }
  };

  const handlePasscodeClick = (val: number | string) => {
    if (val === 'X') {
      setPasscode(prev => prev.slice(0, -1));
    } else if (typeof val === 'number' && passcode.length < 4) {
      const newPass = [...passcode, val];
      setPasscode(newPass);
      if (newPass.length === 4) {
        setTimeout(() => {
          alert('Passcode successfully updated!');
          onBack();
        }, 500);
      }
    }
  };

  const renderContent = () => {
    switch (title) {
      case 'Privacy & Data':
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-sm mb-2">Location Sharing</h4>
              <p className="text-xs text-gray-500 mb-4">Allow VeloGO to access your location to find nearby drivers and provide accurate ETAs.</p>
              <button 
                onClick={handleAdjustPermissions}
                className="w-full py-3 bg-veloRed text-white rounded-xl font-bold text-xs uppercase active:scale-95 transition-transform"
              >
                Adjust Permissions
              </button>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-sm mb-2">Data Export</h4>
              <p className="text-xs text-gray-500 mb-4">Request a copy of your personal data stored on our servers.</p>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2"
              >
                {isExporting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-download"></i>}
                {isExporting ? 'Processing...' : 'Request Data Export'}
              </button>
            </div>
          </div>
        );
      case 'Notifications':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {Object.entries(notifications).map(([item, enabled]) => (
              <div key={item} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-700">{item}</span>
                <button 
                  onClick={() => handleNotificationToggle(item)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${enabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        );
      case 'App Language':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {['English (US)', 'Español', 'Français', 'Deutsch'].map(lang => (
              <button 
                key={lang} 
                onClick={() => setSelectedLanguage(lang)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className={`text-sm ${selectedLanguage === lang ? 'font-bold text-veloRed' : 'font-medium text-gray-700'}`}>{lang}</span>
                {selectedLanguage === lang && <i className="fas fa-check text-veloRed"></i>}
              </button>
            ))}
          </div>
        );
      case 'Dark Mode':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {['On', 'Off', 'System Default'].map(mode => (
              <button 
                key={mode} 
                onClick={() => setSelectedDarkMode(mode)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className={`text-sm ${selectedDarkMode === mode ? 'font-bold text-veloRed' : 'font-medium text-gray-700'}`}>{mode}</span>
                {selectedDarkMode === mode && <i className="fas fa-check text-veloRed"></i>}
              </button>
            ))}
          </div>
        );
      case 'Biometric Login':
        return (
          <div className="flex flex-col items-center justify-center pt-20 space-y-6">
            <div className="relative">
              <i className={`fas fa-fingerprint text-6xl transition-colors duration-300 ${biometricsEnabled ? 'text-veloRed animate-pulse' : 'text-gray-300'}`}></i>
              {biometricsEnabled && <i className="fas fa-check-circle absolute -bottom-2 -right-2 text-green-500 text-2xl bg-white rounded-full"></i>}
            </div>
            <div className="text-center">
              <h4 className="font-bold text-lg">Biometric Verification</h4>
              <p className="text-center text-sm text-gray-500 px-10 mt-2">Use Face ID or Fingerprint to quickly access your VeloGO account.</p>
            </div>
            <button 
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`w-14 h-7 rounded-full relative transition-colors duration-200 ${biometricsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-200 ${biometricsEnabled ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        );
      case 'Change Passcode':
        return (
          <div className="space-y-6 text-center pt-10">
            <h4 className="font-bold text-gray-700">Enter New 4-Digit Passcode</h4>
            <div className="flex justify-center gap-6">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${passcode.length > i ? 'bg-veloRed border-veloRed scale-110' : 'bg-transparent border-gray-300'}`}></div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-y-4 gap-x-8 px-12 pt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'X'].map((n, i) => (
                <button 
                  key={i} 
                  onClick={() => n !== '' && handlePasscodeClick(n)}
                  className={`text-2xl font-bold w-16 h-16 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors active:scale-90 ${n === '' ? 'pointer-events-none' : ''}`}
                >
                  {n === 'X' ? <i className="fas fa-backspace text-xl text-gray-400"></i> : n}
                </button>
              ))}
            </div>
          </div>
        );
      case 'Location Accuracy':
        return (
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-red-50 p-3 rounded-xl">
                 <i className="fas fa-crosshairs text-veloRed text-xl"></i>
               </div>
               <h4 className="font-bold text-sm">High Precision Mode</h4>
             </div>
             <p className="text-xs text-gray-500 leading-relaxed mb-6">Uses GPS, Wi-Fi, and mobile networks to determine your location as accurately as possible for faster pickups.</p>
             <div className="p-4 bg-green-50 text-green-700 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center">
               Currently Optimized for Dallas, TX
             </div>
          </div>
        );
      case 'Security':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-[10px] text-gray-400">Highly Recommended</p>
                </div>
                <span className="text-xs text-green-500 font-black uppercase tracking-tighter">Active</span>
              </div>
              <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium">Logged in Devices</span>
                <div className="flex items-center gap-2">
                   <span className="text-xs text-gray-400">2 Active</span>
                   <i className="fas fa-chevron-right text-gray-300 text-[10px]"></i>
                </div>
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
               <h4 className="text-sm font-bold mb-2">Login History</h4>
               <p className="text-[10px] text-gray-400 italic">No unusual activity detected in the last 30 days.</p>
            </div>
          </div>
        );
      default:
        return <p className="text-gray-500 text-center italic py-10">Feature content is being finalized for production.</p>;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-slide-up bg-gray-50 min-h-full pb-20 overflow-y-auto">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-veloRed shadow-sm transition-all active:scale-90">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="font-black text-sm uppercase tracking-[0.2em] text-gray-800">{title}</h2>
        <div className="w-10"></div>
      </div>
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};
