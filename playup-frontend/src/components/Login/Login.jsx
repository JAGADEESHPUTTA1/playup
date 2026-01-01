import { useState, useEffect } from "react";
import "./Login.css";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import TextField from "../../components/TextField/TextField";
import { useToast } from "../../components/Toast/ToastContext";

/* ---------------- VALIDATORS ---------------- */

const validateName = (name) => {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 3) return "Name must be at least 3 characters";
  return "";
};

const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address";
  return "";
};

const validatePhone = (phone) => {
  if (!phone) return "Mobile number is required";
  if (!/^[6-9]\d{9}$/.test(phone))
    return "Enter a valid 10-digit mobile number";
  return "";
};

const validateIdentifier = (value) => {
  if (!value) return "Email or phone is required";

  const isPhone = /^\d+$/.test(value);

  if (isPhone && !/^[6-9]\d{9}$/.test(value))
    return "Enter a valid 10-digit mobile number";

  if (!isPhone && !/\S+@\S+\.\S+/.test(value))
    return "Enter a valid email address";

  return "";
};

/* ---------------- COMPONENT ---------------- */

export default function Login() {
  const [mode, setMode] = useState("login"); // login | signup
  const [step, setStep] = useState("form"); // form | otp
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    identifier: "",
    otp: "",
  });

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => setInitializing(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setForm({ ...form, phone: value.replace(/\D/g, "").slice(0, 10) });
    } else if (name === "otp") {
      setForm({ ...form, otp: value.replace(/\D/g, "").slice(0, 6) });
    } else {
      setForm({ ...form, [name]: value });
    }

    setErrorMsg("");
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    let errors = {};

    if (mode === "signup") {
      const nameError = validateName(form.name);
      const emailError = validateEmail(form.email);
      const phoneError = validatePhone(form.phone);

      if (nameError) errors.name = nameError;
      if (emailError) errors.email = emailError;
      if (phoneError) errors.phone = phoneError;
    } else {
      const idError = validateIdentifier(form.identifier);
      if (idError) errors.identifier = idError;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await api.post(
        "/auth/send-otp",
        mode === "signup"
          ? { name: form.name, email: form.email, phone: form.phone }
          : { identifier: form.identifier }
      );

      showToast("OTP sent successfully", "success");
      setStep("otp");
      setResendTimer(30);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Unable to send OTP. Please try again.";
      showToast(msg, "error");
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      await api.post(
        "/auth/send-otp",
        mode === "signup"
          ? { name: form.name, email: form.email, phone: form.phone }
          : { identifier: form.identifier }
      );

      showToast("OTP resent successfully", "success");
      setResendTimer(30);
    } catch (error) {
      showToast("Unable to resend OTP. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        email: mode === "signup" ? form.email : undefined,
        identifier: mode === "login" ? form.identifier : undefined,
        otp: form.otp,
        mode,
      });

      await login(res.data);
      showToast("Login successful", "success");

      navigate(res.data.user.role === "admin" ? "/admin" : "/home");
    } catch (error) {
      const msg = error?.response?.data?.message || "Invalid or expired OTP.";
      showToast(msg, "error");
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  if (initializing || loading) {
    return <Loader text={initializing ? "Loading..." : "Processing..."} />;
  }

  return (
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={step === "form" ? sendOtp : verifyOtp}
      >
        <h2>{mode === "signup" ? "Signup" : "Login"}</h2>

        {mode === "signup" && step === "form" && (
          <>
            <TextField
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {fieldErrors.name && (
              <span className="auth-error">{fieldErrors.name}</span>
            )}

            <TextField
              placeholder="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <span className="auth-error">{fieldErrors.email}</span>
            )}

            <TextField
              placeholder="Mobile Number"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            {fieldErrors.phone && (
              <span className="auth-error">{fieldErrors.phone}</span>
            )}
          </>
        )}

        {mode === "login" && step === "form" && (
          <>
            <TextField
              placeholder="Email or Mobile Numberv"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
            />
            {fieldErrors.identifier && (
              <span className="auth-error">{fieldErrors.identifier}</span>
            )}
          </>
        )}

        {step === "otp" && (
          <TextField
            placeholder="Enter OTP"
            name="otp"
            value={form.otp}
            onChange={handleChange}
          />
        )}

        <button type="submit" className="verify">
          {step === "form" ? "Send OTP" : "Verify OTP"}
        </button>

        {step === "otp" && (
          <button
            type="button"
            className="btn-resend"
            disabled={resendTimer > 0}
            onClick={resendOtp}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
          </button>
        )}

        {errorMsg && <span className="auth-error">{errorMsg}</span>}

        {step === "form" && (
          <p
            className="switch-auth"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setForm({
                name: "",
                email: "",
                phone: "",
                identifier: "",
                otp: "",
              });
              setFieldErrors({});
              setErrorMsg("");
            }}
          >
            {mode === "login"
              ? "New user? Signup"
              : "Already have an account? Login"}
          </p>
        )}
      </form>
    </div>
  );
}
