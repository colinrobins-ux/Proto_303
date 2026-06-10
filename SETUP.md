# The Ivy Mobile Contact Form - Setup Guide

## Quick Start (Without Backend)

The `index.html` file includes a ready-to-use form with Formspree integration for email handling. Simply open the file in a browser and test the form. For email to work, you'll need to configure Formspree:

1. Visit [formspree.io](https://formspree.io)
2. Create a free account
3. Create a new form and get your form ID
4. Update the Formspree endpoint in `index.html` (line ~415) with your form ID:
   ```javascript
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```

## Local Server Setup (Recommended for Development)

For a full-featured backend with email delivery:

### Prerequisites
- Node.js 14+ installed
- Gmail account (or other email service)

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the project root:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-app-password
   PORT=3000
   ```

   **For Gmail:**
   - Enable 2-factor authentication on your Google account
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Generate an app password and use it in the `.env` file

3. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Access the site:**
   Open `http://localhost:3000` in your browser

### Update Frontend for Local Server

In `index.html`, update the form submission endpoint (around line 415):

Replace:
```javascript
const response = await fetch('https://formspree.io/f/xyzqpwpk', {
```

With:
```javascript
const response = await fetch('/api/contact', {
```

## Features

✅ Mobile-first responsive design
✅ Luxury brand aesthetic matching design-system.html
✅ Services showcase (Weddings, Quinceañeras, Concerts, etc.)
✅ Contact form modal
✅ Form validation
✅ Email delivery to venue
✅ Confirmation email to inquirer
✅ Smooth animations and interactions
✅ Dark mode friendly colors from design system

## File Structure

```
Proto_303/
├── index.html           (Main page - ready to use)
├── package.json         (Node dependencies)
├── server.js            (Backend for email handling)
├── .env                 (Environment variables - create this)
├── design-system.html   (Design reference)
├── readme.md
├── Brief.md
└── images/
    └── logo.svg
```

## Troubleshooting

**Form not sending emails:**
- Check that your `.env` file is properly configured
- Verify Gmail app password is correct
- Check console for error messages

**"Cannot find module" errors:**
- Run `npm install` again
- Make sure Node.js is installed

**CORS errors:**
- The server includes CORS configuration for local development
- When deploying, configure CORS properly for your domain

## Deployment

To deploy this site:

1. **Static site (Formspree only):**
   - Deploy `index.html` to any static host (Netlify, Vercel, GitHub Pages)
   - Configure Formspree form ID

2. **Full backend:**
   - Deploy `server.js` to a Node host (Heroku, Railway, Render)
   - Set environment variables in your hosting platform
   - Update form endpoint to match your deployment URL

## Next Steps

- Customize form fields as needed
- Add photo gallery of venue
- Integrate with calendar/scheduling system
- Add testimonials section
- Implement admin dashboard for viewing submissions
