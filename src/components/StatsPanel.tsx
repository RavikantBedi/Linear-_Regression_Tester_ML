import { motion } from "framer-motion";
import { RegressionResult } from "@/lib/regression";
import { TrendingUp, Hash, Target, Code2, BarChart3, Activity } from "lucide-react";

interface StatsPanelProps {
  regression: RegressionResult;
  dataCount: number;
}

const statCards = [
  { key: "equation", icon: Code2, label: "Equation" },
  { key: "rSquared", icon: Target, label: "R² Score" },
  { key: "adjustedRSquared", icon: Target, label: "Adjusted R²" },
  { key: "slope", icon: TrendingUp, label: "Slope" },
  { key: "intercept", icon: Hash, label: "Intercept" },
  { key: "mae", icon: BarChart3, label: "MAE" },
  { key: "mse", icon: Activity, label: "MSE" },
  { key: "rmse", icon: Activity, label: "RMSE" },
] as const;

const StatsPanel = ({ regression, dataCount }: StatsPanelProps) => {
  const getValue = (key: string) => {
    switch (key) {
      case "equation":
        return regression.equation;
      case "rSquared":
        return regression.rSquared.toFixed(10);
      case "adjustedRSquared":
        return regression.adjustedRSquared.toFixed(10);
      case "slope":
        return regression.slope.toFixed(10);
      case "intercept":
        return regression.intercept.toFixed(10);
      case "mae":
        return regression.mae.toFixed(6);
      case "mse":
        return regression.mse.toFixed(6);
      case "rmse":
        return regression.rmse.toFixed(6);
      default:
        return "";
    }
  };

  return (
    <div className="glass rounded-lg p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {statCards.map(({ key, icon: Icon, label }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-md bg-secondary/60 p-3 flex items-start gap-3"
          >
            <div className="rounded-md bg-primary/10 p-2 shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {label}
              </p>
              <p className="font-mono text-xs text-foreground break-all" title={getValue(key)}>
                {getValue(key)}
              </p>
            </div>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-md bg-secondary/60 p-3 flex items-center gap-3"
        >
          <div className="rounded-md bg-accent/10 p-2 shrink-0">
            <Hash className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Data Points
            </p>
            <p className="font-mono text-xs text-foreground">{dataCount}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsPanel;
