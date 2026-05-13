/**
 * Growatt OpenAPI v1 response types.
 *
 * NOTE: The exact shape of /v1/plant/list and /v1/device/list is unconfirmed
 * against the live API. The TRD shows a flat object; community implementations
 * suggest a data[] array. The adapter handles both shapes defensively.
 * Adjust once verified against a real token.
 */

// Fields present on a single plant record — used in both flat and array shapes
export interface GrowattPlant {
  plant_id: string;
  name: string;
  current_power: number; // kW — current output
  total_energy: number; // kWh — lifetime
  today_energy: number; // kWh — today
  peak_power: number; // kW — rated capacity
}

/**
 * GET /v1/plant/list
 * TRD shows flat: { error_code, plant_id, name, ... }
 * Community implementations suggest: { error_code, data: GrowattPlant[] }
 * Both shapes are handled in the adapter.
 */
export interface GrowattPlantListResponse extends Partial<GrowattPlant> {
  error_code: number;
  error_msg?: string;
  count?: number;
  data?: GrowattPlant[]; // present if API wraps in array
}

// Fields present on a single device record — used in both flat and array shapes
export interface GrowattDevice {
  device_id: string;
  device_sn: string;
  datalogger_sn: string;
  model: string;
  type: number; // 1 = inverter, 2 = storage, 3 = other
  manufacturer: string;
}

/**
 * GET /v1/device/list?plant_id={id}
 * Same ambiguity as plant/list — handled defensively in the adapter.
 */
export interface GrowattDeviceListResponse extends Partial<GrowattDevice> {
  error_code: number;
  count?: number;
  data?: GrowattDevice[]; // present if API wraps in array
}

/**
 * POST /v4/new-api/queryLastData — MIN series real-time data.
 * Numeric fields confirmed as numbers from TRD response payload.
 */
interface GrowattMinData {
  serialNum: string;
  time: string; // "YYYY-MM-DD HH:mm:ss"
  status: number; // 0: waiting, 1: normal, 2: fault
  statusText: string;
  ppv: number; // total PV input power (W)
  ppv1: number; // PV string 1 power (W)
  ppv2: number; // PV string 2 power (W)
  pac: number; // AC output power to loads (W)
  eacToday: number; // energy generated today (kWh)
  eacTotal: number; // lifetime energy generated (kWh)
  vac1: number; // grid voltage (V)
  fac: number; // grid frequency (Hz)
  temp1: number; // inverter temperature (°C)
  pf: number; // power factor
  etoUserToday: number; // daily energy from grid to user (kWh)
  etoGridToday: number; // daily energy from user to grid (kWh)
  // battery fields — only present on hybrid MIN models with battery attached
  bdc1Vbat?: number; // battery voltage from BDC (V)
  bdc1Soc?: number; // battery SoC from BDC (%)
  bmsSOC?: number; // battery SoC from BMS (%) — TRD uses bmsSOC
  bmsVbat?: number; // battery voltage from BMS (V)
  echargeToday?: number; // battery charged today (kWh)
  edischargeToday?: number; // battery discharged today (kWh)
}

export interface GrowattQueryLastDataResponse {
  code: number;
  message: string;
  data: {
    min: GrowattMinData[];
  };
}
