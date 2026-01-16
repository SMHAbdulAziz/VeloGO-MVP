
import React, { useState, useEffect } from 'react';

interface SafetyAlert {
  id: string;
  type: string;
  user: string;
  issue: string;
  timestamp: string;
  status: 'OPEN' | 'RESOLVED';
}

interface DriverApplication {
  id: string;
  name: string;
  email: string;
  vehicle: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  licenseUrl: string;
  insuranceUrl: string;
}

interface LongRouteMonitor {
  id: string;
  driver: string;
  route: string;
  fromHub: string;
  toHub: string;
  status: 'EN_ROUTE' | 'REFRESHING' | 'RETURN_READY' | 'COMPLETED';
  passengers: number;
  breakTimeRemaining?: number; // minutes
  payMultiplier: string;
}

interface HubStatus {
  id: string;
  name: string;
  location: string;
  securityOnSite: boolean;
  lightingStatus: 'OPTIMAL' | 'DIM' | 'MAINTENANCE';
  activeTrips: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'long-routes' | 'hubs' | 'chat' | 'verify'>('stats');
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [applications, setApplications] = useState<DriverApplication[]>([
    {
      id: 'APP-001',
      name: 'Jordan Smith',
      email: 'j.smith@email.com',
      vehicle: 'Tesla Model 3',
      status: 'PENDING',
      appliedDate: '2025-11-20',
      licenseUrl: 'https://picsum.photos/seed/license1/400/250',
      insuranceUrl: 'https://picsum.photos/seed/insur1/400/250'
    },
    {
      id: 'APP-002',
      name: 'Elena Rodriguez',
      email: 'e.rod@email.com',
      vehicle: 'Chevrolet Suburban (XL)',
      status: 'PENDING',
      appliedDate: '2025-11-21',
      licenseUrl: 'https://picsum.photos/seed/license2/400/250',
      insuranceUrl: 'https://picsum.photos/seed/insur2/400/250'
    }
  ]);
  const [selectedApp, setSelectedApp] = useState<DriverApplication | null>(null);

  const [longTrips] = useState<LongRouteMonitor[]>([
    { id: 'VL-101', driver: 'Marcus D.', route: 'Dallas → Houston', fromHub: 'Walmart N. Central', toHub: 'Whole Foods Post Oak', status: 'REFRESHING', passengers: 4, breakTimeRemaining: 28, payMultiplier: '2.5X' },
    { id: 'VL-102', driver: 'Sarah K.', route: 'Dallas → Austin', fromHub: 'Target Haskell', toHub: 'Whole Foods Lamar', status: 'EN_ROUTE', passengers: 5, payMultiplier: '2.5X' },
  ]);

  const [hubs, setHubs] = useState<HubStatus[]>([
    { id: 'HUB-01', name: 'Walmart Supercenter', location: 'Dallas, TX', securityOnSite: true, lightingStatus: 'OPTIMAL', activeTrips: 5 },
    { id: 'HUB-02', name: 'Whole Foods Market', location: 'Houston, TX', securityOnSite: true, lightingStatus: 'OPTIMAL', activeTrips: 3 },
    { id: 'HUB-03', name: 'Target Hub', location: 'Los Angeles, CA', securityOnSite: true, lightingStatus: 'MAINTENANCE', activeTrips: 8 },
  ]);

  const [editingHubId, setEditingHubId] = useState<string | null>(null);

  const loadAlerts = () => {
    const alerts = JSON.parse(localStorage.getItem('velo_safety_alerts') || '[]');
    setSafetyAlerts(alerts.filter((a: SafetyAlert) => a.status === 'OPEN'));
  };

  useEffect(() => {
    loadAlerts();
    window.addEventListener('velo-safety-alert', loadAlerts);
    const interval = setInterval(loadAlerts, 5000);
    return () => {
      window.removeEventListener('velo-safety-alert', loadAlerts);
      clearInterval(interval);
    };
  }, []);

  const handleUpdateHubLighting = (hubId: string, status: 'OPTIMAL' | 'DIM' | 'MAINTENANCE') => {
    setHubs(prev => prev.map(hub => 
      hub.id === hubId ? { ...hub, lightingStatus: status } : hub
    ));
    setEditingHubId(null);
    console.log(`[VELO-GO ADMIN] Hub ${hubId} override: ${status}. Dispatching safety reroute protocols.`);
  };

