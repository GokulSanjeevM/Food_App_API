const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
require('dotenv').config();

app.get('/api/create-dd-monitor', (req, res) => {
  const apiKey = process.env.DD_API_KEY;
  const appKey = process.env.DD_APP_KEY;
    // Construct the monitor payload
    const monitorPayload = {
      name: "User session alert",
      type: "metric alert",
      query: "sum(last_5m):sum:datadog.estimated_usage.rum.sessions{application.name:recipe-app}.as_count() >= 1",
      message: "Monitor user active sessions",
      tags: ["env:prod", "team:backend"]
    };

    // Define Datadog API endpoint for creating monitors
    const apiUrl = "https://api.datadoghq.com/api/v1/monitor";

    // Define headers for API request
    const headers = {
      "Content-Type": "application/json",
      "DD-API-KEY": apiKey,
      "DD-APPLICATION-KEY": appKey
    };

    // Make API request to create the monitor
    axios
      .post(apiUrl, monitorPayload, { headers })
      .then((response) => {
        res.send("Monitor created successfully:", response?.data);
      })
      .catch((error) => {
        res.send(`Error creating monitor: ${JSON.stringify(error?.response?.data)}`);
      });
});

app.post('/api/datadog/webhook', (req, res) => {
  const monitorData = req.body;
  console.log('Received monitor data check:', monitorData);
  res.send(`data received - ${monitorData}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});