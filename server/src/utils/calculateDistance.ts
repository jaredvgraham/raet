export const calculateDistance = async (
  fromCoords: number[],
  toCoords: number[]
): Promise<number | null> => {
  try {
    const [lon1, lat1] = fromCoords;
    const [lon2, lat2] = toCoords;

    const R = 6371e3; // Radius of Earth in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters

    return distance / 1609.34; // Convert meters to miles
  } catch (error) {
    console.error("Error calculating distance:", error);
    return null;
  }
};
