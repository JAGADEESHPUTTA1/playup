import { useState } from "react";
import { api } from "../../services/api";
import { calculateBookingPrice } from "../../helper";
import { useNavigate } from "react-router-dom";
import TextField from "../../components/TextField/TextField";
import "./Book.css";
import Loader from "../../components/Loader/Loader";
import CheckCircle from "../../images/CheckCircle";

export default function Book() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    consoleType: "PS5",
    noOfControllers: "1",
    rentalStartDate: "",
    rentalEndDate: "",
    hours: "",
    gamesList: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const formHandler = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setForm((prev) => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
        }));
      },
      () => {
        alert("Please allow location access to continue");
      }
    );
  };

  const openDatePicker = (e) => {
    e.currentTarget.showPicker();
  };

  const submitBooking = async () => {
    try {
      setLoader(true);
      const price = calculateBookingPrice({
        consoleType: form.consoleType.toLowerCase(),
        startDate: form.rentalStartDate,
        endDate: form.rentalEndDate,
        hours: Number(form.hours || 0),
        extraControllers: Math.max(Number(form.noOfControllers || 1) - 1, 0),
      });

      const isSameDay =
        form.rentalStartDate &&
        form.rentalEndDate &&
        form.rentalStartDate === form.rentalEndDate;

      if (
        !form.location ||
        !form.rentalStartDate ||
        !form.rentalEndDate
      ) {
        alert("Please fill all required fields");
        return;
      }

      if (isSameDay && !form.hours) {
        alert("Please select hours for same-day booking");
        return;
      }

      const res = await api.post("/orders", {
        consoleType: form.consoleType,
        noOfControllers: form.noOfControllers,
        rentalStartDate: form.rentalStartDate,
        rentalEndDate: form.rentalEndDate,
        hours: form.hours,
        rentAmount: price,
        depositAmount: 0,
        deliveryAddress: form.location,
        gamesList:form.gamesList
      });

      localStorage.setItem("orderId", res.data.data._id);
      localStorage.setItem("amount", res.data.data.rentAmount);

      navigate("/payment");
    } catch (error) {
      console.log("Something went wrong...");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="book_bg">
      {loader && <Loader text="Confirming your booking..." />}
      <div className="book_container">
        <h2 className="white">Book Your Console</h2>

        <div style={{ marginTop: 12, marginBottom: 12 }}>
          {!form?.location && (
            <button type="button" className="btn-primary" onClick={getLocation}>
              📍 Share Current Location
            </button>
          )}

          {form.location && (
            <p style={{ color: "#25D366", marginTop: 6, fontSize: 18 }}>
              Location captured <CheckCircle className="mb-3" size={20} />
            </p>
          )}
        </div>

        <TextField
          labelName="Console Type"
          select
          value={form.consoleType}
          options={[
            { label: "PS4", value: "PS4" },
            { label: "PS5", value: "PS5" },
          ]}
          onChange={(e) => formHandler("consoleType", e.target.value)}
        />

        <TextField
          labelName="No. Of Controllers (+₹100 extra)"
          select
          value={form.noOfControllers}
          options={[
            { label: "1 Controller", value: "1" },
            { label: "2 Controllers", value: "2" },
            { label: "3 Controllers", value: "3" },
            { label: "4 Controllers", value: "4" },
            { label: "5 Controllers", value: "5" },
          ]}
          onChange={(e) => formHandler("noOfControllers", e.target.value)}
        />
        <TextField
          labelName="Games You Want (2 Free Included)"
          textarea
          onChange={(e) => formHandler("gamesList", e.target.value)}
        />

        <TextField
          labelName="Start Date"
          type="date"
          min={today}
          onClick={openDatePicker}
          onChange={(e) => formHandler("rentalStartDate", e.target.value)}
        />

        {form.rentalStartDate && (
          <TextField
            labelName="End Date"
            type="date"
            min={form.rentalStartDate}
            onClick={openDatePicker}
            onChange={(e) => formHandler("rentalEndDate", e.target.value)}
          />
        )}

        {form.rentalStartDate === form.rentalEndDate &&
          form.rentalStartDate && (
            <TextField
              labelName="How Many Hours"
              select
              value={form.hours}
              options={[
                { label: "--select", value: "" },
                { label: "3 Hours", value: "3" },
                { label: "6 Hours", value: "6" },
                { label: "9 Hours", value: "9" },
              ]}
              onChange={(e) => formHandler("hours", e.target.value)}
            />
          )}

        <button className="btn-primary center" onClick={submitBooking}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
