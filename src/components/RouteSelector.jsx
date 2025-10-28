import { useState } from "react";

const DAYS = ["today", "yesterday", "3daysAgo"];
const TYPES = ["wireless", "manual"];

export default function RouteSelector({ onSelectRoute }) {
  const [selectedDay, setSelectedDay] = useState("today");
  const [selectedType, setSelectedType] = useState("wireless");

  const handleShowClick = () => {
    onSelectRoute({ day: selectedDay, type: selectedType });
  };

  const formatDayLabel = (day) =>
    day === "3daysAgo"
      ? "3 Days Back"
      : day.charAt(0).toUpperCase() + day.slice(1);
  const formatTypeLabel = (type) =>
    type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="absolute top-4 left-4 z-1000 p-4 bg-white shadow-xl rounded-lg w-full max-w-xs md:max-w-sm space-y-3">
      <h2 className="font-bold text-lg">Select Route</h2>

      <div className="flex gap-2">
        {DAYS.map((day) => (
          <button
            key={day}
            className={`px-3 py-1 rounded-lg border ${
              selectedDay === day
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setSelectedDay(day)}
          >
            {formatDayLabel(day)}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {TYPES.map((type) => (
          <button
            key={type}
            className={`px-3 py-1 rounded-lg border ${
              selectedType === type
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setSelectedType(type)}
          >
            {formatTypeLabel(type)}
          </button>
        ))}
      </div>

      <button
        onClick={handleShowClick}
        className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
      >
        Show
      </button>
    </div>
  );
}
