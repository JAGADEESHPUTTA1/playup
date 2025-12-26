import { useState } from "react";
import { api } from "../services/api";
import TextField from "../components/TextField";
import "./styles.css";

export default function Book() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    consoleType: "PS5",
    noOfControllers: "1",
    rentalStartDate: "",
    rentalEndDate: "",
    rentalCost: "",
    paymentMode: "",
    hours: "",
  });

  const getDays = (startDate, endDate) => {
    const s = new Date(startDate + "T00:00:00");
    const e = new Date(endDate + "T00:00:00");
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateBookingPrice = ({
    consoleType, // "ps4" | "ps5"
    startDate, // "YYYY-MM-DD"
    endDate, // "YYYY-MM-DD"
    hours = 0, // only if same day
    extraControllers = 0,
  }) => {
    const PRICING = {
      ps4: { hourly: 40, daily: 350 },
      ps5: { hourly: 60, daily: 450 },
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

  const submitBooking = async () => {
    const price = calculateBookingPrice({
      consoleType: form.consoleType.toLowerCase(),
      startDate: form.rentalStartDate,
      endDate: form.rentalEndDate,
      hours: Number(form.hours || 0),
      extraControllers: Math.max(Number(form.noOfControllers || 1) - 1, 0),
    });
    console.log(price, "VALUES");

    // if (!form.name || !form.phone || !form.address) {
    //   alert("Please fill all fields");
    //   return;
    // }
    // console.log(form, "DATA");
    // const res = await api.post("/orders", {
    //   customerName: form.name,
    //   phone: form.phone,
    //   address: form.address,
    //   consoleType: form.consoleType,
    //   rentAmount: form.consoleType === "PS5" ? 800 : 500,
    //   depositAmount: 2000,
    // });

    // localStorage.setItem("orderId", res.data._id);
    // localStorage.setItem(
    //   "amount",
    //   res.data.rentAmount + res.data.depositAmount
    // );
    // window.location.href = "/payment";
  };

  const formHandler = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  const today = new Date().toISOString().split("T")[0];

  const openDatePicker = (e) => {
    e.currentTarget.showPicker();
  };
  return (
    <div className="book_bg" style={{ padding: 40 }}>
      <h2 className="white">Book Your Console</h2>
      <TextField
        labelName="Full Name"
        onChange={(e) => formHandler("name", e.target.value)}
      />

      <TextField
        labelName="Mobile Number"
        type="number"
        onChange={(e) => formHandler("phone", e.target.value)}
      />

      <TextField
        labelName="No. Of Controllers"
        select={true}
        options={[
          { label: "1 Controller", value: "1" },
          { label: "2 Controllers", value: "2" },
          { label: "3 Controllers", value: "3" },
          { label: "4 Controllers", value: "4" },
          { label: "5 Controllers", value: "5" },
        ]}
        value={form.noOfControllers}
        onChange={(e) => formHandler("noOfControllers", e.target.value)}
      />

      <TextField
        labelName="Start Date"
        type="date"
        min={today}
        onClick={openDatePicker}
        onChange={(e) => formHandler("rentalStartDate", e.target.value)}
      />

      {form?.rentalStartDate && (
        <TextField
          labelName="End Date"
          type="date"
          min={form?.rentalStartDate}
          onClick={openDatePicker}
          onChange={(e) => formHandler("rentalEndDate", e.target.value)}
        />
      )}
      {form?.rentalStartDate === form?.rentalEndDate && form.rentalEndDate && (
        <TextField
          labelName="How Many Hours"
          select={true}
          options={[
            { label: "--select", value: "NA" },
            { label: "3 Hours", value: "3" },
            { label: "6 Hours", value: "6" },
            { label: "9 Hours", value: "9" },
          ]}
          onChange={(e) => formHandler("hours", e.target.value)}
        />
      )}

      <TextField
        labelName="Complete Address"
        textarea={true}
        onChange={(e) => formHandler("address", e.target.value)}
      />

      <TextField
        labelName="Console Type"
        select={true}
        onChange={(e) => formHandler("consoleType", e.target.value)}
        options={[
          { label: "--select", value: "NA" },
          { label: "PS4", value: "PS4" },
          { label: "PS5", value: "PS5" },
        ]}
      />

      <TextField
        labelName="Payment Made"
        select={true}
        onChange={(e) => formHandler("paymentMade", e.target.value)}
        options={[
          { label: "--select", value: "NA" },
          { label: "Cash", value: "cash" },
          { label: "UPI", value: "upi" },
          { label: "Card", value: "card" },
        ]}
      />

      <button onClick={submitBooking} className="pay-btn center">
        Proceed to Payment
      </button>
    </div>
  );
}
