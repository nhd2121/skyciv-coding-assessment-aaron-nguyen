// Global variable to store input data
let input_data = null;

// Global variable to store displacement chart instance
let displacementChart = null;

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Fetch initial input data from server
  await loadInputData();

  // Update the beam diagram with initial data
  updateBeamDiagram();

  // Setup form submission handler
  setupFormHandler();

  // Update form inputs with initial values
  updateFormInputs();
});

//Load input data from the server's JSON file

async function loadInputData() {
  try {
    const response = await fetch("/data/input.json");
    input_data = await response.json();
  } catch (error) {
    console.error("Error loading input data:", error);
    // Use default values if loading fails
    input_data = {
      L: 1000,
      support_a: "Pinned",
      support_b: "Pinned",
      DL_mag: 40,
      PL_mag: 6,
      PL_dist: 500,
      calculate_deflection: true,
      E: 200000,
      I_z: 220000000,
      uid: "1011-simple-beam-analysis-calculator",
    };
  }
}

// Beam diagram visualization
function updateBeamDiagram() {
  const width = document.getElementById("beam-svg").clientWidth;
  const height = 0.6 * width;
  buildBeamDiagram("beam-svg", input_data, height, width);
}

// Form inputs with current input_data values
function updateFormInputs() {
  document.querySelector('input[name="distributed_load"]').value =
    input_data.DL_mag;
  document.querySelector('input[name="point_load"]').value = input_data.PL_mag;
  document.querySelector('input[name="point_load_position"]').value =
    input_data.PL_dist;
  document.querySelector('input[name="beam_length"]').value = input_data.L;
}

// Setup form submission handler
function setupFormHandler() {
  const form = document.getElementById("beam-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Show loading state
    showLoading(true);

    // Get form values and update input_data
    input_data.DL_mag = parseFloat(
      document.querySelector('input[name="distributed_load"]').value
    );
    input_data.PL_mag = parseFloat(
      document.querySelector('input[name="point_load"]').value
    );
    input_data.PL_dist = parseFloat(
      document.querySelector('input[name="point_load_position"]').value
    );
    input_data.L = parseFloat(
      document.querySelector('input[name="beam_length"]').value
    );

    // Validate inputs
    if (!validateInputs()) {
      showLoading(false);
      return;
    }

    // Update beam diagram with new values
    updateBeamDiagram();

    try {
      // Call backend API to analyze beam
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input_data),
      });

      const data = await response.json();

      if (data.success && data.results) {
        // Display results
        displayResults(data.results);

        // Create displacement graph if displacement data exists
        if (data.results.displacement_array) {
          createDisplacementGraph(
            data.results.displacement_array,
            input_data.L
          );
        }

        // Show success message
        showMessage("Analysis completed successfully!", "success");
      } else {
        showMessage("Error: " + (data.error || "Analysis failed"), "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage("Failed to connect to server. Please try again.", "error");
    } finally {
      showLoading(false);
    }
  });
}

// Validate user inputs
function validateInputs() {
  // Check if point load position is within beam length
  if (input_data.PL_dist > input_data.L) {
    showMessage("Point load position cannot exceed beam length!", "warning");
    return false;
  }

  // Check for negative values
  if (input_data.L <= 0) {
    showMessage("Beam length must be positive!", "warning");
    return false;
  }

  if (input_data.PL_dist < 0) {
    showMessage("Point load position cannot be negative!", "warning");
    return false;
  }

  return true;
}

