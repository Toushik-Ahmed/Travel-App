'use client';
import ItineraryForm from '@/components/components/IteneraryForm';
import ItineraryList from '@/components/components/itineraryList';
import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Map = dynamic(() => import('@/components/components/Map'), {
  ssr: false,
});

const OPENCAGE_API_KEY = '398ccc6a3eec49eba2effa5148e6ab45'; // Replace with your actual API key

const isValidCoordinate = (coord: number): boolean => {
  return typeof coord === 'number' && !isNaN(coord) && isFinite(coord);
};

const geocodeAddress = async (
  address: string
): Promise<[number, number] | null> => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${OPENCAGE_API_KEY}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      if (isValidCoordinate(lat) && isValidCoordinate(lng)) {
        return [lat, lng];
      }
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

const HomePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [destinations, setDestinations] = useState<[number, number][]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<any | null>(null);

  const itineraries = useSelector(
    (state: RootState) => state.itinerary.itineraries || []
  );

  const handleAddNewItinerary = () => {
    setShowForm(true);
  };

  const toggleMapVisibility = async (itinerary: any) => {
    if (selectedItinerary && selectedItinerary.id === itinerary.id) {
      setShowMap(false);
      setSelectedItinerary(null);
    } else {
      setShowMap(true);
      setSelectedItinerary(itinerary);

      const geocodedDestinations = await Promise.all(
        itinerary.destinations.map((dest: string) => geocodeAddress(dest))
      );

      const validDestinations = geocodedDestinations.filter(
        (coord): coord is [number, number] => coord !== null
      );
      setDestinations(validDestinations);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end">
        <Button
          className="mb-4 flex justify-end"
          onClick={handleAddNewItinerary}
        >
          Add New Itinerary
        </Button>
      </div>

      {showForm && <ItineraryForm onClose={() => setShowForm(false)} />}
      <ItineraryList
        onToggleMap={toggleMapVisibility}
        selectedItinerary={selectedItinerary}
      />

      {showMap && selectedItinerary && (
        <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
          <Map destinations={destinations} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
