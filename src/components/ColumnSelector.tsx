import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColumnSelectorProps {
  columns: string[];
  xColumn: string;
  yColumn: string;
  onXChange: (col: string) => void;
  onYChange: (col: string) => void;
}

const ColumnSelector = ({
  columns,
  xColumn,
  yColumn,
  onXChange,
  onYChange,
}: ColumnSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-wrap items-center gap-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          X axis
        </span>
        <Select value={xColumn} onValueChange={onXChange}>
          <SelectTrigger className="w-[200px] bg-secondary border-border font-mono text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {columns.map((col) => (
              <SelectItem key={col} value={col} className="font-mono text-sm">
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-primary font-bold text-lg">→</span>

      <div className="flex items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Y axis
        </span>
        <Select value={yColumn} onValueChange={onYChange}>
          <SelectTrigger className="w-[200px] bg-secondary border-border font-mono text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {columns.map((col) => (
              <SelectItem key={col} value={col} className="font-mono text-sm">
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default ColumnSelector;
