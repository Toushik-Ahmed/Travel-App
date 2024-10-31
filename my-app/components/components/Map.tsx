'use client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

type MapProps = {
  destinations: [number, number][];
};

const Map: React.FC<MapProps> = ({ destinations }) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    []
  );
  const [totalDistance, setTotalDistance] = useState<number | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (destinations.length < 2) return;

      const coordinatesString = destinations
        .map((coord) => `${coord[1]},${coord[0]}`)
        .join(';');

      const url = `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          setRouteCoordinates(
            data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]]
            )
          );
          setTotalDistance(data.routes[0].distance); // Distance in meters
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, [destinations]);

  if (destinations.length === 0) {
    return <div>No destinations to display</div>;
  }

  const bounds = L.latLngBounds(destinations);

  // display distance
  const DistanceControl = () => {
    return (
      <div className="leaflet-bottom leaflet-left">
        <div
          className="leaflet-control leaflet-bar"
          style={{ backgroundColor: 'white', padding: '5px', margin: '10px' }}
        >
          {totalDistance !== null ? (
            <span>Total Distance: {(totalDistance / 1000).toFixed(2)} km</span>
          ) : (
            <span>Calculating distance...</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <MapContainer bounds={bounds} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {destinations.map((point, index) => (
        <Marker key={index} position={point}>
          <Popup>{`Destination ${index + 1}`}</Popup>
        </Marker>
      ))}
      <Polyline positions={routeCoordinates} color="blue" />
      <DistanceControl />
    </MapContainer>
  );
};

export default Map;
