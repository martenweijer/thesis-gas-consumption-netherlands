import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
}

export function YearSelector({ years, selectedYear, onChange }: YearSelectorProps) {
  return (
    <Card className="p-3 gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Year</label>
        <Select
          value={String(selectedYear)}
          onValueChange={(value) => onChange(Number(value))}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
