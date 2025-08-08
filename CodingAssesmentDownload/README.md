# SkyCiv Coding Test

## How to start

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with the following:

- SKYCIV_AUTH=qd@skyciv.com
- SKYCIV_KEY=eJJQX516y4vygq1Qe1w6acsjY8nudFh0AcTPG7bsrdvsgijXLNZhDMwKF4XwemAq
- SKYCIV_UID=1011-simple-beam-analysis-calculator

4. Run the application: `npm start`
5. Open browser at `http://localhost:3000`

## Technology

- Node/Express Backend
- JS/HTML (vanilla JS)
- Semantic UI [https://semantic-ui.com/]

## API Notes

### Testing Parameters to Use

| Parameter | Description                  | Example                                                            |
| --------- | ---------------------------- | ------------------------------------------------------------------ |
| url       | Endpoint to send the request | `https://qd.skyciv.com/run`                                        |
| auth      | Authentication email/user    | `qd@skyciv.com`                                                    |
| uid       | Calculator/analysis ID       | `1011-simple-beam-analysis-calculator`                             |
| key       | API key for authorization    | `eJJQX516y4vygq1Qe1w6acsjY8nudFh0AcTPG7bsrdvsgijXLNZhDMwKF4XwemAq` |

### Example Fetch Request Payload

```js
const body = {
  payload: {
    uid: "1011-simple-beam-analysis-calculator",
    auth: "qd@skyciv.com",
    key: "eJJQX516y4vygq1Qe1w6acsjY8nudFh0AcTPG7bsrdvsgijXLNZhDMwKF4XwemAq",
    input: input_data,
    calcs_only: true,
  },
};

const bodyString = JSON.stringify(body);
```

## API Results

Please include these results in your results table. We have added descriptions to help you interpret them. You may wish to generate more results, such as absolute maximum reactions, bending, and shear forces.

| Key                | Label                      | Symbol          | Units | Description                                 |
| ------------------ | -------------------------- | --------------- | ----- | ------------------------------------------- |
| R_a                | Fy A                       | R<sub>a</sub>   | kN    | Reaction Force at support A (left side)     |
| R_b                | Fy B                       | R<sub>b</sub>   | kN    | Reaction force at support B (left side)     |
| M_max              | Max Bending                | M<sup>\*</sup>+ | kNm   | Maximum positive bending moment             |
| M_min              | Min Bending                | M<sup>\*</sup>- | kNm   | Minimum (negative) bending moment           |
| V_max              | Max Shear Force            | V<sup>\*</sup>+ | kN    | Maximum positive shear force                |
| V_in               | Min Shear Force            | V<sup>\*</sup>- | kN    | Minimum (negative) shear force              |
| max_displacement   | Max Displacement           | —               | mm    | Maximum displacement                        |
| displacement_array | Displacement Results Array | —               | —     | Maybe this could be used to create a graph? |
| span_ratio         | Span Ratio                 | —               | —     | Span length ratio                           |
