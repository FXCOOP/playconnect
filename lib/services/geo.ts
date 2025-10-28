/**
 * Geolocation Services
 * H3 geohashing, distance calculations, and privacy-preserving location handling
 */

import { latLngToCell, cellToLatLng, gridDisk } from 'h3-js';

export const H3_RESOLUTION = parseInt(process.env.GEOHASH_RESOLUTION || '7', 10);

/**
 * Convert lat/lng to H3 geohash
 */
export function coordinatesToH3(lat: number, lng: number, resolution: number = H3_RESOLUTION): string {
  return latLngToCell(lat, lng, resolution);
}

/**
 * Convert H3 geohash to approximate center lat/lng
 */
export function h3ToCoordinates(h3Index: string): { lat: number; lng: number } {
  const [lat, lng] = cellToLatLng(h3Index);
  return { lat, lng };
}

/**
 * Get neighboring H3 cells (hexagons) within k-ring distance
 */
export function getNeighborCells(h3Index: string, kRings: number = 1): string[] {
  return gridDisk(h3Index, kRings);
}

/**
 * Calculate Haversine distance between two lat/lng points in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Distance decay function for scoring
 * Returns 0-100 score, exponentially decaying with distance
 */
export function distanceToScore(distanceKm: number, maxRadiusKm: number = 10): number {
  if (distanceKm > maxRadiusKm) return 0;

  // Exponential decay: score = 100 * e^(-k * distance)
  // At maxRadius, score = 10
  const k = -Math.log(0.1) / maxRadiusKm;
  const score = 100 * Math.exp(-k * distanceKm);

  return Math.max(0, Math.min(100, score));
}

/**
 * Check if a point is within radius of another point
 */
export function isWithinRadius(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(lat1, lng1, lat2, lng2);
  return distance <= radiusKm;
}

/**
 * Get coarse location string for display (city-level)
 */
export function getCoarseLocationString(city: string, state?: string, country?: string): string {
  const parts = [city];
  if (state) parts.push(state);
  if (country && country !== 'US') parts.push(country);
  return parts.join(', ');
}

/**
 * Fuzzy location: only show approximate distance until mutual consent
 */
export function fuzzyDistance(distanceKm: number): string {
  if (distanceKm < 1) return 'Less than 1 km away';
  if (distanceKm < 3) return 'About 2 km away';
  if (distanceKm < 6) return 'About 5 km away';
  if (distanceKm < 10) return 'Within 10 km';
  if (distanceKm < 20) return 'Within 20 km';
  return 'Over 20 km away';
}

/**
 * Type definitions
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  h3Index: string;
}
