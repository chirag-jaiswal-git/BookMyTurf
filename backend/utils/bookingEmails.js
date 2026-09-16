import { sendEmail } from "./mailer.js";

// ===============================
// BOOKING CONFIRMATION EMAIL
// ===============================
export const sendBookingConfirmationEmail = async (booking) => {
  await sendEmail({
    to: booking.email,

    subject: "Your BookMyTurf Booking is Confirmed 🎉",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        padding: 20px;
        max-width: 600px;
        margin: auto;
        background: #f9fafb;
      ">

        <div style="
          background: white;
          padding: 25px;
          border-radius: 10px;
        ">

          <h2 style="color: #059669;">
            Booking Confirmed 🎉
          </h2>

          <hr/>

          <p>
            <strong>Booking ID:</strong>
            ${booking._id}
          </p>

          <p>
            <strong>Name:</strong>
            ${booking.name}
          </p>

          <p>
            <strong>Venue:</strong>
            ${booking.venueName || "N/A"}
          </p>

          <p>
            <strong>Date:</strong>
            ${new Date(booking.bookingDate).toLocaleDateString()}
          </p>

          <p>
            <strong>Time Slot:</strong>
            ${booking.timeSlot}
          </p>

          <p>
            <strong>Total Amount:</strong>
            ₹${booking.totalPrice}
          </p>

          <br/>

          <p>
            Thank you for booking with <strong>BookMyTurf</strong>.
          </p>

          <p>
            See you on the field! 🏟️
          </p>

        </div>
      </div>
    `,
  });
};

// ===============================
// BOOKING CANCELLATION EMAIL
// ===============================
export const sendCancellationEmail = async (booking) => {
  await sendEmail({
    to: booking.email,

    subject: "Your BookMyTurf Booking has been Cancelled",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        padding: 20px;
        max-width: 600px;
        margin: auto;
        background: #f9fafb;
      ">

        <div style="
          background: white;
          padding: 25px;
          border-radius: 10px;
        ">

          <h2 style="color: #dc2626;">
            Booking Cancelled
          </h2>

          <hr/>

          <p>
            <strong>Booking ID:</strong>
            ${booking._id}
          </p>

          <p>
            <strong>Name:</strong>
            ${booking.name}
          </p>

          <p>
            <strong>Venue:</strong>
            ${booking.venueName || "N/A"}
          </p>

          <p>
            <strong>Date:</strong>
            ${new Date(booking.bookingDate).toLocaleDateString()}
          </p>

          <p>
            <strong>Time Slot:</strong>
            ${booking.timeSlot}
          </p>

          <p>
            <strong>Refund Status:</strong>
            ${booking.refundStatus || "Pending"}
          </p>

          <p>
            <strong>Total Amount:</strong>
            ₹${booking.totalPrice}
          </p>

          <br/>

          <p>
            Your booking has been cancelled successfully.
          </p>

          <p>
            Refund status will be updated by the administrator.
          </p>

        </div>
      </div>
    `,
  });
};
