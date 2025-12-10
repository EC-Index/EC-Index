import { ChartSeries, DataPoint } from "@/lib/types/chart.types";

export class DataTransform {
  /**
   * Normalize series to consistent format
   */
  static normalizeSeries(series: ChartSeries[]): ChartSeries[] {
    return series.map((s) => ({
      ...s,
      data: this.normalizeDataPoints(s.data),
    }));
  }

  /**
   * Normalize data points (remove nulls, sort, dedupe)
   */
  static normalizeDataPoints(data: DataPoint[]): DataPoint[] {
    return data
      .filter((point) => point.value != null && !isNaN(point.value))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc: DataPoint[], current) => {
        // Remove duplicates by date
        if (!acc.find((p) => p.date === current.date)) {
          acc.push(current);
        }
        return acc;
      }, []);
  }

  /**
   * Resample data to specific interval
   */
  static resample(
    data: DataPoint[],
    interval: "daily" | "weekly" | "monthly"
  ): DataPoint[] {
    // Group by interval and aggregate
    const grouped = new Map<string, DataPoint[]>();

    data.forEach((point) => {
      const date = new Date(point.date);
      let key: string;

      switch (interval) {
        case "daily":
          key = date.toISOString().split("T")[0];
          break;
        case "weekly":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split("T")[0];
          break;
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;
      }

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(point);
    });

    // Average values for each group
    return Array.from(grouped.entries()).map(([date, points]) => ({
      date,
      value: points.reduce((sum, p) => sum + p.value, 0) / points.length,
    }));
  }

  /**
   * Calculate moving average
   */
  static movingAverage(data: DataPoint[], window: number): DataPoint[] {
    return data.map((point, index) => {
      const start = Math.max(0, index - window + 1);
      const subset = data.slice(start, index + 1);
      const avg = subset.reduce((sum, p) => sum + p.value, 0) / subset.length;

      return {
        ...point,
        value: avg,
      };
    });
  }

  /**
   * Calculate percentage change
   */
  static percentageChange(data: DataPoint[]): DataPoint[] {
    if (data.length === 0) return [];

    const baseValue = data[0].value;
    
    return data.map((point) => ({
      ...point,
      value: ((point.value - baseValue) / baseValue) * 100,
    }));
  }

  /**
   * Index series to base 100
   */
  static indexToBase(series: ChartSeries[], baseDate?: string): ChartSeries[] {
    return series.map((s) => {
      const baseIndex = baseDate
        ? s.data.findIndex((p) => p.date === baseDate)
        : 0;
      
      const baseValue = s.data[baseIndex]?.value || s.data[0]?.value || 1;

      return {
        ...s,
        data: s.data.map((point) => ({
          ...point,
          value: (point.value / baseValue) * 100,
        })),
      };
    });
  }
}