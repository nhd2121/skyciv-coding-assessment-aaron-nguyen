// Input Data (maybe you should fetch this from the server - data/input.json)
let input_data = {
    "L": 1000,
    "support_a": "Pinned",
    "support_b": "Pinned",
    "DL_mag": 40,
    "PL_mag": 6,
    "PL_dist": 500,
    "calculate_deflection": true,
    "E": 200000,
    "I_z": 220000000,
    "uid": "1011-simple-beam-analysis-calculator"
};


// BEAM SVG CODE
// Get width of the SVG container
const width = document.getElementById('beam-svg').clientWidth; 
const height = 0.6 * width; // Fixed height for the SVG
buildBeamDiagram('beam-svg', input_data, height, width);