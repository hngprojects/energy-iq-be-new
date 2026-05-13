/**
 * Shared contracts that every inverter adapter must satisfy.
 * Brand-specific raw API response types live in their own files (victron.types.ts, growatt.types.ts).
 */

/**
 * Normalised system info returned by every adapter's verifyAndGet*System() method.
 * Fields that a brand's API does not expose are nullable — callers must handle null.
 */
export interface VerifiedSystem {
  model: string;
  serialNumber: string;
  installationId: string; // plant/site-level ID (used as the system identifier)
  brandDeviceId?: string; // device-level ID where the brand distinguishes plant vs device (e.g. Growatt device_sn)
  ratedCapacityKwh: number;
  timezone: string | null; // Growatt v1 does not return timezone
  isOnGrid: boolean | null; // Growatt v1 does not return grid status
  hasGenerator: boolean;
  mqttHost: string | null; // Victron-specific; null for all other brands
}

/**
 * Normalised real-time metric returned by every adapter's fetchMetrics() method.
 *
 * Units:
 *   - All power values are in kW (adapters must convert W → kW before returning)
 *   - All energy values are in kWh
 *   - Voltage in V, current in A, temperature in °C, frequency in Hz
 *
 * Fields that a brand's API does not expose are typed as `number | null`.
 * `inverterId` is populated by the service layer after the adapter returns, not by the adapter itself.
 */
export interface NormalisedMetric {
  // --- identity / timing ---
  inverterId: string;
  recordedAt: string; // ISO 8601 UTC string

  // --- status ---
  inverterStatus: string; // normalised: 'normal' | 'standby' | 'fault' | 'unknown'

  // --- power (kW) ---
  solarPowerKw: number | null;
  acOutputPowerKw: number | null;

  // --- grid ---
  gridVoltageV: number | null;
  gridFrequencyHz: number | null;

  // --- battery ---
  batterySoc: number | null; // % — null when no battery or brand doesn't expose it
  batteryVoltageV: number | null;
  batteryCurrentA: number | null; // Victron only
  batteryTemperatureC: number | null; // Victron only
  batteryTimeToGoMin: number | null; // Victron only

  // --- thermal ---
  inverterTemperatureC: number | null;

  // --- PV strings (kW) ---
  pvString1PowerKw: number | null;
  pvString2PowerKw: number | null;

  // --- daily totals (kWh) ---
  energyGeneratedTodayKwh: number | null;
  totalEnergyGeneratedKwh: number | null;
  batteryChargedTodayKwh: number | null;
  batteryDischargedTodayKwh: number | null;
  gridExportTodayKwh: number | null;
  gridImportTodayKwh: number | null;
}
