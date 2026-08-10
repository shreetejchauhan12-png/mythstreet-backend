import { Resend } from "resend";

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function sendEmail({ subject, text }) {

  console.log("🔥 sendEmail CALLED");

  if (!resend) {

    console.warn("⚠️ RESEND_API_KEY not configured.");

    return null;

  }

  try {

    const response = await resend.emails.send({

      from: "MythStreet <orders@mythstreet.com>",

      to: ["mythstreetstore@gmail.com"],

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