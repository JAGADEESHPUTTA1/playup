import { useState, useEffect } from "react";
import "./Login.css";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import TextField from "../../components/TextField/TextField";
import { useToast } from "../../components/Toast/ToastContext";

/* ---------------- VALIDATORS ---------------- */

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

  // OTP resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, phone: digits });
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
      const phoneError = validatePhone(form.phone);
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
      if (mode === "signup") {
        await api.post("/auth/send-otp", {
          name: form.name,
          email: form.email,
          phone: form.phone,
        });
      } else {
        await api.post("/auth/send-otp", {
          identifier: form.identifier,
        });
      }

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
      setErrorMsg("");

      if (mode === "signup") {
        await api.post("/auth/send-otp", {
          name: form.name,
          email: form.email,
          phone: form.phone,
        });
      } else {
        await api.post("/auth/send-otp", {
          identifier: form.identifier,
        });
      }

      showToast("OTP resent successfully", "success");
      setResendTimer(30);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Unable to resend OTP. Please try again.";
      showToast(msg, "error");
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/auth/verify-otp", {
        email: mode === "signup" ? form.email : undefined,
        identifier: mode === "login" ? form.identifier : undefined,
        otp: form.otp,
        mode,
      });

      login(res.data);
      showToast("Login successful", "success");

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Invalid or expired OTP. Please try again.";
      showToast(msg, "error");
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) return <Loader text="Processing..." />;

  return (
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={step === "form" ? sendOtp : verifyOtp}
      >
        <h2>{mode === "signup" ? "Signup" : "Login"}</h2>

        {/* SIGNUP */}
        {mode === "signup" && step === "form" && (
          <>
            <TextField
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <TextField
              placeholder="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <TextField
              placeholder="Mobile Number"
              type="tel"
              name="phone"
              maxLength={10}
              value={form.phone}
              onChange={handleChange}
            />
            {fieldErrors.phone && (
              <p className="auth-error">{fieldErrors.phone}</p>
            )}
          </>
        )}

        {/* LOGIN */}
        {mode === "login" && step === "form" && (
          <>
            <TextField
              placeholder="Email or Mobile Number"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
            />
            {fieldErrors.identifier && (
              <p className="auth-error">{fieldErrors.identifier}</p>
            )}
          </>
        )}

        {/* OTP */}
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

        {errorMsg && <p className="auth-error">{errorMsg}</p>}

        {step === "form" && (
          <p
            className="switch-auth"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setStep("form");
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
