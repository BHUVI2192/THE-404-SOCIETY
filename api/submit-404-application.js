import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    company,
    frameworks,
    hardestIssue,
    experiences,
    currentDebugging,
    shareTraces,
    whyTest
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Assuming Gmail based on the prompt's "SMTP App Password"
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1. Send application details to ADMIN
    const adminHtml = `
      <h2>New 404 AI Application Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company/Project:</strong> ${company}</p>
      <hr />
      <h3>Stack & Experience</h3>
      <p><strong>Frameworks:</strong> ${frameworks}</p>
      <p><strong>Experiences:</strong> ${experiences?.join(', ') || 'None selected'}</p>
      <hr />
      <h3>Deep Dive</h3>
      <p><strong>Hardest Debugging Issue:</strong><br/>${hardestIssue}</p>
      <p><strong>Current Debugging Method:</strong><br/>${currentDebugging}</p>
      <p><strong>Open to sharing traces:</strong> ${shareTraces}</p>
      <p><strong>Why test 404 AI:</strong><br/>${whyTest}</p>
    `;

    await transporter.sendMail({
      from: `"404 AI System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sending to ADMIN
      subject: `New Application: ${name} from ${company}`,
      html: adminHtml,
    });

    // 2. Send premium thank you email to USER
    const userHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-w-2xl; color: #111; line-height: 1.6;">
        <p>Hi ${name.split(' ')[0]},</p>
        
        <p>Thanks for applying to test 404 AI.</p>
        
        <p>We're currently onboarding a highly curated, small group of engineers building AI agents and autonomous workflows to test our Root Cause Analysis engine.</p>
        
        <p>Your application has been received and we'll reach out soon once a spot in Phase 1 opens up.</p>
        
        <p>Best,<br/>
        Founder, 404 AI</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"404 AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `404 AI — Early Access Application Received`,
      html: userHtml,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing application:', error);
    return res.status(500).json({ error: 'Failed to process application' });
  }
}
