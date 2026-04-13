// backend/server.js

const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔥 REMOVE this line ❌
// const serviceAccount = require("./serviceAccountKey.json");

const fetch = require("node-fetch");

// 🔥 NEW Firebase config using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

// 🔥 API to send alarm
app.post("/sendAlarm", async (req, res) => {
  const { token, sender } = req.body;

  const message = {
  token: token,
  data: {
    sender: sender,
    type: req.body.type || "alarm" // 🔥 ADD THIS
  },
};

  try {
    await admin.messaging().send(message);
    res.send("Alarm sent!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending alarm");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});