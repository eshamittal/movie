import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CityOption {
  id: string;
  name: string;
  state: string;
  theatresCount: number;
  popular: boolean;
}

export const AVAILABLE_CITIES: CityOption[] = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', theatresCount: 42, popular: true },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', theatresCount: 38, popular: true },
  { id: 'delhi', name: 'Delhi NCR', state: 'Delhi', theatresCount: 56, popular: true },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', theatresCount: 34, popular: true },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', theatresCount: 29, popular: true },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', theatresCount: 24, popular: true },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', theatresCount: 27, popular: true },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', theatresCount: 21, popular: false },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab', theatresCount: 16, popular: false },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', theatresCount: 18, popular: false },
];

interface LocationContextType {
  selectedCity: string;
  setSelectedCity: (cityName: string) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  detectUserLocation: () => Promise<string>;
  isDetecting: boolean;
  locationStatus: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    return localStorage.getItem('imovies_user_city') || 'Mumbai';
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    localStorage.setItem('imovies_user_city', city);
    setIsLocationModalOpen(false);
  };

  const detectUserLocation = async (): Promise<string> => {
    setIsDetecting(true);
    setLocationStatus('Locating nearby cinemas...');

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationStatus('Geolocation not supported by browser.');
        setIsDetecting(false);
        resolve(selectedCity);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Estimate closest metro city based on coordinate distance
          const cityCoords: Record<string, { lat: number; lon: number }> = {
            'Mumbai': { lat: 19.0760, lon: 72.8777 },
            'Bangalore': { lat: 12.9716, lon: 77.5946 },
            'Delhi NCR': { lat: 28.7041, lon: 77.1025 },
            'Hyderabad': { lat: 17.3850, lon: 78.4867 },
            'Chennai': { lat: 13.0827, lon: 80.2707 },
            'Pune': { lat: 18.5204, lon: 73.8567 },
            'Kolkata': { lat: 22.5726, lon: 88.3639 },
          };

          let closestCity = 'Mumbai';
          let minDistance = Infinity;

          for (const [cityName, coords] of Object.entries(cityCoords)) {
            const d = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lon - coords.lon, 2));
            if (d < minDistance) {
              minDistance = d;
              closestCity = cityName;
            }
          }

          setLocationStatus(`Location detected: ${closestCity}`);
          setSelectedCity(closestCity);
          setIsDetecting(false);
          resolve(closestCity);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          // Graceful fallback to Mumbai or existing city
          setLocationStatus('Could not detect exact GPS. Defaulting to Mumbai.');
          setSelectedCity('Mumbai');
          setIsDetecting(false);
          resolve('Mumbai');
        },
        { timeout: 8000 }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        isLocationModalOpen,
        setIsLocationModalOpen,
        detectUserLocation,
        isDetecting,
        locationStatus,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
