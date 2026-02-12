export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  equation: string;
  predictions: { x: number; y: number }[];
}

export function linearRegression(
  xValues: number[],
  yValues: number[]
): RegressionResult {
  const n = xValues.length;
  if (n === 0 || n !== yValues.length) {
    return { slope: 0, intercept: 0, rSquared: 0, equation: "y = 0", predictions: [] };
  }

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);
  const sumY2 = yValues.reduce((acc, y) => acc + y * y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R-squared
  const meanY = sumY / n;
  const ssTotal = yValues.reduce((acc, y) => acc + (y - meanY) ** 2, 0);
  const ssResidual = xValues.reduce(
    (acc, x, i) => acc + (yValues[i] - (slope * x + intercept)) ** 2,
    0
  );
  const rSquared = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const predictions = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];

  const equation = `y = ${slope.toFixed(8)}x + ${intercept.toFixed(8)}`;

  return { slope, intercept, rSquared, equation, predictions };
}
