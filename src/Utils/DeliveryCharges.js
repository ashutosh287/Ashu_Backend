/**
 * Calculates delivery charges based on area.
 * 
 * @param {string} area - The delivery area (e.g., "Madhuban", "Colony").
 * @returns {number} - Delivery charge for the given area. Returns 0 if area not matched.
 */
function calculateDeliveryCharges(area = "") {
  if (!area || typeof area !== "string") return 0;

  // Mapping of areas to delivery charges
  const charges = {
    madhuban: 20,
    colony: 20,
    daha: 30,
    bazida: 50,
    "uncha smana": 50,
    "arpana hospital": 50,
  };

  // Normalize input: trim spaces and lowercase
  const key = area.trim().toLowerCase();

  // Return the charge if area exists, else 0
  return charges[key] || 0;
}

module.exports = calculateDeliveryCharges;
