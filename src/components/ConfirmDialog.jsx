import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel, mode = "confirm" }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p className="msg">{message}</p>

        {mode === "confirm" && (
          <div className="confirm-buttons">
            <button className="confirm-yes" onClick={onConfirm}>Yes</button>
            <button className="confirm-no" onClick={onCancel}>Cancel</button>
          </div>
        )}

        {mode === "alert" && (
          <div className="confirm-buttons">
            <button className="confirm-yes" onClick={onConfirm}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmDialog;
