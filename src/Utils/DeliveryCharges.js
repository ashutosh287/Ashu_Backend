function calculateDeliveryCharges(area = "") {
  const charges = {
    madhuban: 20,
    colony: 20,
    daha: 20,
    bazida: 30,
    "uncha smana": 30,
    "arpana hospital": 30,
  };
  const key = area.trim().toLowerCase();
  return charges[key] || 0;
}

module.exports = calculateDeliveryCharges;
