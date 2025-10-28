// src/components/VehicleMap.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Controls from "./Controls";
import { calculateSpeedKmH } from "../utils/calculateSpeed";
import "leaflet/dist/leaflet.css";

// Vehicle icon
const vehicleIcon = new L.DivIcon({
  className: "text-2xl",
  html: "🚗",
  iconSize: [24, 24],
});

export default function VehicleMap({ routeData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Reset simulation when routeData changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, [routeData]);

  // Play/pause interval to update currentIndex
  useEffect(() => {
    if (
      isPlaying &&
      routeData.length > 0 &&
      currentIndex < routeData.length - 1
    ) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, routeData.length - 1));
      }, 2000); // 2 seconds per point
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentIndex, routeData]);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const currentPosition = routeData[currentIndex] || {};
  const speed = calculateSpeedKmH(currentIndex, routeData); // pass to Controls

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={
          currentPosition.lat
            ? [currentPosition.lat, currentPosition.lng]
            : [17.385044, 78.486671]
        }
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Traveled route */}
        {routeData.length > 0 && (
          <Polyline
            positions={routeData
              .slice(0, currentIndex + 1)
              .map((p) => [p.lat, p.lng])}
            pathOptions={{ color: "red", weight: 4 }}
          />
        )}

        {/* Vehicle marker */}
        {currentPosition.lat && (
          <AnimatedMarker
            position={[currentPosition.lat, currentPosition.lng]}
            icon={vehicleIcon}
            isPlaying={isPlaying}
          />
        )}
      </MapContainer>

      {/* Controls */}
      <Controls
        currentPosition={currentPosition}
        currentIndex={currentIndex}
        routeData={routeData}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        resetSimulation={resetSimulation}
        speed={speed}
      />
    </div>
  );
}

// AnimatedMarker component
function AnimatedMarker({ position, icon, isPlaying, duration = 1800 }) {
  const markerRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (!markerRef.current) return;
    const marker = markerRef.current;

    const start = marker.getLatLng();
    const end = L.latLng(position);
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min(1, (time - startTime) / duration);
      const lat = start.lat + (end.lat - start.lat) * progress;
      const lng = start.lng + (end.lng - start.lng) * progress;
      marker.setLatLng([lat, lng]);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Pan map smoothly if playing
    if (isPlaying) {
      map.panTo(end, { animate: true, duration: 1.2 });
    }
  }, [position, duration, map, isPlaying]);

  return <Marker ref={markerRef} position={position} icon={icon} />;
}
