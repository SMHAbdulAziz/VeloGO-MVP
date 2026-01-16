
import React from 'react';

interface SupportDetailViewProps {
  category: string;
  onBack: () => void;
}

export const SupportDetailView: React.FC<SupportDetailViewProps> = ({ category, onBack }) => {
  const renderContent = () => {
    switch (category) {
      case 'Membership':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-sm uppercase mb-4 text-veloRed">Association Status</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Your VeloGO membership is active through Dec 2025. As a private association member, you have exclusive access to our vetting protocols.</p>
              <div className="mt-4 p-4 bg-green-50 rounded-2xl flex items-center gap-3">
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="text-[10px] font-bold text-green-700 uppercase">Background Check Cleared</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Common Questions</h4>
              <div className="bg-white rounded-2xl divide-y divide-gray-50 border border-gray-100">
                <button className="w-full text-left p-4 text-xs font-bold flex justify-between">How to renew? <i className="fas fa-chevron-right text-gray-200"></i></button>
                <button className="w-full text-left p-4 text-xs font-bold flex justify-between">Guest membership rules <i className="fas fa-chevron-right text-gray-200"></i></button>
              </div>
            </div>
          </div>
        );
      case 'Safety & Privacy':
        return (
          <div className="space-y-6">
            <div className="bg-veloRed text-white p-6 rounded-3xl shadow-xl">
              <h3 className="font-black text-sm uppercase mb-2">Privacy Shield 2.0</h3>
              <p className="text-xs text-white/80 leading-relaxed">We blur your exact pickup and drop-off coordinates for the first 0.5 miles of every trip. Only you see the precise location.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                <i className="fas fa-video text-gray-400"></i>
                <span className="text-xs font-bold">Cloud Recording Active</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                <i className="fas fa-phone-slash text-gray-400"></i>
                <span className="text-xs font-bold">Anonymized Calling</span>
              </div>
            </div>
          </div>
        );
      case 'Billing':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-sm uppercase mb-4">Stripe Integration</h3>
              <p className="text-xs text-gray-600 leading-relaxed">All transactions are processed via Stripe. VeloGO never stores your full card details on our local servers.</p>
              <button className="mt-4 text-veloRed text-xs font-bold underline">Update Payment in Wallet</button>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase text-gray-400 mb-2">Fare Breakdown Policy</h4>
              <ul className="text-[10px] space-y-2 text-gray-600 list-disc pl-4">
                <li>Base membership fee applies to all trips.</li>
                <li>Dynamic pricing is disabled for VeloGO Elite members.</li>
                <li>Processing fees are set by Stripe.</li>
              </ul>
            </div>
          </div>
        );
      case 'Rider Guide':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100">
                <h3 className="font-black text-sm uppercase mb-2">1. Requesting a Ride</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Enter your destination, select your vehicle class, and confirm the fare. All fares are locked at the time of booking.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100">
                <h3 className="font-black text-sm uppercase mb-2">2. The VeloCode</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Always provide the 2-digit code shown in your app to the driver before entering the vehicle.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100">
                <h3 className="font-black text-sm uppercase mb-2">3. Professional Conduct</h3>
                <p className="text-xs text-gray-600 leading-relaxed">VeloGO is a private association. Respect for both riders and drivers is mandatory for membership retention.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
          <i className="fas fa-arrow-left text-gray-400"></i>
        </button>
        <h2 className="font-black text-sm uppercase tracking-widest">{category}</h2>
      </div>
      {renderContent()}
    </div>
  );
};
