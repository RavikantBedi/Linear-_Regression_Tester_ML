import { useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { toPng } from "html-to-image";
import { RegressionResult } from "@/lib/regression";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface RegressionChartProps {
  data: { x: number; y: number }[];
  regression: RegressionResult;
  xLabel: string;
  yLabel: string;
}

const RegressionChart = ({ data, regression, xLabel, yLabel }: RegressionChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#0d1117",
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `regression-${xLabel}-vs-${yLabel}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export chart", err);
    }
  }, [xLabel, yLabel]);
  const lineData = useMemo(() => {
    if (regression.predictions.length < 2) return [];
    const [start, end] = regression.predictions;
    const steps = 200;
    const result = [];
    for (let i = 0; i <= steps; i++) {
      const x = start.x + (end.x - start.x) * (i / steps);
      result.push({ x, line: regression.slope * x + regression.intercept });
    }
    return result;
  }, [regression]);

  const combined = useMemo(() => {
    const map = new Map<number, any>();
    data.forEach((d) => {
      map.set(Math.random(), { x: d.x, scatter: d.y });
    });
    return [...Array.from(map.values()), ...lineData.map((d) => ({ x: d.x, line: d.line }))];
  }, [data, lineData]);

  // Sort by x for line rendering
  combined.sort((a, b) => a.x - b.x);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Scatter Plot & Regression Line
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="gap-2 font-mono text-xs border-primary/30 text-primary hover:bg-primary/10"
        >
          <Download className="h-3.5 w-3.5" />
          Export PNG
        </Button>
      </div>
      <div ref={chartRef}>
      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart data={combined} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
          <XAxis
            dataKey="x"
            type="number"
            domain={["dataMin - 1", "dataMax + 1"]}
            tick={{ fill: "hsl(215 12% 55%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
            label={{
              value: xLabel,
              position: "bottom",
              offset: 20,
              fill: "hsl(210 20% 85%)",
              fontSize: 12,
              fontFamily: "Space Grotesk",
            }}
          />
          <YAxis
            tick={{ fill: "hsl(215 12% 55%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              offset: -5,
              fill: "hsl(210 20% 85%)",
              fontSize: 12,
              fontFamily: "Space Grotesk",
            }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(220 18% 10%)",
              border: "1px solid hsl(220 14% 18%)",
              borderRadius: "8px",
              fontFamily: "JetBrains Mono",
              fontSize: "12px",
              color: "hsl(210 20% 92%)",
            }}
          />
          <Scatter dataKey="scatter" fill="hsl(190 95% 50%)" fillOpacity={0.7} r={4} />
          <Line
            dataKey="line"
            stroke="hsl(340 75% 55%)"
            strokeWidth={2.5}
            dot={false}
            strokeDasharray="0"
          />
        </ComposedChart>
      </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RegressionChart;
