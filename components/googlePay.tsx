"use client";

import React from "react";
import { QRCodeCanvas } from "qrcode.react";

interface GooglePayQRCodeProps {
  upiId: string;    // Your UPI ID
  code: string;     // Transaction note
  amount: number;   // Amount in INR
}

const GooglePayQRCode: React.FC<GooglePayQRCodeProps> = ({ upiId, code, amount }) => {
  const upiUrl = `upi://pay?pa=${upiId}&tn=${encodeURIComponent(code)}&am=${amount}&cu=INR`;

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-2xl shadow-md">
      <QRCodeCanvas value={upiUrl} size={250} level="H" />
      <p className="text-center text-gray-700 dark:text-gray-300 text-sm md:text-base">
        Pay <span className="font-semibold">₹{amount}</span> using Google Pay <br />
        Note: <span className="font-semibold">{code}</span>
      </p>
    </div>
  );
};

export default GooglePayQRCode;
