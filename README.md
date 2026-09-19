# ComProg Calculator for CEDT

A simple HTML/CSS/JavaScript calculator for CEDT Computer Programming.

## Features

1. **Final Target**
   - Enter Quiz/collected score (default 10/10)
   - Enter Midterm score out of 400
   - Choose S (>=60) or S* (>=80)
   - Calculates the required Final score out of 400

2. **Grade Calculator**
   - Mode `10 / 35 / 55`
   - Mode `10 / 400 / 400`
   - Calculates U, S, or S*

## Grading

- U: `< 60`
- S: `>= 60`
- S*: `>= 80`

## Conversion

- Midterm: `score / 400 * 35`
- Final: `score / 400 * 55`

## Run

No build system is required.

Open `index.html` in a browser, or serve the folder with any static server.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

The CEDT logo is loaded from the URL provided in the project request.
