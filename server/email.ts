import fs from "fs";
import path from "path";

// Helper to get base64 or URL logo source
function getLogoSrc(): string {
  if (process.env.LOGO_URL) {
    return process.env.LOGO_URL;
  }
  try {
    const loggoPath = path.join(process.cwd(), "public", "loggo.png");
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const filePath = fs.existsSync(loggoPath) ? loggoPath : (fs.existsSync(logoPath) ? logoPath : null);
    if (filePath) {
      const base64 = fs.readFileSync(filePath).toString("base64");
      return `data:image/png;base64,${base64}`;
    }
  } catch (err: any) {
    console.error("Error reading logo file for email:", err.message);
  }
  return "";
}

// Helper to wrap or ensure logo is present in notification emails
function wrapNotificationHtml(htmlContent: string, subject: string): string {
  const logoSrc = getLogoSrc();
  if (!logoSrc) return htmlContent;

  const logoImageTag = `<img src="${logoSrc}" alt="Enfinite National Olympiad Logo" style="max-height: 55px; width: auto; margin: 0 auto 10px auto; display: block; border: 0;" />`;

  // If logo is already present in the HTML, return as is
  if (htmlContent.includes("Enfinite National Olympiad Logo") || htmlContent.includes("Enfinite Logo")) {
    return htmlContent;
  }

  // If HTML already contains a structured card template, inject logo before the first <h2> tag if present
  if (htmlContent.includes("<h2")) {
    return htmlContent.replace(/<h2([^>]*)>/i, `${logoImageTag}<h2$1>`);
  }

  // Otherwise, wrap raw snippet in full branded email container
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #2563eb;">
        ${logoImageTag}
        <h2 style="margin: 0; font-size: 20px; color: #1e293b; font-weight: bold;">${subject}</h2>
      </div>
      <div style="padding: 24px; color: #1e293b; line-height: 1.6; background-color: #ffffff;">
        ${htmlContent}
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; background-color: #f8fafc; padding: 15px; border-top: 1px solid #e2e8f0;">
        &copy; 2026 Enfinite National Olympiad (Computer Science Board). All rights reserved.
      </div>
    </div>
  `;
}

// Internal helper to send email via Brevo REST API
async function sendEmailViaBrevo(toEmail: string, subject: string, htmlContent: string, textContent: string) {
  const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;
  const senderEmail = process.env.SENDER_EMAIL || "admin@enfinitesmartschool.com";

  if (!apiKey) {
    console.warn("[Brevo API Warning] Missing BREVO_API_KEY or SMTP_PASS in .env file. Logged to file only.");
    return;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "Enfinite Olympiad Board",
          email: senderEmail
        },
        to: [
          {
            email: toEmail
          }
        ],
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo HTTP error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`[Brevo API Dispatch] Email sent to ${toEmail} successfully. Message ID:`, data.messageId || "N/A");
  } catch (err: any) {
    console.error(`[Brevo API Dispatch Error] Failed to send email to ${toEmail} via Brevo API:`, err.message);
  }
}

// Helper to send a general notification email
export async function sendNotificationEmail(email: string, subject: string, htmlContent: string, textContent: string) {
  const logEntry = `\n========================================\n[${new Date().toISOString()}] EMAIL SENT TO: ${email}\nSUBJECT: ${subject}\n========================================\n`;

  try {
    fs.appendFileSync(path.join(process.cwd(), "sent_emails.log"), logEntry, "utf-8");
    console.log(`[Email Mock Log] Appended email details to sent_emails.log for ${email}`);
  } catch (err: any) {
    console.error("Error writing email mock to log file:", err.message);
  }

  const formattedHtml = wrapNotificationHtml(htmlContent, subject);
  await sendEmailViaBrevo(email, subject, formattedHtml, textContent);
}

// Helper to send registration credentials via email
export async function sendLoginCredentials(email: string, role: string, id: string, password: string, name?: string) {
  const mailSubject = `Enfinite National Olympiad - ${role === "school" ? "School" : "Student"} Registration Credentials`;
  const logoSrc = getLogoSrc();
  const logoImg = logoSrc ? `<img src="${logoSrc}" alt="Enfinite National Olympiad Logo" style="max-height: 55px; width: auto; margin: 0 auto 10px auto; display: block; border: 0;" />` : '';

  const mailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #2563eb;">
        ${logoImg}
        <h2 style="margin: 0; font-size: 20px; color: #1e293b; font-weight: bold;">Enfinite National Olympiad</h2>
      </div>
      <div style="padding: 24px; color: #1e293b; line-height: 1.6; background-color: #ffffff;">
        <p style="margin-top: 0;">Dear ${name || (role === "school" ? "School Coordinator" : "Student")},</p>
        <p>Your registration for the Enfinite National Olympiad has been successfully completed and approved!</p>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 10px; margin: 20px 0; border: 1px dashed #cbd5e1;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; width: 130px; padding: 6px 0; color: #475569;">Login Portal:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${role === "school" ? "School Portal" : "Student Portal"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 6px 0; color: #475569;">User ID / Email:</td>
              <td style="font-family: monospace; font-weight: bold; color: #2563eb; padding: 6px 0;">${email}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 6px 0; color: #475569;">Assigned ID:</td>
              <td style="font-family: monospace; font-weight: bold; padding: 6px 0; color: #0f172a;">${id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 6px 0; color: #475569;">Secure Password:</td>
              <td style="font-family: monospace; font-weight: bold; color: #dc2626; padding: 6px 0;">${password}</td>
            </tr>
          </table>
        </div>
        
        <p>You can now use these credentials to log in to the secure portal. If you are a student, please proceed to pay the ₹200 fee to generate your Admit Card and activate your learning prep library.</p>
        <p style="margin-bottom: 0;">Best regards,<br/><strong>Enfinite Olympiad Board Desk</strong></p>
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; background-color: #f8fafc; padding: 15px; border-top: 1px solid #e2e8f0;">
        &copy; 2026 Enfinite National Olympiad (Computer Science Board). All rights reserved.
      </div>
    </div>
  `;

  const logEntry = `\n========================================\n[${new Date().toISOString()}] EMAIL SENT TO: ${email}\nSUBJECT: ${mailSubject}\nROLE: ${role}\nID: ${id}\nPASSWORD: ${password}\n========================================\n`;

  try {
    fs.appendFileSync(path.join(process.cwd(), "sent_emails.log"), logEntry, "utf-8");
    console.log(`[Email Mock Log] Appended email details to sent_emails.log for ${email}`);
  } catch (err: any) {
    console.error("Error writing email mock to log file:", err.message);
  }

  const textContent = `Welcome! Your Enfinite National Olympiad credentials are:\nPortal: ${role === "school" ? "School" : "Student"}\nEmail: ${email}\nID: ${id}\nPassword: ${password}`;
  await sendEmailViaBrevo(email, mailSubject, mailHtml, textContent);
}

