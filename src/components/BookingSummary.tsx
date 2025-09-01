import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentSectionProps {
  booking: {
    bookingType: "resort" | "flight" | "car";
    bookingId: string;
    totalPrice?: number;         // use this for total price
    checkIn?: string;
    checkOut?: string;
    travelers?: number;
  } | null;
}

function BookingSummary({ booking }: PaymentSectionProps) {
  const [method, setMethod] = useState<"card" | "upi" | "netbanking" | "wallet">("card");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!booking) {
    return <p className="text-gray-600 mt-"></p>;
  }

  // ✅ Use total price directly from API
  const amount = booking.totalPrice || 0;

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/booking/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingType: booking.bookingType,
          bookingId: booking.bookingId,
          amount,
          method,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Payment successful!");
      } else {
        setMessage(`${data.error || "Payment failed"}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-md mt-6">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Payment</h2>

        <p className="mb-2">
          <span className="font-semibold">Booking Type:</span>{" "}
          {booking.bookingType}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Amount:</span> ${amount}
        </p>

        <RadioGroup
          defaultValue="card"
          onValueChange={(val) =>
            setMethod(val as "card" | "upi" | "netbanking" | "wallet")
          }
          className="space-y-2 mb-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Credit/Debit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi">UPI</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="netbanking" id="netbanking" />
            <Label htmlFor="netbanking">Net Banking</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wallet" id="wallet" />
            <Label htmlFor="wallet">Wallet</Label>
          </div>
        </RadioGroup>

        <Button onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : `Pay $${amount}`}
        </Button>

        {message && <p className="mt-4 text-sm">{message}</p>}
      </CardContent>
    </Card>
  );
}

export default BookingSummary;
