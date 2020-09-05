const axios = require("axios");
const cheerio = require("cheerio");
const twilio = require("twilio");
const express = require("express");
const app = express();
const http = require("http");

const url = "https://www.sierraavalanchecenter.org/advisory-rss.xml";

app.post("/sms", function (req, res) {
  var twiml = new twilio.twiml.MessagingResponse();
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
});

http.createServer(app).listen(5000, function () {
  console.log("Express server listening on port 5000");
});