  const handleUpdateStatus = (appId: string, status: 'APPROVED' | 'REJECTED') => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status } : app
    ));
    setSelectedApp(null);
  };

  const stats = [
    { label: 'Total Fleet', value: '1,284', change: '+12%' },
    { label: 'Safety Hubs', value: hubs.length.toString(), change: 'Global' },
    { label: 'Long Rev', value: '$18,402', change: '+24%' },
    { label: 'Pending', value: applications.filter(a => a.status === 'PENDING').length.toString(), change: 'Urgent' },
  ];

  return (
    <div className="p-4 space-y-6 pb-20 max-w-md mx-auto">
      {/* Emergency Notification Bar */}
      {safetyAlerts.length > 0 && (
        <div className="bg-veloRed text-white p-3 rounded-2xl animate-pulse shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fas fa-exclamation-triangle"></i>
            <span className="text-[10px] font-black uppercase tracking-widest">{safetyAlerts.length} Active Red Flags</span>
          </div>
          <button onClick={() => setActiveTab('chat')} className="text-[8px] bg-white/20 px-2 py-1 rounded-full font-black uppercase">View</button>
        </div>
      )}

      {/* Admin Nav */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'stats', icon: 'fa-chart-pie', label: 'Stats' },
          { id: 'verify', icon: 'fa-id-card', label: 'Fleet' },
          { id: 'hubs', icon: 'fa-shield-halved', label: 'Hubs' },
          { id: 'long-routes', icon: 'fa-route', label: 'Logistics' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-veloRed text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            <i className={`fas ${tab.icon} text-[10px]`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hub Management Module */}
      {activeTab === 'hubs' && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-800">Safety Hub Network</h3>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Override Mode Enabled</span>
          </div>
          <div className="space-y-4">
            {hubs.map(hub => (
              <div key={hub.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 relative overflow-hidden transition-all">
                {/* Visual Status Glow Strip */}
                <div className={`absolute top-0 right-0 w-1.5 h-full ${
                  hub.lightingStatus === 'OPTIMAL' ? 'bg-green-500 shadow-[0_0_10px_green]' : 
                  hub.lightingStatus === 'DIM' ? 'bg-amber-400 shadow-[0_0_10px_orange]' : 
                  'bg-veloRed shadow-[0_0_10px_red]'
                }`}></div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-sm text-gray-900">{hub.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{hub.location}</p>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setEditingHubId(editingHubId === hub.id ? null : hub.id)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all ${
                        hub.lightingStatus === 'OPTIMAL' ? 'bg-green-50 text-green-600 border-green-100' :
                        hub.lightingStatus === 'DIM' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-red-50 text-veloRed border-red-100'
                      }`}
                    >
                      {hub.lightingStatus}
                      <i className={`fas fa-chevron-${editingHubId === hub.id ? 'up' : 'down'} text-[8px]`}></i>
                    </button>

                    {editingHubId === hub.id && (
                      <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 z-50 animate-slide-up">
                        <p className="text-[8px] font-black text-gray-400 uppercase px-2 py-1 tracking-widest border-b border-gray-50 mb-1">Manual Override</p>
                        {(['OPTIMAL', 'DIM', 'MAINTENANCE'] as const).map((status) => (
                          <button 
                            key={status}
                            onClick={() => handleUpdateHubLighting(hub.id, status)}
                            className={`w-full text-left p-2.5 rounded-xl text-[9px] font-black uppercase tracking-tight flex items-center justify-between transition-colors ${
                              hub.lightingStatus === status ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            {status}
                            {hub.lightingStatus === status && <i className="fas fa-check"></i>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <i className={`fas fa-shield-halved ${hub.securityOnSite ? 'text-green-500' : 'text-gray-300'}`}></i>
                    <span className="text-[9px] font-black text-gray-500 uppercase">Live Security Feed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-car-side text-gray-300"></i>
                    <span className="text-[9px] font-black text-gray-500 uppercase">{hub.activeTrips} Units</span>
                  </div>
                </div>

                {hub.lightingStatus === 'MAINTENANCE' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-pulse">
                    <i className="fas fa-bolt-lightning text-veloRed text-xs"></i>
                    <p className="text-[9px] font-black text-veloRed uppercase leading-none tracking-widest">Emergency Maintenance Protocol</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification View */}
      {activeTab === 'verify' && (
        <div className="space-y-4 animate-slide-up">
          <h3 className="font-black text-xs uppercase tracking-widest text-gray-800 px-1">Credential Review</h3>
          <div className="space-y-3">
            {applications.filter(a => a.status === 'PENDING').map(app => (
              <div key={app.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-black text-gray-400">{app.name.charAt(0)}</div>
                  <div>
                    <p className="text-xs font-black text-gray-900">{app.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{app.vehicle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedApp(app)}
                  className="bg-gray-900 text-white px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
          {selectedApp && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 space-y-6 animate-slide-up">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-black text-xs uppercase tracking-widest">Driver ID Verification</h3>
                  <button onClick={() => setSelectedApp(null)} className="text-gray-400"><i className="fas fa-times"></i></button>
                </div>
                <img src={selectedApp.licenseUrl} className="w-full h-40 object-cover rounded-2xl border border-gray-100" alt="License" />
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')} className="py-3 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Deny</button>
                  <button onClick={() => handleUpdateStatus(selectedApp.id, 'APPROVED')} className="py-3 bg-veloRed text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Verify</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats View */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-black text-gray-900 mt-1">{s.value}</p>
                <span className="text-[8px] font-black text-green-500 uppercase">{s.change}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 text-white p-6 rounded-[2rem] relative overflow-hidden border-b-4 border-veloGold">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-4 text-veloGold italic">Association Health</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-widest">
                <span className="text-gray-400">Security Index</span>
                <span>99.8% Optimal</span>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full">
                <div className="bg-veloGold h-full w-[99.8%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logistics / Long Routes View */}
      {activeTab === 'long-routes' && (
        <div className="space-y-4 animate-slide-up">
          <h3 className="font-black text-xs uppercase tracking-widest text-gray-800 px-1">Inter-City Dispatch</h3>
          {longTrips.map(trip => (
            <div key={trip.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{trip.id}</span>
                  <p className="text-xs font-black text-gray-800 mt-0.5">{trip.route}</p>
                </div>
                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${trip.status === 'REFRESHING' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{trip.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-y border-gray-50 py-3">
                <div><span className="text-[8px] text-gray-400 uppercase block font-black">Driver</span> <span className="text-[10px] font-bold">{trip.driver}</span></div>
                <div className="text-right"><span className="text-[8px] text-gray-400 uppercase block font-black">Load</span> <span className="text-[10px] font-bold">{trip.passengers} Members</span></div>
              </div>
              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <div className="flex items-center gap-1 text-gray-400">
                  <i className="fas fa-clock"></i>
                  {trip.status === 'REFRESHING' ? `${trip.breakTimeRemaining}m Break Remaining` : 'En Route'}
                </div>
                <button className="text-veloRed">Manifest</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