// Helper to send registration confirmation (pending review) to schools
export async function sendSchoolPendingConfirmation(email: string, id: string, name: string) {
  const mailSubject = `Enfinite National Olympiad - School Registration Received`;
  const logoSrc = getLogoSrc();
  const logoImg = logoSrc ? `<img src="${logoSrc}" alt="Enfinite National Olympiad Logo" style="max-height: 55px; width: auto; margin: 0 auto 10px auto; display: block; border: 0;" />` : '';

  const mailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #f59e0b;">
        ${logoImg}
        <h2 style="margin: 0; font-size: 20px; color: #1e293b; font-weight: bold;">School Registration Pending Approval</h2>
      </div>
      <div style="padding: 24px; color: #1e293b; line-height: 1.6; background-color: #ffffff;">
        <p style="margin-top: 0;">Dear Coordinator,</p>
        <p>Thank you for registering <strong>${name}</strong> for the Enfinite National Olympiad.</p>
        <p>Your registration request has been successfully submitted and is currently <strong style="color: #d97706;">PENDING approval</strong> by the National Olympiad Board.</p>
        <p><strong>Your Request ID:</strong> ${id}</p>
        <p>Once approved, your official School ID and login password credentials will be sent to this email address.</p>
        <p style="margin-bottom: 0;">Best regards,<br/><strong>Enfinite Olympiad Board Desk</strong></p>
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; background-color: #f8fafc; padding: 15px; border-top: 1px solid #e2e8f0;">
        &copy; 2026 Enfinite National Olympiad (Computer Science Board). All rights reserved.
      </div>
    </div>
  `;

  const logEntry = `\n========================================\n[${new Date().toISOString()}] EMAIL SENT TO: ${email}\nSUBJECT: ${mailSubject}\nROLE: school (PENDING)\nREQUEST ID: ${id}\n========================================\n`;

  try {
    fs.appendFileSync(path.join(process.cwd(), "sent_emails.log"), logEntry, "utf-8");
    console.log(`[Email Mock Log] Appended pending confirmation to sent_emails.log for ${email}`);
  } catch (err: any) {
    console.error("Error writing email mock to log file:", err.message);
  }

  const textContent = `Your school registration request has been received. Request ID: ${id}. It is pending review.`;
  await sendEmailViaBrevo(email, mailSubject, mailHtml, textContent);
}
