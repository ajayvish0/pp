import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/contact-schema";

// ─── Rate-limit suggestion ──────────────────────────────────────────────────────
// For production, consider adding rate-limiting middleware (e.g. `next-rate-limit`
// or Upstash Redis-based limiter) to prevent abuse. Example: max 5 requests per
// IP per 15 minutes.
// ─────────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Honeypot check ────────────────────────────────────────────────────────
    if (body._hp && body._hp.length > 0) {
      // Silently accept to not reveal detection
      return NextResponse.json(
        { success: true, message: "Message received." },
        { status: 200 }
      );
    }

    // ── Validate ──────────────────────────────────────────────────────────────
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });

      return NextResponse.json(
        { success: false, errors: fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, email, company, subject, message } = result.data;

    // ── Send email via Nodemailer ─────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subjectLabels: Record<string, string> = {
      hiring: "Hiring Opportunity",
      collaboration: "Collaboration",
      project: "Project Inquiry",
      other: "Other",
    };

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `[Portfolio] ${subjectLabels[subject] || subject} — ${fullName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #111; color: #f3f3f3; border-radius: 8px;">
          <div style="border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #D4AF37; font-size: 18px; letter-spacing: 0.1em; text-transform: uppercase;">
              New Contact Inquiry
            </h2>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 120px;">Name</td>
              <td style="padding: 8px 0; color: #f3f3f3;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
              <td style="padding: 8px 0; color: #f3f3f3;"><a href="mailto:${email}" style="color: #D4AF37;">${email}</a></td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Company</td>
              <td style="padding: 8px 0; color: #f3f3f3;">${company}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Subject</td>
              <td style="padding: 8px 0; color: #f3f3f3;">${subjectLabels[subject] || subject}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 20px; background: rgba(212,175,55,0.06); border-left: 2px solid #D4AF37; border-radius: 4px;">
            <p style="margin: 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Message</p>
            <p style="margin: 0; color: #f3f3f3; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); color: #555; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em;">
            COMM.PORT — SECURE.CHANNEL.v1
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Message received." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
