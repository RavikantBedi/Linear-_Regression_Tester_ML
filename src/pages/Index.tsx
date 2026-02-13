import { useState, useMemo, useCallback } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";
import { Sparkles, Database, FileUp, Keyboard } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ColumnSelector from "@/components/ColumnSelector";
import RegressionChart from "@/components/RegressionChart";
import StatsPanel from "@/components/StatsPanel";
import PredictionInput from "@/components/PredictionInput";
import ManualDataEntry from "@/components/ManualDataEntry";
import { linearRegression } from "@/lib/regression";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [rawData, setRawData] = useState<Record<string, string>[]>([]);
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");
  const [predictionPoint, setPredictionPoint] = useState<{ x: number; y: number } | null>(null);

  const handleFileLoaded = useCallback((text: string) => {
    const result = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (!result.data.length) return;

    const cols = Object.keys(result.data[0]);
    const numeric = cols.filter((col) => {
      const vals = result.data.slice(0, 20).map((r) => parseFloat(r[col]));
      return vals.every((v) => !isNaN(v));
    });

    setRawData(result.data);
    setNumericColumns(numeric);

    if (numeric.length >= 2) {
      setXColumn(numeric[numeric.length - 2]);
      setYColumn(numeric[numeric.length - 1]);
    }
  }, []);

  const loadSampleData = useCallback(async () => {
    const res = await fetch("/data/Ecommerce_Customers.csv");
    const text = await res.text();
    handleFileLoaded(text);
  }, [handleFileLoaded]);

  const { scatterData, regression } = useMemo(() => {
    if (!xColumn || !yColumn || !rawData.length) {
      return { scatterData: [], regression: null };
    }

    const points = rawData
      .map((row) => ({
        x: parseFloat(row[xColumn]),
        y: parseFloat(row[yColumn]),
      }))
      .filter((p) => !isNaN(p.x) && !isNaN(p.y));

    const reg = linearRegression(
      points.map((p) => p.x),
      points.map((p) => p.y)
    );

    return { scatterData: points, regression: reg };
  }, [rawData, xColumn, yColumn]);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Linear Regression Visualizer
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground glow-text mb-2">
            Regression<span className="text-primary">Lab</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Upload a CSV dataset and instantly visualize linear regression with
            interactive charts and statistics.
          </p>
        </motion.header>

        {/* Tabs for CSV Upload vs Manual Entry */}
        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary/60 mb-6">
            <TabsTrigger value="csv" className="gap-2 font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <FileUp className="h-3.5 w-3.5" />
              CSV Upload
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2 font-mono text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Keyboard className="h-3.5 w-3.5" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv">
            {/* Upload Section */}
            <div className="mb-6 space-y-4">
              <FileUpload onFileLoaded={handleFileLoaded} />
              {!rawData.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleData}
                    className="gap-2 font-mono text-xs border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <Database className="h-3.5 w-3.5" />
                    Load Sample Dataset
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Column Selector */}
            {numericColumns.length >= 2 && (
              <div className="mb-6 flex justify-center">
                <ColumnSelector
                  columns={numericColumns}
                  xColumn={xColumn}
                  yColumn={yColumn}
                  onXChange={setXColumn}
                  onYChange={setYColumn}
                />
              </div>
            )}

            {/* Chart + Stats */}
            {regression && scatterData.length > 0 && (
              <div className="space-y-6">
                <RegressionChart
                  data={scatterData}
                  regression={regression}
                  xLabel={xColumn}
                  yLabel={yColumn}
                  predictionPoint={predictionPoint}
                />
                <StatsPanel regression={regression} dataCount={scatterData.length} />
                <PredictionInput regression={regression} xLabel={xColumn} yLabel={yColumn} onPredict={setPredictionPoint} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual">
            <div className="max-w-2xl mx-auto">
              <ManualDataEntry />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
