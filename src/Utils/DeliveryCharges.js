function calculateDeliveryCharges(areaName) {
  const charges = {
    madhuban: 20,
    colony: 20,
    daha: 30,
    bazida: 50,
    "uncha smana": 50,
    "arpana hospital": 50,
  };

  const area = areaName.toLowerCase().trim();
  return charges[area] || 0; // default 0 agar area na mile
}

module.exports = calculateDeliveryCharges;
