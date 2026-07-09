import { useState, useEffect } from "react";
import "./AgeGate.css";

function AgeGate({ onConfirm }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const confirmed = sessionStorage.getItem("age_confirmed");
    if (!confirmed) {
      setVisible(true);
    }
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem("age_confirmed", "1");
    setVisible(false);
    if (onConfirm) onConfirm();
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  if (!visible) return null;

  return (
    <div className="age-gate-overlay">
      <div className="age-gate-modal">
        <div className="age-gate-icon">🔞</div>
        <h1 className="age-gate-title">Adults Only (18+)</h1>
        <p className="age-gate-text">
          This website contains adult content intended for mature audiences
          only.
          <br />
          By entering, you confirm that you are <br />
          <strong>18 years of age or older</strong>.
        </p>
        <div className="age-gate-buttons">
          <button className="age-gate-enter" onClick={handleConfirm}>
            I am 18+
          </button>
          <button className="age-gate-exit" onClick={handleDecline}>
            I am under 18
          </button>
        </div>
        <p className="age-gate-disclaimer">
          By entering this site you agree to our terms of service and confirm
          you are of legal age in your jurisdiction.
        </p>
      </div>
    </div>
  );
}

export default AgeGate;
