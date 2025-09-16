function calculateDeliveryCharges(area = "") {
  const charges = {
    madhuban: 20,
    colony: 20,
    daha: 30,
    bazida: 50,
    "uncha smana": 50,
    "arpana hospital": 50,
  };
  const key = area.trim().toLowerCase();
  return charges[key] || 0;
}

module.exports = calculateDeliveryCharges;
