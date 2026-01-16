
import React, { useState, useEffect, useRef } from 'react';

declare const google: any;

export const RiderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('standard');
  const [isSearching, setIsSearching] = useState(false);
  const [driverStatus, setDriverStatus] = useState<'IDLE' | 'MATCHING' | 'PRIVACY_DELAY' | 'EN_ROUTE'>('IDLE');
  const [eta, setEta] = useState<number | null>(null);
  const [pickupAddress, setPickupAddress] = useState('3719 Holliday RD, Dallas, TX 75224');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [matchFound, setMatchFound] = useState(false);
  const [sharedSavings, setSharedSavings] = useState(0);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const initGoogleFeatures = () => {
    if (typeof google !== 'undefined' && mapRef.current && !mapLoaded) {
      try {
        const dallas = { lat: 32.7767, lng: -96.7970 };
        const map = new google.maps.Map(mapRef.current, {
          center: dallas,
          zoom: 14,
          disableDefaultUI: true,
          styles: [
            { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#7c93a3" }] },
            { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] }
          ]
        });

        const setupAutocomplete = (inputRef: React.RefObject<HTMLInputElement>, setter: (val: string) => void) => {
          if (inputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(inputRef.current);
            autocomplete.bindTo('bounds', map);
            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place.geometry && place.geometry.location) {
                map.setCenter(place.geometry.location);
                map.setZoom(15);
                setter(place.formatted_address || "");
              }
            });
          }
        };

        setupAutocomplete(pickupInputRef, setPickupAddress);
        setupAutocomplete(destInputRef, setDestinationAddress);

        setMapLoaded(true);
      } catch (error) {
        console.error("Error initializing Google Maps features:", error);
      }
    }
  };

  useEffect(() => {
    if (typeof google !== 'undefined') {
      initGoogleFeatures();
    } else {
      window.addEventListener('google-maps-loaded', initGoogleFeatures);
    }
    return () => window.removeEventListener('google-maps-loaded', initGoogleFeatures);
  }, []);

  const handleBookRide = () => {
    setIsSearching(true);
    
    if (activeTab === 'shared') {
      setDriverStatus('MATCHING');
      setTimeout(() => {
        const isMatched = Math.random() > 0.3;
        setIsSearching(false);
        if (isMatched) {
          setMatchFound(true);
          const savings = Math.floor(Math.random() * (35 - 25 + 1)) + 25;
          setSharedSavings(savings);
          proceedToTrip();
        } else {
          setMatchFound(false);
          alert("No shared match found. Proceeding with solo trip at standard rate.");
          setActiveTab('standard');
          setDriverStatus('IDLE');
        }
      }, 3000);
    } else {
      setTimeout(() => {
        setIsSearching(false);
        proceedToTrip();
      }, 2000);
    }
  };

  const proceedToTrip = () => {
    setDriverStatus('PRIVACY_DELAY');
    setTimeout(() => {
      setDriverStatus('EN_ROUTE');
      setEta(Math.floor(Math.random() * 8) + 2);
    }, 4000);
  };

  const getPrice = (type: string) => {
    const prices: Record<string, number> = {
      shared: 18.50,
      standard: 24.50,
      premium: 42.00,
      xl: 38.00
    };
    return prices[type].toFixed(2);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <div className="bg-white shadow-lg rounded-2xl p-3 flex items-center border border-gray-100 ring-1 ring-black/5">
          <i className="fas fa-location-dot text-veloRed mr-3 w-4 text-center"></i>
          <input 
            ref={pickupInputRef}
            type="text" 
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Pickup location" 
            className="w-full focus:outline-none text-sm font-medium text-gray-700 bg-transparent"
          />
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-3 flex items-center border border-gray-100 ring-1 ring-black/5">
          <i className="fas fa-flag-checkered text-gray-400 mr-3 w-4 text-center"></i>
          <input 
            ref={destInputRef}
            type="text" 
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="Where to?" 
            className="w-full focus:outline-none text-sm font-medium text-gray-700 bg-transparent"
          />
        </div>
      </div>

      <div className="w-full h-72 bg-gray-200 rounded-[2rem] relative overflow-hidden shadow-inner border-2 border-white">
        <div ref={mapRef} className="w-full h-full" />
        
        {driverStatus === 'MATCHING' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
            <div className="w-12 h-12 border-4 border-veloGold border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black text-[10px] uppercase tracking-widest">Finding Co-Riders...</p>
          </div>
        )}

        {driverStatus === 'EN_ROUTE' && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white flex justify-between items-center animate-slide-up">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-veloRed text-white rounded-xl flex items-center justify-center">
                 <i className="fas fa-car-side"></i>
               </div>
               <div>
                 <p className="text-[8px] text-gray-400 uppercase font-black">Driver En Route</p>
                 <p className="text-lg font-black text-gray-800">{eta} MINS</p>
               </div>
             </div>
             <div className="text-right">
               <p className="text-xs font-black text-gray-800">Marcus • 4.8★</p>
               <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Toyota Camry</p>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { id: 'shared', label: 'Shared', icon: 'fa-users' },
          { id: 'standard', label: 'Solo', icon: 'fa-user' },
          { id: 'xl', label: 'XL', icon: 'fa-truck-pickup' },
          { id: 'premium', label: 'Elite', icon: 'fa-gem' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveTab(type.id)}
            disabled={driverStatus !== 'IDLE'}
            className={`py-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
              activeTab === type.id 
                ? 'border-veloRed bg-veloRed text-white shadow-md' 
                : 'border-white bg-white text-gray-400 opacity-90'
            }`}
          >
            <i className={`fas ${type.icon} text-xs mb-1`}></i>
            <span className="text-[8px] font-black uppercase tracking-tighter">{type.label}</span>
            <span className={`text-[9px] font-bold ${activeTab === type.id ? 'text-white' : 'text-gray-800'}`}>${getPrice(type.id)}</span>
          </button>
        ))}
      </div>

      <button 
        disabled={isSearching || driverStatus !== 'IDLE'}
        onClick={handleBookRide}
        className="w-full py-5 rounded-2xl bg-veloRed text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 tracking-[0.2em]"
      >
        {isSearching ? <i className="fas fa-circle-notch fa-spin"></i> : `REQUEST ${activeTab.toUpperCase()}`}
      </button>

      {activeTab === 'shared' && driverStatus === 'IDLE' && (
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
          <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
          <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
            <strong>Shared Logic:</strong> Splits cost with matches. You save 25-35% ONLY if another rider is found. If no match occurs, you'll be charged standard rates.
          </p>
        </div>
      )}
    </div>
  );
};
