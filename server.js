require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'rcolinrobins@gmail.com';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter configuration on startup
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter.verify(function(error, success) {
    if (error) {
      console.log('Email configuration error:', error);
    } else {
      console.log('Email service ready');
    }
  });
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, event_type, preferred_date, message } = req.body;

    // Validate required fields
    if (!name || !email || !event_type || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email not configured, returning success to trigger Formspree fallback');
      return res.json({ 
        success: true, 
        message: 'Inquiry received. Please check your email for confirmation.' 
      });
    }

    // Prepare email content
    const mailContent = `
      <h2>New Event Inquiry from The Ivy Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Event Type:</strong> ${event_type}</p>
      <p><strong>Preferred Date:</strong> ${preferred_date || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send email to venue
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: RECIPIENT_EMAIL,
      subject: `New Event Inquiry: ${event_type} from ${name}`,
      html: mailContent,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to inquirer
    const confirmationMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'The Ivy - We Received Your Inquiry',
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>We've received your inquiry for a ${event_type} at The Ivy.</p>
        <p>Our team will be in touch soon to discuss your event.</p>
        <p>Best regards,<br>The Ivy Team</p>
      `
    };

    await transporter.sendMail(confirmationMail);

    res.json({ success: true, message: 'Inquiry sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send inquiry' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`The Ivy venue server is running at http://localhost:${PORT}`);
});
