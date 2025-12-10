import { ChartMetadata } from "@/lib/types/chart.types";
import { formatDate } from "@/lib/utils/format";
import { Clock, Database, TrendingUp, BarChart3 } from "lucide-react";

interface ChartMetaProps {
  metadata: ChartMetadata;
  className?: string;
}

export default function ChartMeta({ metadata, className = "" }: ChartMetaProps) {
  const items = [
    {
      icon: Clock,
      label: "Last Updated",
      value: formatDate(metadata.lastUpdated),
    },
    {
      icon: Database,
      label: "Data Source",
      value: metadata.dataSource,
    },
    ...(metadata.sampleSize
      ? [
          {
            icon: BarChart3,
            label: "Sample Size",
            value: metadata.sampleSize,
          },
        ]
      : []),
    ...(metadata.updateFrequency
      ? [
          {
            icon: TrendingUp,
            label: "Update Frequency",
            value: metadata.updateFrequency,
          },
        ]
      : []),
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <item.icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-1">
              {item.label}
            </p>
            <p className="text-sm text-gray-900 truncate">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}