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

