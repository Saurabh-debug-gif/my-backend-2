const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// ✅ Public endpoint
app.get('/hello', (req, res) => {
  return res.json({ message: 'Hello from Firebase backend!' });
});

// ✅ Protected endpoint
app.get('/protected', async (req, res) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return res.json({ uid: decoded.uid, message: 'You are authenticated' });
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ✅ Export Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
