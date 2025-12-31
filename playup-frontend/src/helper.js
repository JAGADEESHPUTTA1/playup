export const getDays = (startDate, endDate) => {
    const s = new Date(startDate + "T00:00:00");
    const e = new Date(endDate + "T00:00:00");
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

export const calculateBookingPrice = ({
    consoleType,
    startDate,
    endDate,
    hours = 0,
    extraControllers = 0,
  }) => {
    const PRICING = {
      ps4: { hourly: 40, daily: 399 },
      ps5: { hourly: 60, daily: 499 },
    };

    let total = 0;

    // SAME DAY → HOURLY
    if (startDate === endDate) {
      total += hours * PRICING[consoleType].hourly;

      // controller pricing
      if (extraControllers > 0) {
        if (hours <= 3) total += 50;
        else if (hours <= 6) total += 75;
        else total += 100;
      }
    }

    // MULTI DAY → DAILY
    else {
      const days = getDays(startDate, endDate);
      total += days * PRICING[consoleType].daily;

      if (extraControllers > 0) {
        total += days * 100;
      }
    }

    return total;
  };