import { transporter } from "./mailer.js";

export const sendBookingConfirmationEmail = async (booking) => {
  await transporter.sendMail({
    from: `"Turf Booking" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: "Your Booking is Confirmed 🎉",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2 style="color:#059669;">Booking Confirmed 🎉</h2>
        <hr/>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Date:</strong> ${new Date(
          booking.bookingDate,
        ).toLocaleDateString()}</p>
        <p><strong>Time Slot:</strong> ${booking.timeSlot}</p>
        <p><strong>Total Paid:</strong> ₹${booking.totalPrice}</p>
       <p><strong>Venue:</strong> ${booking.venueName}</p>
        <br/>
        <p>See you on the field!</p>
      </div>
    `,
  });
};

export const sendCancellationEmail = async (booking) => {
  await transporter.sendMail({
    from: `"Turf Booking" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: "Your Booking has been Cancelled",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2 style="color:#dc2626;">Booking Cancelled</h2>
        <hr/>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Date:</strong> ${new Date(
          booking.bookingDate,
        ).toLocaleDateString()}</p>
        <p><strong>Time Slot:</strong> ${booking.timeSlot}</p>
        <p><strong>Refund Status:</strong> ${booking.refundStatus}</p>
        <p><strong>Venue:</strong> ${booking.venueName}</p>
        <br/>
        <p>Refund will be processed within 3–5 working days.</p>
      </div>
    `,
  });
};
