const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/data", express.static(path.join(__dirname, "data")));
app.use("/asset", express.static(path.join(__dirname, "asset")));

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "index.html"));
});

// API endpoint to analyze beam using SkyCiv API
app.post("/api/analyze", async (req, res) => {
  try {
    // Get input data from request body
    const inputData = req.body;
    console.log("Received input data:", inputData);

    // Prepare payload for SkyCiv API
    const payload = {
      uid: "1011-simple-beam-analysis-calculator",
      auth: "qd@skyciv.com",
      key: "eJJQX516y4vygq1Qe1w6acsjY8nudFh0AcTPG7bsrdvsgijXLNZhDMwKF4XwemAq",
      input: inputData,
      calcs_only: true,
    };

    console.log("Sending payload to SkyCiv:", JSON.stringify({ payload }));

    // Make request to SkyCiv API
    const response = await fetch("https://qd.skyciv.com/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    });

    console.log("SkyCiv API response status:", response.status);

    // Parse response
    const data = await response.json();
    console.log("SkyCiv API response data:", JSON.stringify(data, null, 2));

    // Check different possible response structures
    if (data) {
      // SkyCiv returns status: 0 for success with data.results
      if (data.status === 0 && data.data && data.data.results) {
        // Extract the actual values from the results
        const rawResults = data.data.results;
        const processedResults = {};

        // Process each result to extract the value
        for (const key in rawResults) {
          if (rawResults[key].value !== undefined) {
            processedResults[key] = rawResults[key].value;
          }
        }

        res.json({
          success: true,
          results: processedResults,
        });
      } else if (data.response) {
        // Alternative structure with response object
        if (data.response.status === 0 && data.response.results) {
          res.json({
            success: true,
            results: data.response.results,
          });
        } else {
          // API returned an error
          res.json({
            success: false,
            error: data.response.msg || "Analysis failed",
            details: data.response,
          });
        }
      } else if (data.status !== 0) {
        // Non-zero status indicates an error
        res.json({
          success: false,
          error: data.message || "Analysis failed with status: " + data.status,
          details: data,
        });
      } else {
        // Log the entire response to understand the structure
        console.log("Unexpected response structure:", data);
        res.json({
          success: false,
          error: "Unexpected response structure from SkyCiv API",
          data: data,
        });
      }
    } else {
      // Handle empty response
      res.status(400).json({
        success: false,
        error: "Empty response from SkyCiv API",
      });
    }
  } catch (error) {
    // Handle server error
    console.error("Error calling SkyCiv API:", error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze beam: " + error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
