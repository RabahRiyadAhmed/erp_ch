// MyToast.js
import React, { useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import moment from "moment";
import getFile from "../../utils/getFile";

const MyToast = ({ toasts, setToasts, token }) => {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          onClose={() => setToasts((prev) => prev.filter((_, i) => i !== index))}
          delay={3000}
          autohide
        >
          <Toast.Header>
            {toast.image && (
              <img
                src={toast.image}
                alt="brand-logo"
                height="12"
                className="me-1"
              />
            )}
            <strong className="me-auto">{toast.title}</strong>
            <small className="ms-5">
            {moment(toast.createAt).fromNow()}
            </small>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </div>
  );
};

export default MyToast;