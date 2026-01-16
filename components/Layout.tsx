
import React, { useState } from 'react';
import { VELO_RED } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onToggleRole?: () => void;
  role: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onViewProfile?: () => void;
  onViewSettings?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  onToggleRole, 
  role, 
  activeTab = 'HOME', 
  onTabChange,
  onViewProfile, 
  onViewSettings 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleViewProfile = () => {
    setIsProfileOpen(false);
    if (onViewProfile) onViewProfile();
  };

  const handleViewSettings = () => {
    setIsMenuOpen(false);
    if (onViewSettings) onViewSettings();
  };

  const handleTabClick = (tabId: string) => {
    if (onTabChange) onTabChange(tabId);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden shadow-2xl border-x">
      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="w-3/4 h-full bg-white shadow-xl p-6 space-y-6 animate-slide-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="font-black text-xl text-veloRed italic tracking-tighter">VeloGO</h2>
              <button onClick={() => setIsMenuOpen(false)}><i className="fas fa-times text-gray-400"></i></button>
            </div>
            <nav className="space-y-4">
              <button 
                onClick={() => handleTabClick('VELO_LONG')}
                className="w-full text-left font-black text-gray-800 py-4 px-4 bg-gray-900 text-white rounded-2xl flex items-center justify-between group transition-all active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-route text-veloGold"></i>
                  <span className="text-xs uppercase tracking-widest">VeloGO Long</span>
                </div>
                <i className="fas fa-arrow-right text-[10px] opacity-50 group-hover:translate-x-1 transition-transform"></i>
              </button>
              
              <div className="pt-4 space-y-1">
                <button 
                  onClick={handleViewSettings}
                  className="w-full text-left font-medium text-gray-700 py-3 hover:bg-gray-50 px-2 rounded flex items-center gap-3 transition-colors"
                >
                  <i className="fas fa-cog text-gray-400 w-5"></i>
                  <span className="text-xs font-bold uppercase tracking-tight">Settings</span>
                </button>
                {['Payment Methods', 'Promotions', 'Legal', 'Help'].map(item => (
                  <button key={item} className="w-full text-left font-medium text-gray-700 py-3 hover:bg-gray-50 px-2 rounded flex items-center gap-3 transition-colors">
                     <i className={`fas ${item === 'Legal' ? 'fa-scale-balanced' : 'fa-circle-question'} text-gray-300 w-5`}></i>
                     <span className="text-xs font-bold uppercase tracking-tight">{item}</span>
                  </button>
                ))}
              </div>
            </nav>
            <div className="absolute bottom-6 left-6 text-[8px] font-black text-gray-300 uppercase tracking-widest">Version 1.0.4-MVP</div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-veloRed text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <button className="text-xl active:scale-90 transition-transform" onClick={() => setIsMenuOpen(true)}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-black text-lg tracking-tighter italic">VeloGO</h1>
          <span className="text-[8px] uppercase font-black tracking-[0.2em] opacity-80">{title}</span>
        </div>
        <div className="flex items-center gap-3 relative">
          {onToggleRole && (
            <button onClick={onToggleRole} className="text-[10px] bg-white/20 px-2 py-1 rounded uppercase font-bold hover:bg-white/30 transition-colors">
              {role === 'RIDER' ? 'Driver' : 'Rider'}
            </button>
          )}
          <button className="text-xl relative active:scale-90 transition-transform" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <i className="fas fa-user-circle"></i>
          </button>
          
          {isProfileOpen && (
            <div className="absolute top-12 right-0 bg-white text-gray-800 shadow-2xl rounded-2xl p-4 w-48 z-[60] border animate-slide-up">
              <div className="font-black text-[10px] uppercase tracking-widest border-b pb-2 mb-2 text-gray-400">Account</div>
              <button 
                onClick={handleViewProfile}
                className="w-full text-left text-xs font-bold py-3 hover:text-veloRed transition-colors"
              >
                View Profile
              </button>
              <button 
                onClick={() => { setIsProfileOpen(false); handleViewSettings(); }}
                className="w-full text-left text-xs font-bold py-3 hover:text-veloRed transition-colors"
              >
                Settings
              </button>
              <button className="w-full text-left text-xs font-black py-3 text-red-500 uppercase tracking-widest mt-2 border-t">Sign Out</button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="bg-white border-t flex justify-around p-3 sticky bottom-0 z-50">
        {[
          { id: 'HOME', icon: 'fa-home', label: 'Home' },
          { id: 'TRIPS', icon: 'fa-clock', label: 'Trips' },
          { id: 'SUPPORT', icon: 'fa-comment', label: 'Support' },
          { id: 'WALLET', icon: 'fa-wallet', label: 'Wallet' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center transition-all px-4 py-1 rounded-xl ${activeTab === tab.id ? 'text-veloRed bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <i className={`fas ${tab.icon} text-lg`}></i>
            <span className="text-[9px] mt-1 font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-right {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-right { animation: slide-right 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.2s ease-out forwards; }
      `}} />
    </div>
  );
};
