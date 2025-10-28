import { useState, useEffect } from "react";
import VehicleMap from "./components/VehicleMap";
import Controls from "./components/Controls";
import RouteSelector from "./components/RouteSelector";
import { calculateSpeedKmH } from "./utils/calculateSpeed";

function App() {
  const [routeData, setRouteData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState({
    day: "today",
    type: "wireless",
  });

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch("/dummy-routes.json");
        const data = await response.json();

        const { day, type } = selectedRoute;
        const jsonDay = day === "3daysAgo" ? "day3" : day;

        const filteredRoute = (data[jsonDay] || []).filter(
          (point) => point.type === type
        );

        setRouteData(
          filteredRoute.map((p) => ({
            lat: p.lat,
            lng: p.lng,
            timestamp: p.timestamp,
          }))
        );

        setCurrentIndex(0);
        setIsPlaying(false);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [selectedRoute]);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  return (
    <div className="h-screen w-full relative">
      <RouteSelector onSelectRoute={setSelectedRoute} />

      <VehicleMap
        routeData={routeData}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        isPlaying={isPlaying}
      />

      {routeData.length > 0 && (
        <Controls
          currentPosition={routeData[currentIndex]}
          speed={calculateSpeedKmH(currentIndex, routeData)}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          resetSimulation={resetSimulation}
        />
      )}
    </div>
  );
}

export default App;
