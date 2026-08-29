const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  if (!hasSmtp) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.warn('[mail] SMTP chua cau hinh — bo qua gui mail toi', to);
    return { skipped: true };
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const info = await t.sendMail({ from, to, subject, html });
  console.log('[mail] sent', info.messageId, '->', to);
  return info;
}

module.exports = { sendMail, getTransporter };
