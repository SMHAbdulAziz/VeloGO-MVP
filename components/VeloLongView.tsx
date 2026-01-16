
import React, { useState } from 'react';

interface LongRoute {
  id: string;
  from: string;
  fromHub: string;
  to: string;
  toHub: string;
  departure: string;
  arrival: string;
  returnDeparture?: string;
  pricePerSeat: number;
  availableSeats: number;
  totalSeats: number;
  amenities: string[];
}

export const VeloLongView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RETURNING'>('ALL');

  const routes: LongRoute[] = [
    { 
      id: 'VL-101-A', 
      from: 'Dallas', 
      fromHub: 'Walmart Supercenter (N. Central Expwy)',
      to: 'Houston', 
      toHub: 'Whole Foods Market (Post Oak Blvd)',
      departure: '08:00 AM', 
      arrival: '11:30 AM',
      returnDeparture: '12:15 PM', // 45 min refresh window
      pricePerSeat: 45.00, 
      availableSeats: 3, 
      totalSeats: 6,
      amenities: ['Wi-Fi', 'Luxury Seats', 'AC', 'Refreshments']
    },
    { 
      id: 'VL-102-A', 
      from: 'Dallas', 
      fromHub: 'Target (Haskell Ave)',
      to: 'Austin', 
      toHub: 'Whole Foods Flagship (Lamar Blvd)',
      departure: '10:15 AM', 
      arrival: '01:15 PM', 
      returnDeparture: '02:00 PM',
      pricePerSeat: 35.00, 
      availableSeats: 5, 
      totalSeats: 6,
      amenities: ['Wi-Fi', 'USB Power', 'AC']
    },
    { 
      id: 'VL-103-A', 
      from: 'Los Angeles', 
      fromHub: 'Target (7th St Hub)',
      to: 'Las Vegas', 
      toHub: 'Walmart (W. Charleston Blvd)',
      departure: '09:00 AM', 
      arrival: '01:45 PM', 
      returnDeparture: '02:30 PM',
      pricePerSeat: 85.00, 
      availableSeats: 1, 
      totalSeats: 6,
      amenities: ['Starlink Wi-Fi', 'Premium Cabin', 'Meal Service']
    }
  ];

  const handleBook = (route: LongRoute) => {
    alert(`Seat reserved on ${route.id}. \nPickup: ${route.fromHub}\nDropoff: ${route.toHub}\n\nOur drivers take a mandatory 45-minute safety refreshment break at the destination before return legs.`);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-slide-up">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <i className="fas fa-arrow-left text-gray-400"></i>
          </button>
          <div>
            <h2 className="font-black text-sm uppercase tracking-widest text-gray-800">VeloGO Long</h2>
            <p className="text-[8px] font-black text-veloRed uppercase tracking-widest">Safety Hub Inter-City Network</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl border-b-4 border-veloGold">
          <div className="relative z-10">
            <h3 className="font-black text-lg text-veloGold italic">Security First Corridors.</h3>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed font-medium">
              All trips start and end at high-visibility Safety Hubs (Walmart, Target, Whole Foods) with 24/7 security and parking lot lighting.
            </p>
          </div>
          <i className="fas fa-shield-halved absolute -bottom-6 -right-4 text-white/5 text-9xl"></i>
        </div>

        <div className="flex gap-2">
          {['ALL', 'RETURNING'].map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                activeFilter === f ? 'bg-veloRed text-white' : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {f === 'RETURNING' ? 'Return Legs' : 'All Routes'}
            </button>
          ))}
        </div>

        <div className="space-y-4 pb-24">
          {routes.map(route => (
            <div 
              key={route.id} 
              className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{route.id}</span>
                    <span className="text-[7px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-black uppercase">Secure Hub Pick-up</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-black text-gray-800">{route.departure}</p>
                    <i className="fas fa-arrow-right text-gray-300 text-[10px]"></i>
                    <p className="text-sm font-black text-gray-800">{route.arrival}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-gray-800">${route.pricePerSeat.toFixed(2)}</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">per seat</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-4 border-veloRed bg-white"></div>
                    <div className="w-[1px] h-8 bg-gray-100"></div>
                    <div className="w-4 h-4 rounded-full border-4 border-gray-800 bg-white"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-gray-800 uppercase tracking-tight">{route.from}</p>
                      <p className="text-[10px] text-gray-500 font-medium italic">{route.fromHub}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-800 uppercase tracking-tight">{route.to}</p>
                      <p className="text-[10px] text-gray-500 font-medium italic">{route.toHub}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-2xl mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase">Return Connection</p>
                  <p className="text-[10px] font-bold text-gray-700">Departs {route.returnDeparture}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-gray-400 uppercase">Driver Safety Break</p>
                  <p className="text-[10px] font-bold text-veloRed">45 MIN REST</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[...Array(route.totalSeats)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full border border-white ${i < (route.totalSeats - route.availableSeats) ? 'bg-gray-300' : 'bg-green-400'}`}></div>
                    ))}
                  </div>
                  <span className="text-[8px] font-black text-gray-400 uppercase">{route.availableSeats} Available</span>
                </div>
                <button 
                  onClick={() => handleBook(route)}
                  className="bg-veloRed text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-veloRed/10"
                >
                  Confirm Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
