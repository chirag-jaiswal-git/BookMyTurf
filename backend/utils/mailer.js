import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async ({ to, otp }) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [to],
    subject: "BookMyTurf Login OTP",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        background-color: #f8f9fa;
      ">
        <div style="
          background-color: white;
          padding: 30px;
          border-radius: 10px;
        ">
          <h2>BookMyTurf</h2>

          <p>Your OTP for login is:</p>

          <h1 style="
            font-size: 32px;
            letter-spacing: 8px;
          ">
            ${otp}
          </h1>

          <p>
            This OTP will expire in <strong>5 minutes</strong>.
          </p>

          <p>
            Do not share this OTP with anyone.
          </p>

          <p style="color: #666;">
            If you did not request this OTP, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Resend Email Error:", error);
    throw new Error(error.message || "Failed to send email");
  }

  console.log("✅ OTP email sent:", data?.id);

  return data;
};
