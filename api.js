const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const axios = require("axios");
require("dotenv").config();

app.get("/api/create-dd-monitor", (req, res) => {
  const apiKey = process.env.DD_API_KEY;
  const appKey = process.env.DD_APP_KEY;
  console.log("DD_API_KEY", apiKey);
  console.log("DD_APP_KEY", appKey);
  // Construct the monitor payload
  const monitorPayload = {
    name: "session",
    type: "metric alert",
    query:
      "sum(last_5m):sum:datadog.estimated_usage.rum.sessions{*}.as_count() >= 1",
    message: "@webhook-ServiceDeskPlusWebhook",
    tags: ["env:stating-1", "team:backend"],
    notification_channels:
      "https://sdpondemand.manageengine.com/app/itdesk/executefunction/DataDog?zapikey=1003.245be6703e37732476b21c6341074652.fd2ea03b4ae4d30a7c77d64421815e37",
  };

  // Define Datadog API endpoint for creating monitors
  const apiUrl = "https://api.us5.datadoghq.com/api/v1/monitor";

  // Define headers for API request
  const headers = {
    "Content-Type": "application/json",
    "DD-API-KEY": apiKey,
    "DD-APPLICATION-KEY": appKey,
  };

  // Make API request to create the monitor
  axios
    .post(apiUrl, monitorPayload, { headers })
    .then((response) => {
      res.send(
        `Monitor created successfully: -${JSON.stringify(response?.data)}`
      );
    })
    .catch((error) => {
      res.send(
        `Error creating monitor: ${JSON.stringify(error?.response?.data)}`
      );
    });
});

app.post("/api/datadog/webhook", (req, res) => {
  const monitorData = req.body;
  console.log(monitorData);
  console.log("Received monitor data check:", monitorData);
  res.send(`data received - ${monitorData}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
