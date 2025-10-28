function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  return Math.sqrt(dLat * dLat + dLon * dLon) * 111.32;
}

export function calculateSpeedKmH(currentIndex, routeData) {
  if (currentIndex === 0 || routeData.length <= 1) return 0;

  const currPoint = routeData[currentIndex];
  const prevPoint = routeData[currentIndex - 1];

  if (!prevPoint || !currPoint) return 0;

  const distanceKm = calculateDistanceKm(
    prevPoint.lat,
    prevPoint.lng,
    currPoint.lat,
    currPoint.lng
  );

  const timeDeltaMs =
    new Date(currPoint.timestamp).getTime() -
    new Date(prevPoint.timestamp).getTime();
  const timeDeltaHours = timeDeltaMs / (1000 * 60 * 60); // ms → hours

  if (timeDeltaHours <= 0) return 0;

  const speed = distanceKm / timeDeltaHours;
  return speed;
}
