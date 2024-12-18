require('dotenv').config();
const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const app = express();
const path = require('path');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, './'))); // This will serve files from your current directory

// Handle CV submissions
app.post('/api/submit-cv', async (req, res) => {
    try {
        const { name, email, position, cv, fileName } = req.body;

        // Create email with attachment
        const msg = {
            to: 'bizflow@proton.me', // Your receiving email
            from: process.env.SENDGRID_VERIFIED_SENDER, // Your verified sender email
            subject: `New CV Application: ${position} - ${name}`,
            text: `New application received from ${name} for ${position} position.`,
            html: `
                <h2>New Job Application</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Position:</strong> ${position}</p>
            `,
            attachments: [
                {
                    content: cv,
                    filename: fileName,
                    type: 'application/pdf',
                    disposition: 'attachment'
                }
            ]
        };

        await sgMail.send(msg);
        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// Add this route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add specific routes for your files
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 