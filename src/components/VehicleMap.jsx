import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const vehicleIcon = new L.DivIcon({
  className: "text-2xl",
  html: "🚗",
  iconSize: [24, 24],
});

export default function VehicleMap({
  routeData,
  currentIndex,
  setCurrentIndex,
  isPlaying,
}) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && routeData.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < routeData.length - 1) return prev + 1;
          clearInterval(intervalRef.current);
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, routeData, setCurrentIndex]);

  const currentPosition = routeData[currentIndex] || {};

  return (
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

      {routeData.length > 0 && (
        <Polyline
          positions={routeData
            .slice(0, currentIndex + 1)
            .map((p) => [p.lat, p.lng])}
          pathOptions={{ color: "red", weight: 4 }}
        />
      )}

      {currentPosition.lat && (
        <AnimatedMarker
          position={[currentPosition.lat, currentPosition.lng]}
          icon={vehicleIcon}
          isPlaying={isPlaying}
        />
      )}
    </MapContainer>
  );
}

function AnimatedMarker({ position, icon, isPlaying, duration = 900 }) {
  const markerRef = useRef(null);
  const map = useMap();
  const prevPosRef = useRef(position);

  useEffect(() => {
    if (!markerRef.current) return;
    const marker = markerRef.current;

    const start = L.latLng(prevPosRef.current);
    const end = L.latLng(position);
    prevPosRef.current = position;

    let startTime;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min(1, (time - startTime) / duration);
      const lat = start.lat + (end.lat - start.lat) * progress;
      const lng = start.lng + (end.lng - start.lng) * progress;
      marker.setLatLng([lat, lng]);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    if (isPlaying) {
      map.panTo(end, { animate: true, duration: 1.2 });
    }
  }, [position, duration, map, isPlaying]);

  return <Marker ref={markerRef} position={position} icon={icon} />;
}
