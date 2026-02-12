import { motion } from "framer-motion";
import { RegressionResult } from "@/lib/regression";
import { TrendingUp, Hash, Target, Code2 } from "lucide-react";

interface StatsPanelProps {
  regression: RegressionResult;
  dataCount: number;
}

const statCards = [
  { key: "equation", icon: Code2, label: "Equation" },
  { key: "rSquared", icon: Target, label: "R² Score" },
  { key: "slope", icon: TrendingUp, label: "Slope" },
  { key: "intercept", icon: Hash, label: "Intercept" },
] as const;

const StatsPanel = ({ regression, dataCount }: StatsPanelProps) => {
  const getValue = (key: string) => {
    switch (key) {
      case "equation":
        return regression.equation;
      case "rSquared":
        return regression.rSquared.toFixed(6);
      case "slope":
        return regression.slope.toFixed(6);
      case "intercept":
        return regression.intercept.toFixed(6);
      default:
        return "";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {statCards.map(({ key, icon: Icon, label }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="glass rounded-lg p-4 flex items-start gap-3"
        >
          <div className="rounded-md bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {label}
            </p>
            <p className="font-mono text-sm text-foreground truncate" title={getValue(key)}>
              {getValue(key)}
            </p>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-lg p-4 flex items-center gap-3 sm:col-span-2"
      >
        <div className="rounded-md bg-accent/10 p-2">
          <Hash className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Data Points
          </p>
          <p className="font-mono text-sm text-foreground">{dataCount}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsPanel;
