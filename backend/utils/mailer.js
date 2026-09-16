import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ===============================
// GENERIC EMAIL FUNCTION
// ===============================
export const sendEmail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("❌ Resend Email Error:", error);

    throw new Error(error.message || "Failed to send email");
  }

  console.log("✅ Email sent:", data?.id);

  return data;
};

// ===============================
// OTP EMAIL
// ===============================
export const sendOTPEmail = async ({ to, otp }) => {
  return await sendEmail({
    to,

    subject: "BookMyTurf Login OTP",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 40px auto;
        padding: 30px;
      ">

        <h2>BookMyTurf</h2>

        <p>Your OTP for login is:</p>

        <h1 style="
          font-size: 36px;
          letter-spacing: 8px;
        ">
          ${otp}
        </h1>

        <p>
          This OTP will expire in
          <strong>5 minutes</strong>.
        </p>

        <p>
          Do not share this OTP with anyone.
        </p>

      </div>
    `,
  });
};
