
import React, { useState } from 'react';
import { MOCK_RIDER } from '../constants';

export const WalletView: React.FC = () => {
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const transactions = [
    { id: 'TX-11', type: 'Ride Payment', date: 'Today', amount: '-$42.50', method: '•••• 4242' },
    { id: 'TX-10', type: 'Credit Add', date: 'Nov 23', amount: '+$100.00', method: 'Stripe' },
    { id: 'TX-09', type: 'Ride Payment', date: 'Nov 21', amount: '-$15.20', method: '•••• 4242' },
  ];

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.toUpperCase().trim();
    
    if (code === 'VELOSAFE') {
      const membershipMonths = new Date().getFullYear() - MOCK_RIDER.memberSince;
      const rating = MOCK_RIDER.rating;

      // Rule: 4.0 or higher rating
      if (rating < 4.0) {
        setPromoError('Rating must be 4.0 or higher to use this code.');
        return;
      }

      // Rule: 6 months or more membership
      // In our mock, memberSince is a year. 2023 vs 2025 is definitely > 6 months.
      // A real app would use precise timestamps.
      if (membershipMonths < 1) { // Mock logic for "6 months"
         setPromoError('Membership tenure must be at least 6 months.');
         return;
      }

      // Rule: Once every 6 months (Simulated)
      setAppliedPromo('VELOSAFE');
      setPromoCode('');
      alert('VELOSAFE Applied! 30% discount will be applied to your next trip.');
    } else {
      setPromoError('Invalid promotion code.');
    }
  };

  return (
    <div className="p-6 space-y-8 animate-slide-up">
      {/* Wallet Balance Card */}
      <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-[10px] font-black text-veloGold uppercase tracking-[0.3em] mb-4">Velo Credits</p>
          <h2 className="text-5xl font-black tracking-tighter">$142.30</h2>
          <div className="mt-8 flex gap-3 w-full">
            <button className="flex-1 bg-white text-black font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
              Add Funds
            </button>
            <button className="flex-1 bg-white/10 text-white font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
              Send Credit
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-veloGold/5 rounded-full -mr-16 -mt-16"></div>
      </div>

      {/* Promotion Entry */}
      <div className="space-y-4">
        <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400 px-1">Promotions</h3>
        <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm space-y-3">
          <div className="flex gap-2">
            <input 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter Code (e.g. VELOSAFE)"
              className="flex-1 bg-gray-50 px-4 py-3 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-veloRed/20"
            />
            <button 
              onClick={handleApplyPromo}
              className="bg-veloRed text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
            >
              Apply
            </button>
          </div>
          {promoError && <p className="text-[10px] text-veloRed font-bold px-1">{promoError}</p>}
          {appliedPromo && (
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
               <span className="text-[10px] font-black text-green-700 uppercase">{appliedPromo} ACTIVE</span>
               <span className="text-[10px] font-bold text-green-600">30% OFF NEXT TRIP</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Payment Methods</h3>
          <button className="text-veloRed text-[10px] font-black uppercase tracking-widest">Add New</button>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-blue-800">
            <i className="fab fa-cc-visa text-2xl"></i>
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-gray-800">Visa Gold Card</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">•••• 4242 • Exp 12/26</p>
          </div>
          <div className="bg-green-50 text-green-600 px-2 py-1 rounded-md text-[8px] font-black uppercase">Primary</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 pb-10">
        <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400 px-1">Recent Activity</h3>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                  <i className={`fas ${tx.amount.startsWith('+') ? 'fa-arrow-down' : 'fa-shopping-bag'} text-sm`}></i>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-800">{tx.type}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{tx.date} • {tx.method}</p>
                </div>
              </div>
              <p className={`text-sm font-black ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-gray-800'}`}>
                {tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