// Display analysis results in a formatted table
function displayResults(results) {
  const resultsContainer = document.getElementById("results-container");

  // Create results table HTML
  let html = `
        <h3>Analysis Results</h3>
        <table class="ui celled table">
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Symbol</th>
                    <th>Value</th>
                    <th>Units</th>
                </tr>
            </thead>
            <tbody>
    `;

  // Define result mappings with proper formatting
  const resultMappings = [
    {
      key: "R_a",
      label: "Reaction Force A",
      symbol: "R<sub>a</sub>",
      units: "kN",
    },
    {
      key: "R_b",
      label: "Reaction Force B",
      symbol: "R<sub>b</sub>",
      units: "kN",
    },
    {
      key: "M_max",
      label: "Max Bending Moment",
      symbol: "M<sup>+</sup>",
      units: "kNm",
    },
    {
      key: "M_min",
      label: "Min Bending Moment",
      symbol: "M<sup>-</sup>",
      units: "kNm",
    },
    {
      key: "V_max",
      label: "Max Shear Force",
      symbol: "V<sup>+</sup>",
      units: "kN",
    },
    {
      key: "V_in",
      label: "Min Shear Force",
      symbol: "V<sup>-</sup>",
      units: "kN",
    },
    {
      key: "max_displacement",
      label: "Max Displacement",
      symbol: "δ<sub>max</sub>",
      units: "mm",
    },
    { key: "span_ratio", label: "Span Ratio", symbol: "L/δ", units: "-" },
  ];

  // Add rows for each result
  resultMappings.forEach((mapping) => {
    if (results[mapping.key] !== undefined) {
      const value =
        typeof results[mapping.key] === "number"
          ? results[mapping.key].toFixed(3)
          : results[mapping.key];

      // Color code based on positive/negative values
      const valueClass = value < 0 ? "negative" : "";

      html += `
                <tr>
                    <td>${mapping.label}</td>
                    <td>${mapping.symbol}</td>
                    <td class="${valueClass}"><strong>${value}</strong></td>
                    <td>${mapping.units}</td>
                </tr>
            `;
    }
  });

  html += `
            </tbody>
        </table>
    `;

  // Add summary cards for key values
  html += `
        <div class="ui three statistics" style="margin-top: 20px;">
            <div class="statistic">
                <div class="value">
                    ${Math.abs(results.M_max || 0).toFixed(2)}
                </div>
                <div class="label">
                    Max Moment (kNm)
                </div>
            </div>
            <div class="statistic">
                <div class="value">
                    ${Math.abs(results.V_max || 0).toFixed(2)}
                </div>
                <div class="label">
                    Max Shear (kN)
                </div>
            </div>
            <div class="statistic">
                <div class="value">
                    ${Math.abs(results.max_displacement || 0).toFixed(2)}
                </div>
                <div class="label">
                    Max Deflection (mm)
                </div>
            </div>
        </div>
    `;

  resultsContainer.innerHTML = html;
  resultsContainer.style.display = "block";
}

// Create displacement graph using Chart.js
function createDisplacementGraph(displacementArray, beamLength) {
  // Show graph container
  const graphContainer = document.getElementById("graph-container");
  graphContainer.style.display = "block";

  // Prepare data for chart
  const positions = [];
  const displacements = [];

  // Generate positions along the beam
  displacementArray.forEach((value, index) => {
    const position = (index / (displacementArray.length - 1)) * beamLength;
    positions.push(position.toFixed(1));
    displacements.push(value);
  });

  // Get canvas context
  const ctx = document.getElementById("displacementChart").getContext("2d");

  // Destroy existing chart if it exists
  if (displacementChart) {
    displacementChart.destroy();
  }

  // Create new chart
  displacementChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: positions,
      datasets: [
        {
          label: "Beam Displacement",
          data: displacements,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Beam Displacement Along Length",
        },
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Position (mm)",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Displacement (mm)",
          },
          // Invert y-axis as displacement is typically shown negative downward
          reverse: true,
        },
      },
    },
  });
}

// Show/hide loading indicator
function showLoading(show) {
  const button = document.querySelector('#beam-form button[type="submit"]');
  if (show) {
    button.classList.add("loading", "disabled");
    button.innerHTML = '<i class="spinner loading icon"></i> Analyzing...';
  } else {
    button.classList.remove("loading", "disabled");
    button.innerHTML = "Calculate Results";
  }
}

//Show message to user

function showMessage(message, type) {
  const messageDiv = document.getElementById("message-container");

  const typeClass =
    {
      success: "positive",
      error: "negative",
      warning: "warning",
    }[type] || "info";

  messageDiv.innerHTML = `
        <div class="ui ${typeClass} message">
            <i class="close icon"></i>
            <div class="header">${
              type.charAt(0).toUpperCase() + type.slice(1)
            }</div>
            <p>${message}</p>
        </div>
    `;

  // Add close functionality
  messageDiv.querySelector(".close").addEventListener("click", function () {
    messageDiv.innerHTML = "";
  });

  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageDiv.innerHTML = "";
  }, 5000);
}
