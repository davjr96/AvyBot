"use strict";

import axios from "axios";
import cheerio from "cheerio";
import twilio from "twilio";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();

const MessagingResponse = twilio.twiml.MessagingResponse;

const projectId = "avybot";
const region = "us-central1";

const url = "https://www.sierraavalanchecenter.org/advisory";

async function accessSecretVersion() {
  // Access the twilio.
  const name = "projects/avybot/secrets/twilio/versions/latest";

  const [accessResponse] = await client.accessSecretVersion({
    name: name,
  });

  return accessResponse.payload.data.toString();
}

exports.reply = async (req, res) => {
  let isValid = true;
  const twilioKey = await accessSecretVersion();

  // Only validate that requests came from Twilio when the function has been
  // deployed to production.
  if (process.env.NODE_ENV === "production") {
    isValid = twilio.validateExpressRequest(req, twilioKey, {
      url: `https://${region}-${projectId}.cloudfunctions.net/reply`,
    });
  }

  // Halt early if the request was not sent from Twilio
  if (!isValid) {
    res
      .type("text/plain")
      .status(403)
      .send("Twilio Request Validation Failed.")
      .end();
    return;
  }

  const twiml = new MessagingResponse();
  axios
    .get(url)
    .then(function (response) {
      // handle success
      const $ = cheerio.load(response["data"]);
      const divs = $("#bottom-line");
      twiml.message(divs.text());
      console.log(divs.text());
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};
