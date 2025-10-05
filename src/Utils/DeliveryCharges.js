function calculateDeliveryCharges(area = "") {
  const charges = {
    madhuban: 0,
    colony: 0,
    daha: 0,
    bazida: 0,
    "uncha smana": 0,
    "arpana hospital": 0,
  };
  const key = area.trim().toLowerCase();
  return charges[key] || 0;
}

module.exports = calculateDeliveryCharges;
