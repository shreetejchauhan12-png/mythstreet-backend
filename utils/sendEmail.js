import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ subject, text }) {
  console.log("🔥 sendEmail CALLED"); // ✅ debug

  try {
    const response = await resend.emails.send({
      from: "MythStreet <orders@mythstreet.com>", // ✅ your domain
      to: ["mythstreetstore@gmail.com"], // change to your email if needed
      subject: subject || "Test Email",
      text: text || "This is a test email",
    });

    console.log("✅ Email sent via Resend:", response);
    return response;
  } catch (error) {
    console.error("❌ Resend error:", error);
    return null;
  }
}