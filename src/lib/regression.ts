export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  adjustedRSquared: number;
  mae: number;
  mse: number;
  rmse: number;
  equation: string;
  predictions: { x: number; y: number }[];
}

export function linearRegression(
  xValues: number[],
  yValues: number[]
): RegressionResult {
  const n = xValues.length;
  if (n === 0 || n !== yValues.length) {
    return { slope: 0, intercept: 0, rSquared: 0, adjustedRSquared: 0, mae: 0, mse: 0, rmse: 0, equation: "y = 0", predictions: [] };
  }

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const meanY = sumY / n;
  const residuals = xValues.map((x, i) => yValues[i] - (slope * x + intercept));
  const ssTotal = yValues.reduce((acc, y) => acc + (y - meanY) ** 2, 0);
  const ssResidual = residuals.reduce((acc, r) => acc + r * r, 0);
  const rSquared = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

  // Adjusted R² (k=1 predictor)
  const adjustedRSquared = n <= 2 ? rSquared : 1 - ((1 - rSquared) * (n - 1)) / (n - 2);

  // MAE, MSE, RMSE
  const mae = residuals.reduce((acc, r) => acc + Math.abs(r), 0) / n;
  const mse = ssResidual / n;
  const rmse = Math.sqrt(mse);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const predictions = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];

  const equation = `y = ${slope.toFixed(8)}x + ${intercept.toFixed(8)}`;

  return { slope, intercept, rSquared, adjustedRSquared, mae, mse, rmse, equation, predictions };
}
