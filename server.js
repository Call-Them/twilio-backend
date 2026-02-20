require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

/* TOKEN ROUTE */
app.get("/token", (req, res) => {
  const identity = "customer";

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity }
  );

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: true,
  });

  token.addGrant(voiceGrant);
  res.json({ token: token.toJwt() });
});

/* VOICE ROUTE */
app.post("/voice", (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  const number = req.body.To;
  twiml.dial(number);

  res.type("text/xml");
  res.send(twiml.toString());
});

/* REQUIRED FOR RENDER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));