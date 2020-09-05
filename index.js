"use strict";

const axios = require("axios");
const cheerio = require("cheerio");
const twilio = require("twilio");

const MessagingResponse = twilio.twiml.MessagingResponse;

const projectId = process.env.GCLOUD_PROJECT;
const region = "us-central1";

const url = "https://www.sierraavalanchecenter.org/advisory-rss.xml";

exports.reply = (req, res) => {
  let isValid = true;

  // Only validate that requests came from Twilio when the function has been
  // deployed to production.
  if (process.env.NODE_ENV === "production") {
    isValid = twilio.validateExpressRequest(
      req,
      "2da2691cb8fbef765fa70e54827cb35e",
      {
        url: `https://${region}-${projectId}.cloudfunctions.net/reply`,
      }
    );
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

  var twiml = new MessagingResponse();
  axios
    .get(url)
    .then(function (response) {
      // handle success
      let $ = cheerio.load(response["data"]);
      let divs = $("#bottom-line");
      twiml.message(divs.text());
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};
