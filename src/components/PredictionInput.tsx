import { useState } from "react";
import { motion } from "framer-motion";
import { RegressionResult } from "@/lib/regression";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Target, TrendingUp } from "lucide-react";

interface PredictionInputProps {
  regression: RegressionResult;
  xLabel: string;
  yLabel: string;
}

const PredictionInput = ({ regression, xLabel, yLabel }: PredictionInputProps) => {
  const [inputX, setInputX] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);

  const handlePredict = () => {
    const x = parseFloat(inputX);
    if (isNaN(x)) return;
    setPrediction(regression.slope * x + regression.intercept);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-lg p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-md bg-primary/10 p-2">
          <Calculator className="h-4 w-4 text-primary" />
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Predict {yLabel}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-mono text-muted-foreground mb-1 block">
            Enter {xLabel} value
          </label>
          <Input
            type="number"
            placeholder={`e.g. 3.5`}
            value={inputX}
            onChange={(e) => setInputX(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePredict()}
            className="font-mono text-sm bg-secondary border-border"
          />
        </div>
        <Button
          onClick={handlePredict}
          disabled={!inputX || isNaN(parseFloat(inputX))}
          className="gap-2 font-mono text-xs shrink-0"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Predict
        </Button>
      </div>

      {prediction !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div className="rounded-md bg-primary/10 border border-primary/20 p-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Predicted {yLabel}
            </p>
            <p className="font-mono text-lg font-bold text-primary">
              {prediction.toFixed(6)}
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              When {xLabel} = {inputX}
            </p>
          </div>
          <div className="rounded-md bg-secondary/60 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Model Accuracy (R²)
              </p>
            </div>
            <p className="font-mono text-lg font-bold text-foreground">
              {(regression.rSquared * 100).toFixed(4)}%
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {regression.rSquared >= 0.8 ? "Strong fit" : regression.rSquared >= 0.5 ? "Moderate fit" : "Weak fit"}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PredictionInput;
