import { useState, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Download, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { linearRegression, RegressionResult } from "@/lib/regression";
import { toPng } from "html-to-image";
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  id: number;
  x: string;
  y: string;
}

let nextId = 1;
const createPoint = (): DataPoint => ({ id: nextId++, x: "", y: "" });

const ManualDataEntry = () => {
  const [points, setPoints] = useState<DataPoint[]>([createPoint(), createPoint(), createPoint()]);
  const chartRef = useRef<HTMLDivElement>(null);

  const addPoint = () => setPoints((p) => [...p, createPoint()]);

  const removePoint = (id: number) =>
    setPoints((p) => (p.length <= 2 ? p : p.filter((pt) => pt.id !== id)));

  const updatePoint = (id: number, field: "x" | "y", value: string) => {
    setPoints((p) => p.map((pt) => (pt.id === id ? { ...pt, [field]: value } : pt)));
  };

  const { scatterData, regression } = useMemo(() => {
    const valid = points
      .map((p) => ({ x: parseFloat(p.x), y: parseFloat(p.y) }))
      .filter((p) => !isNaN(p.x) && !isNaN(p.y));

    if (valid.length < 2) return { scatterData: [], regression: null };

    const reg = linearRegression(
      valid.map((p) => p.x),
      valid.map((p) => p.y)
    );
    return { scatterData: valid, regression: reg };
  }, [points]);

  const lineData = useMemo(() => {
    if (!regression || regression.predictions.length < 2) return [];
    const [start, end] = regression.predictions;
    const steps = 100;
    const result = [];
    for (let i = 0; i <= steps; i++) {
      const x = start.x + (end.x - start.x) * (i / steps);
      result.push({ x, line: regression.slope * x + regression.intercept });
    }
    return result;
  }, [regression]);

  const combined = useMemo(() => {
    const arr = [
      ...scatterData.map((d) => ({ x: d.x, scatter: d.y })),
      ...lineData.map((d) => ({ x: d.x, line: d.line })),
    ];
    arr.sort((a, b) => a.x - b.x);
    return arr;
  }, [scatterData, lineData]);

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#0d1117",
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = "manual-regression.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export chart", err);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-lg p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Manual Data Entry</h2>
      </div>

      {/* Data input table */}
      <div className="mb-4 max-h-64 overflow-y-auto pr-1 space-y-2">
        <div className="grid grid-cols-[1fr_1fr_40px] gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground px-1">
            X value
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground px-1">
            Y value
          </span>
          <span />
        </div>
        {points.map((pt, i) => (
          <motion.div
            key={pt.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-[1fr_1fr_40px] gap-2 items-center"
          >
            <Input
              type="number"
              placeholder={`x${i + 1}`}
              value={pt.x}
              onChange={(e) => updatePoint(pt.id, "x", e.target.value)}
              className="bg-secondary border-border font-mono text-sm h-9"
            />
            <Input
              type="number"
              placeholder={`y${i + 1}`}
              value={pt.y}
              onChange={(e) => updatePoint(pt.id, "y", e.target.value)}
              className="bg-secondary border-border font-mono text-sm h-9"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removePoint(pt.id)}
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
              disabled={points.length <= 2}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addPoint}
        className="gap-2 font-mono text-xs border-primary/30 text-primary hover:bg-primary/10 mb-5"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Point
      </Button>

      {/* Results */}
      {regression && scatterData.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Equation", value: regression.equation },
              { label: "R² Score", value: regression.rSquared.toFixed(10) },
              { label: "Slope", value: regression.slope.toFixed(10) },
              { label: "Intercept", value: regression.intercept.toFixed(10) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md bg-secondary/60 p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {label}
                </p>
                <p className="font-mono text-xs text-foreground truncate" title={value}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Regression Plot
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
            <div ref={chartRef} className="rounded-md bg-card p-2">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={combined} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tick={{ fill: "hsl(215 12% 55%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                    label={{
                      value: "X",
                      position: "bottom",
                      offset: 15,
                      fill: "hsl(210 20% 85%)",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(215 12% 55%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                    label={{
                      value: "Y",
                      angle: -90,
                      position: "insideLeft",
                      offset: -5,
                      fill: "hsl(210 20% 85%)",
                      fontSize: 12,
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
                  <Scatter dataKey="scatter" fill="hsl(190 95% 50%)" fillOpacity={0.8} r={5} />
                  <Line dataKey="line" stroke="hsl(340 75% 55%)" strokeWidth={2.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {scatterData.length < 2 && (
        <p className="text-xs text-muted-foreground text-center py-3">
          Enter at least 2 valid data points to compute regression
        </p>
      )}
    </motion.div>
  );
};

export default ManualDataEntry;
