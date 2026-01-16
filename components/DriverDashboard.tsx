
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'M', earnings: 120 },
  { name: 'T', earnings: 150 },
  { name: 'W', earnings: 90 },
  { name: 'T', earnings: 210 },
  { name: 'F', earnings: 250 },
  { name: 'S', earnings: 320 },
  { name: 'S', earnings: 140 },
];

export const DriverDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTrip, setActiveTrip] = useState<boolean>(false);
  const [isLongDedication, setIsLongDedication] = useState(false);
  const [breakCountdown, setBreakCountdown] = useState<number | null>(null);

  useEffect(() => {
    let timer: any;
    if (breakCountdown && breakCountdown > 0) {
      timer = setInterval(() => setBreakCountdown(prev => (prev ? prev - 1 : null)), 1000);
    } else if (breakCountdown === 0) {
      setBreakCountdown(null);
    }
    return () => clearInterval(timer);
  }, [breakCountdown]);

  const handleCompleteTrip = () => {
    if (isLongDedication) {
      // Start 45 min break timer (simulated as 45 seconds for demo)
      setBreakCountdown(45);
    }
    setActiveTrip(false);
  };

  return (
    <div className="p-4 space-y-6 relative pb-20">
      <div className="bg-gray-900 text-white p-5 rounded-3xl shadow-xl overflow-hidden relative border-l-4 border-veloGold">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h3 className="text-veloGold font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-route"></i> VeloGO Long Dedicated
            </h3>
            <p className="text-[9px] text-gray-400 mt-1">Inter-city routes & Safety Hub verified</p>
          </div>
          <button 
            onClick={() => setIsLongDedication(!isLongDedication)}
            className={`w-12 h-6 rounded-full relative transition-colors ${isLongDedication ? 'bg-veloGold' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 bg-black w-4 h-4 rounded-full transition-all ${isLongDedication ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        {isLongDedication && (
          <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-repeat text-veloGold text-xs"></i>
              <span className="text-[8px] font-black uppercase tracking-widest">Return-Trip Guarantee Active</span>
            </div>
            <span className="text-[8px] bg-veloGold text-black px-2 py-0.5 rounded font-black">2.5X PAY</span>
          </div>
        )}
      </div>

      {breakCountdown !== null && (
        <div className="bg-blue-600 text-white p-6 rounded-[2.5rem] shadow-2xl animate-pulse">
          <div className="flex items-center gap-4">
            <div className="text-3xl"><i className="fas fa-mug-hot"></i></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Safety Refreshment Break</p>
              <h4 className="text-2xl font-black">Return Leg in {breakCountdown}s</h4>
            </div>
          </div>
          <p className="text-[9px] mt-4 font-medium opacity-70">Enjoy your mandatory 45-min rest at the Safety Hub. This ensures you and your passengers stay safe.</p>
        </div>
      )}

      {activeTrip && (
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border-2 border-veloRed animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-veloRed text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">LONG DISTANCE TRIP</span>
            <span className="font-black text-2xl text-gray-800">$215.00</span>
          </div>
          <div className="space-y-6">
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-100"></div>
              <div>
                <p className="text-[8px] text-gray-400 font-black uppercase flex items-center gap-1">
                  <i className="fas fa-shield-halved text-green-500"></i> Pickup Hub
                </p>
                <p className="text-xs font-bold">Walmart Supercenter, Dallas TX</p>
              </div>
              <div>
                <p className="text-[8px] text-gray-400 font-black uppercase flex items-center gap-1">
                   <i className="fas fa-shield-halved text-green-500"></i> Destination Hub
                </p>
                <p className="text-xs font-bold">Whole Foods Market, Houston TX</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <button 
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200"
            >
              <i className="fas fa-location-arrow mr-2"></i> Navigate to Hub
            </button>
            <button 
              onClick={handleCompleteTrip}
              className="w-full bg-gray-50 text-gray-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              Drop-off Passengers
            </button>
          </div>
        </div>
      )}

      {!activeTrip && breakCountdown === null && (
        <>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xs uppercase tracking-widest text-gray-400">Earnings</h2>
              <span className="text-veloRed font-black text-2xl">$1,245.80</span>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="earnings" fill="#D32F2F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`p-5 rounded-3xl flex items-center justify-between border-2 transition-all ${isOnline ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-800">{isOnline ? 'Online' : 'Offline'}</p>
              <p className="text-[10px] text-gray-500 font-medium">{isLongDedication ? 'Inter-city Priority' : 'Local Only'}</p>
            </div>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`w-14 h-8 rounded-full relative transition-colors ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 bg-white w-6 h-6 rounded-full transition-all shadow-sm ${isOnline ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          {isOnline && (
            <button 
              onClick={() => setActiveTrip(true)}
              className="w-full py-4 bg-veloGold/20 border-2 border-dashed border-veloGold text-veloGold font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all"
            >
              Simulate Hub Match
            </button>
          )}
        </>
      )}

      <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-start gap-4 ring-1 ring-black/5">
        <div className="bg-green-50 p-3 rounded-2xl text-green-600">
          <i className="fas fa-video text-xl"></i>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Hub Safety Camera Access</h4>
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium mt-1">
            You can view Hub live-feeds 15 mins before arrival to verify security status.
          </p>
        </div>
      </div>
    </div>
  );
};
