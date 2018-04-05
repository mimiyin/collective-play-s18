let data = [];
let num = 10;
let MIN, MAX;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Generate some fake data
  // Set range of data
  MIN = 10;
  MAX = height / num;
  for (let i = 0; i < num; i++) {
    let d = random(MIN, MAX);
    data.push(d);
  }

  // Plot data evenly across the screen
  let colW = width / data.length;
  fill(0);
  for (let i = 0; i < data.length; i++) {
    let x = (i * colW) + colW / 2;
    let y = data[i];
    ellipse(x, y, 10, 10);
  }

  // ADD DATA
  // Who matters?
  // Depending on how you use this data, it can
  // either be easy for 1 person to carry everyone,
  // or everyone has to contribute to meet the goal.
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  line(0, sum, width, sum);
  text("ADD", 10, sum);

  // MEAN (AVERAGE)
  // Who matters?
  // The majority rather than the minority.
  let mean = sum / data.length;
  line(0, mean, width, mean);
  text("MEAN", 50, mean);

  // FIND MIDPOINT
  // Who matters?
  // Only the highest and lowest values matter.
  let minD = MAX;
  let maxD = MIN;
  for (let i = 0; i < data.length; i++) {
    let d = data[i];
    if (d < minD) minD = d;
    if (d > maxD) maxD = d;
  }
  let midpoint = (minD + maxD) / 2;
  line(0, midpoint, width, midpoint);
  text("MIDPOINT", 100, midpoint);

  // ADD ABOVE MEAN, SUBTRACT BELOW MEAN
  // Who matters?
  // Values above the F mark contribute.
  // Values below the F mark take away.
  let addSubtract = 0;
  let F = 0.65*MAX;
  for (let i = 0; i < data.length; i++) {
    let d = data[i];
    if (d >= F) addSubtract += d;
    else addSubtract -= d;
  }
  line(0, addSubtract, width, addSubtract);
  text("ADD/SUBTRACT", 150, addSubtract);

  // AVG DEVIATION FROM THE MEAN
  // Who  matters?
  // Outliers. It doesn't matter how high or low your value is,
  // what counts is staying in sync with everyone else. Therefore
  // anyone not in sync with the group has a big impact.
  let sumDeviation = 0;
  for (let i = 0; i < data.length; i++) {
    let deviation = abs(data[i] - mean);
    sumDeviation += deviation;
  }
  let avgDeviation = sumDeviation / data.length;
  line(0, avgDeviation, width, avgDeviation);
  text("AVG DEVIATION", 250, avgDeviation);

  // SQUARE IT, MEAN IT
  // Who  matters?
  // Higher values have more weight.
  let sqSum = 0;
  for (let i = 0; i < data.length; i++) {
    let d = data[i];
    // Scale the value to the range of data, otherwise
    // the number will be off-the-charts huge
    sqSum += ((d * d) / (MAX * MAX)) * MAX;
  }
  let sqmean = sqSum / data.length;
  line(0, sqmean, width, sqmean);
  text("MEAN OF SQUARES", width - 150, sqmean);

}
