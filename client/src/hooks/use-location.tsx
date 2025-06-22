import { useState, useEffect, useCallback } from 'react';

interface LocationState {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  error?: string;
  loading: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({ loading: true });

  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({
        loading: false,
        error: 'Geolocation not supported'
      });
      return;
    }

    setLocation(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: undefined
        });
      },
      (error) => {
        let errorMessage = 'Location unavailable';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location timeout';
            break;
        }
        
        setLocation({
          loading: false,
          error: errorMessage
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  const formatLocation = () => {
    if (location.latitude && location.longitude) {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
    return location.error || 'Getting location...';
  };

  return {
    location,
    formatLocation,
    updateLocation,
    hasLocation: !!(location.latitude && location.longitude)
  };
}
