export const getShippingDays = (method) => {
  const shippingDaysMap = {
    "Free Standard Shipping": "2 business days",
    "USPS Ground Advantage": "2 business days",
    "USPS Priority Mail": "2 business days",
    "UPS Ground": "2 business days",
    "UPS Ground Saver": "3 to 4 business days",
  };

  return shippingDaysMap[method] || "Unknown delivery time";
};
