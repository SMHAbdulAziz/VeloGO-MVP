
import React from 'react';
import { UserRole } from '../types';
import { MOCK_RIDER, MOCK_DRIVER } from '../constants';

interface ProfileViewProps {
  role: UserRole;
  onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ role, onBack }) => {
  const user = role === UserRole.RIDER ? MOCK_RIDER : MOCK_DRIVER;

  return (
    <div className="p-6 space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-veloRed transition-colors">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h2 className="font-bold text-lg uppercase tracking-widest">Member Profile</h2>
        <div className="w-6"></div>
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-gray-800 tracking-tight">{user.name}</h3>
          <p className="text-xs font-bold text-veloRed uppercase tracking-widest mt-1">
            Verified {role === UserRole.RIDER ? 'Member' : 'Professional Driver'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Rating</p>
          <p className="text-lg font-black text-gray-800">{user.rating} <i className="fas fa-star text-veloGold text-xs"></i></p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Trips</p>
          <p className="text-lg font-black text-gray-800">{user.tripsCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Years</p>
          <p className="text-lg font-black text-gray-800">{new Date().getFullYear() - user.memberSince}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-gray-800 px-1 text-sm uppercase tracking-wider">Membership Credentials</h4>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-id-card text-gray-400"></i>
              <span className="text-sm font-medium">Background Check</span>
            </div>
            <i className="fas fa-check-circle text-green-500"></i>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-shield-heart text-gray-400"></i>
              <span className="text-sm font-medium">Safety Training</span>
            </div>
            <i className="fas fa-check-circle text-green-500"></i>
          </div>
          {role === UserRole.DRIVER && (
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className="fas fa-file-contract text-gray-400"></i>
                <span className="text-sm font-medium">Independent Contractor Agreement</span>
              </div>
              <i className="fas fa-check-circle text-green-500"></i>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <button className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm active:bg-gray-200 transition-colors uppercase tracking-widest">
          Edit Profile Information
        </button>
      </div>
    </div>
  );
};
