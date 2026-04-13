// backend/server.js

const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔥 Load service account
const serviceAccount = require("./serviceAccountKey.json");
const fetch = require("node-fetch");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔥 API to send alarm
app.post("/sendAlarm", async (req, res) => {
  const { token, sender } = req.body;

  const message = {
    token: token,
    data: {
      sender: sender,
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