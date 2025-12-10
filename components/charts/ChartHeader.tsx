import { ChartDefinition } from "@/lib/types/chart.types";
import Tag from "@/components/common/Tag";
import Badge from "@/components/common/Badge";

interface ChartHeaderProps {
  chart: ChartDefinition;
  showTags?: boolean;
  showBadges?: boolean;
}

export default function ChartHeader({
  chart,
  showTags = true,
  showBadges = true,
}: ChartHeaderProps) {
  return (
    <div className="space-y-4">
      {(showTags || showBadges) && (
        <div className="flex flex-wrap gap-2">
          {showBadges && chart.featured && (
            <Badge variant="featured">Featured</Badge>
          )}
          {showBadges && <Badge variant="category">{chart.category}</Badge>}
          {showTags &&
            chart.platforms.map((platform) => (
              <Tag key={platform} variant="platform">
                {platform}
              </Tag>
            ))}
        </div>
      )}

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {chart.title}
        </h1>
        <p className="text-lg text-gray-600">
          {chart.longDescription || chart.shortDescription}
        </p>
      </div>
    </div>
  );
}