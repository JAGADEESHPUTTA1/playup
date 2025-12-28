import { useState } from "react";
import "./Login.css";
import { api } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function Login() {
  const [mode, setMode] = useState("login"); // login | signup
  const [step, setStep] = useState("form"); // form | otp
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const {login} = useAuth()

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    identifier: "",
    otp: "",
  });

  const handleChange = (e) => {
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

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
      setStep("otp");
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to send OTP");
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
      login(res.data)
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
      navigate("/home");
    }
  };

  if (loading) return <Loader text="verifying your details..."/>;

  return (
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={step === "form" ? sendOtp : verifyOtp}
      >
        <h2>{mode === "signup" ? "Signup" : "Login"}</h2>

        {mode === "signup" && step === "form" && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </>
        )}

        {mode === "login" && step === "form" && (
          <input
            name="identifier"
            placeholder="Email or Phone Number"
            value={form.identifier}
            onChange={handleChange}
            required
          />
        )}

        {step === "otp" && (
          <input
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">
          {step === "form" ? "Send OTP" : "Verify OTP"}
        </button>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}

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
