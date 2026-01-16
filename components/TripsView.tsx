
import React from 'react';

export const TripsView: React.FC = () => {
  const trips = [
    { id: 'T-9821', date: 'Today, 2:30 PM', from: '3719 Holliday RD', to: 'Dallas Love Field Airport', fare: '$42.50', status: 'Upcoming', type: 'Premium' },
    { id: 'T-9710', date: 'Nov 24, 2025', from: 'The Joule, Main St', to: 'Holliday RD', fare: '$28.00', status: 'Completed', type: 'Standard' },
    { id: 'T-9655', date: 'Nov 22, 2025', from: 'NorthPark Center', to: 'Bishop Arts District', fare: '$19.20', status: 'Completed', type: 'Standard' },
  ];

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase tracking-tight">Your Trips</h2>
        <button className="bg-veloRed/10 text-veloRed text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Export History
        </button>
      </div>

      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            {trip.status === 'Upcoming' && (
              <div className="absolute top-0 right-0 bg-veloGold text-black text-[8px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                Upcoming
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{trip.date}</p>
                <p className="text-xs font-black text-gray-800 mt-1">ID: {trip.id}</p>
              </div>
              <p className="text-lg font-black text-gray-800">{trip.fare}</p>
            </div>

            <div className="space-y-3 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-100"></div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-4 border-veloRed bg-white z-10"></div>
                <p className="text-xs font-medium text-gray-600 truncate">{trip.from}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-4 border-gray-800 bg-white z-10"></div>
                <p className="text-xs font-medium text-gray-800 truncate">{trip.to}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <i className="fas fa-car mr-1"></i> {trip.type}
              </span>
              <button className="text-veloRed font-bold text-xs hover:underline">
                {trip.status === 'Upcoming' ? 'Manage' : 'View Receipt'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-black text-lg">Planning ahead?</h3>
          <p className="text-xs text-gray-400 mt-1 mb-4">Schedule your next private ride up to 30 days in advance.</p>
          <button className="bg-veloGold text-black font-black text-xs px-6 py-3 rounded-xl uppercase tracking-widest active:scale-95 transition-transform">
            Schedule a Velo
          </button>
        </div>
        <i className="fas fa-calendar-alt absolute -bottom-4 -right-4 text-white/5 text-8xl"></i>
      </div>
    </div>
  );
};
