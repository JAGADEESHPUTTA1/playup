import { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import TextField from "../../components/TextField/TextField";
import "./Book.css";
import Loader from "../../components/Loader/Loader";
import CheckCircle from "../../images/CheckCircle";
import { useToast } from "../../components/Toast/ToastContext";

export default function Book() {
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      showToast("Location is not supported on this device.", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm((prev) => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
        }));
        showToast("Location captured successfully", "success");
      },
      () => {
        showToast("Please allow location access to continue.", "error");
      }
    );
  };

  const openDatePicker = (e) => {
    e.currentTarget.showPicker();
  };

  const submitBooking = async () => {
    if (!form.location || !form.rentalStartDate || !form.rentalEndDate) {
      showToast("Please fill all required details to continue.", "error");
      return;
    }

    try {
      setLoader(true);

      const res = await api.post("/orders", {
        consoleType: form.consoleType,
        noOfControllers: form.noOfControllers,
        rentalStartDate: form.rentalStartDate,
        rentalEndDate: form.rentalEndDate,
        hours: form.hours,
        depositAmount: 0,
        deliveryAddress: form.location,
        gamesList: form.gamesList,
      });

      localStorage.setItem("orderId", res.data.data._id);

      showToast(
        "Booking created successfully. Proceeding to payment.",
        "success"
      );

      navigate("/payment");
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Failed to create booking. Please try again.",
        "error"
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="book_bg">
      {loader && <Loader text="Confirming your booking..." />}

      <div className="book_container">
        <h2>Book Your Console</h2>

        {!form.location && (
          <button className="btn-primary width_loc" onClick={getLocation}>
            📍 Share Current Location
          </button>
        )}

        {form.location && (
          <p className="location-success">
            Location captured <CheckCircle size={18} />
          </p>
        )}

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

        <div className="center">
          <button className="btn-primary" onClick={submitBooking}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
