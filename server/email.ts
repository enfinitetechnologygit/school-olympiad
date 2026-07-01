import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

// Helper to send a general notification email
export async function sendNotificationEmail(email: string, subject: string, htmlContent: string, textContent: string) {
  const logEntry = `\n========================================\n[${new Date().toISOString()}] EMAIL SENT TO: ${email}\nSUBJECT: ${subject}\n========================================\n`;

  try {
    fs.appendFileSync(path.join(process.cwd(), "sent_emails.log"), logEntry, "utf-8");
    console.log(`[Email Mock Log] Appended email details to sent_emails.log for ${email}`);
  } catch (err: any) {
    console.error("Error writing email mock to log file:", err.message);
  }

  try {
    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const fromSender = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'no-reply@enfinite-olympiad.org';
    const fromHeader = fromSender.includes("<") ? fromSender : `"Enfinite Olympiad Board" <${fromSender}>`;
    const info = await transporter.sendMail({
      from: fromHeader,
      to: email,
      subject: subject,
      text: textContent,
      html: htmlContent
    });

    console.log(`[Email Dispatch] Message sent: ${info.messageId}`);
    if (!process.env.SMTP_HOST) {
      console.log(`[Email Preview Link] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err: any) {
    console.error(`[Email Dispatch Error] Failed to send actual email:`, err.message);
  }
}

// Helper to send registration credentials via email
export async function sendLoginCredentials(email: string, role: string, id: string, password: string) {
  const mailSubject = `Enfinite National Olympiad - ${role === "school" ? "School" : "Student"} Registration Credentials`;
  
  const mailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="background-color: #2563eb; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px;">Enfinite National Olympiad</h2>
      </div>
      <div style="padding: 20px; color: #1e293b; line-height: 1.6;">
        <p>Dear Registered ${role === "school" ? "School Coordinator" : "Student"},</p>
        <p>Your registration for the Enfinite National Olympiad has been successfully completed and approved!</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px dashed #cbd5e1;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; width: 120px; padding: 4px 0;">Login Portal:</td>
              <td style="padding: 4px 0;">${role === "school" ? "School Portal" : "Student Portal"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">User ID / Email:</td>
              <td style="font-family: monospace; font-weight: bold; color: #2563eb; padding: 4px 0;">${email}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">Assigned ID:</td>
              <td style="font-family: monospace; font-weight: bold; padding: 4px 0;">${id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">Secure Password:</td>
              <td style="font-family: monospace; font-weight: bold; color: #dc2626; padding: 4px 0;">${password}</td>
            </tr>
          </table>
        </div>
        
        <p>You can now use these credentials to log in to the secure portal. If you are a student, please proceed to pay the ₹200 fee to generate your Admit Card and activate your learning prep library.</p>
        <p>Best regards,<br/><strong>Enfinite Olympiad Board Desk</strong></p>
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
        &copy; 2026 Enfinite National Olympiad (Computer Science Board). All rights reserved.
      </div>
    </div>
  `;

  const logEntry = `\n========================================\n[${new Date().toISOString()}] EMAIL SENT TO: ${email}\nSUBJECT: ${mailSubject}\nROLE: ${role}\nID: ${id}\nPASSWORD: ${password}\n========================================\n`;

  // Always append to log file in the workspace
  try {
    fs.appendFileSync(path.join(process.cwd(), "sent_emails.log"), logEntry, "utf-8");
    console.log(`[Email Mock Log] Appended email details to sent_emails.log for ${email}`);
  } catch (err: any) {
    console.error("Error writing email mock to log file:", err.message);
  }

  // Attempt real nodemailer send
  try {
    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const fromSender = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'no-reply@enfinite-olympiad.org';
    const fromHeader = fromSender.includes("<") ? fromSender : `"Enfinite Olympiad Board" <${fromSender}>`;
    const info = await transporter.sendMail({
      from: fromHeader,
      to: email,
      subject: mailSubject,
      text: `Welcome! Your Enfinite National Olympiad credentials are:\nPortal: ${role === "school" ? "School" : "Student"}\nEmail: ${email}\nID: ${id}\nPassword: ${password}`,
      html: mailHtml
    });

    console.log(`[Email Dispatch] Message sent: ${info.messageId}`);
    if (!process.env.SMTP_HOST) {
      console.log(`[Email Preview Link] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err: any) {
    console.error(`[Email Dispatch Error] Failed to send actual email:`, err.message);
  }
}

// Helper to send registration confirmation (pending review) to schools
export async function sendSchoolPendingConfirmation(email: string, id: string, name: string) {
  const mailSubject = `Enfinite National Olympiad - School Registration Received`;
  
  const mailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background-color: #f59e0b; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px;">School Registration Pending Approval</h2>
      </div>
      <div style="padding: 20px; color: #1e293b; line-height: 1.6;">
        <p>Dear Coordinator,</p>
        <p>Thank you for registering <strong>${name}</strong> for the Enfinite National Olympiad.</p>
        <p>Your registration request has been successfully submitted and is currently <strong>PENDING approval</strong> by the National Olympiad Board.</p>
        <p><strong>Your Request ID:</strong> ${id}</p>
        <p>Once approved, your official School ID and login password credentials will be sent to this email address.</p>
        <p>Best regards,<br/><strong>Enfinite Olympiad Board Desk</strong></p>
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
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

  try {
    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const fromSender = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'no-reply@enfinite-olympiad.org';
    const fromHeader = fromSender.includes("<") ? fromSender : `"Enfinite Olympiad Board" <${fromSender}>`;
    await transporter.sendMail({
      from: fromHeader,
      to: email,
      subject: mailSubject,
      text: `Your school registration request has been received. Request ID: ${id}. It is pending review.`,
      html: mailHtml
    });
  } catch (err: any) {
    console.error(`[Email Dispatch Error] Failed to send pending confirmation email:`, err.message);
  }
}
