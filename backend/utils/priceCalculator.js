export const getDays = (startDate, endDate) => {
  const s = new Date(startDate + "T00:00:00");
  const e = new Date(endDate + "T00:00:00");
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
};

export const calculateBookingPrice = ({
  consoleType,
  rentalStartDate,
  rentalEndDate,
  hours = 0,
  noOfControllers = 1,
}) => {
  const PRICING = {
    ps4: { hourly: 40, daily: 399 },
    ps5: { hourly: 60, daily: 499 },
  };

  const type = consoleType.toLowerCase();
  hours = Number(hours);
  noOfControllers = Number(noOfControllers);

  if (!PRICING[type]) {
    throw new Error("Invalid console type");
  }

  const start = new Date(rentalStartDate);
  const end = new Date(rentalEndDate);

  const isSameDay =
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCDate() === end.getUTCDate();

  let total = 0;
  const extraControllers = Math.max(noOfControllers - 1, 0);

  // ✅ SAME DAY → HOURLY
  if (isSameDay) {
    total += hours * PRICING[type].hourly;

    if (extraControllers > 0) {
      if (hours <= 3) total += 50;
      else if (hours <= 6) total += 75;
      else total += 100;
    }
  }
  // ✅ MULTI DAY → DAILY
  else {
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    total += days * PRICING[type].daily;

    if (extraControllers > 0) {
      total += days * extraControllers * 100;
    }
  }

  return total;
};
