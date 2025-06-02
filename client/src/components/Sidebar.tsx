import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FilterState } from "@/types";

interface SidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function Sidebar({ filters, onFiltersChange }: SidebarProps) {
  const handleEntityTypeChange = (entityType: string, checked: boolean) => {
    const newEntityTypes = checked
      ? [...filters.entityTypes, entityType]
      : filters.entityTypes.filter(type => type !== entityType);
    
    onFiltersChange({ ...filters, entityTypes: newEntityTypes });
  };

  const handleRatingChange = (rating: string, checked: boolean) => {
    const newRatings = checked
      ? [...filters.creditRatings, rating]
      : filters.creditRatings.filter(r => r !== rating);
    
    onFiltersChange({ ...filters, creditRatings: newRatings });
  };

  const handleDebtRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, minDebt: value[0] * 1000000 }); // Convert to actual value
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-900 shadow-sm border-r border-border flex-shrink-0">
      <div className="p-6">
        {/* Quick Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Quick Search</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by CUSIP, City, or ISD..."
              className="pl-10"
            />
            <i className="fas fa-search absolute left-3 top-3 text-muted-foreground"></i>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-6">
          {/* Entity Type */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Entity Type</h3>
            <div className="space-y-2">
              {[
                { value: "school_district", label: "School Districts", count: "1,247" },
                { value: "city", label: "Cities", count: "1,214" },
                { value: "county", label: "Counties", count: "254" },
                { value: "special_district", label: "Special Districts", count: "3,389" },
              ].map((entity) => (
                <div key={entity.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={entity.value}
                      checked={filters.entityTypes.includes(entity.value)}
                      onCheckedChange={(checked) => handleEntityTypeChange(entity.value, checked as boolean)}
                    />
                    <label htmlFor={entity.value} className="text-sm font-medium">
                      {entity.label}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground">{entity.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Credit Rating */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Credit Rating</h3>
            <div className="space-y-2">
              {[
                { value: "AAA", label: "AAA", count: "142" },
                { value: "AA", label: "AA+/AA/AA-", count: "1,856" },
                { value: "A", label: "A+/A/A-", count: "2,341" },
                { value: "BBB", label: "BBB & Below", count: "567" },
              ].map((rating) => (
                <div key={rating.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={rating.value}
                      checked={filters.creditRatings.includes(rating.value)}
                      onCheckedChange={(checked) => handleRatingChange(rating.value, checked as boolean)}
                    />
                    <label htmlFor={rating.value} className="text-sm font-medium">
                      {rating.label}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground">{rating.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Debt Amount */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Outstanding Debt</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Minimum ($M)</label>
                <Slider
                  value={[filters.minDebt / 1000000]}
                  onValueChange={handleDebtRangeChange}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$0M</span>
                  <span>${filters.minDebt / 1000000}M</span>
                  <span>$1B+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Region */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Texas Region</h3>
            <Select value={filters.region} onValueChange={(value) => onFiltersChange({ ...filters, region: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Regions</SelectItem>
                <SelectItem value="North Texas">North Texas</SelectItem>
                <SelectItem value="East Texas">East Texas</SelectItem>
                <SelectItem value="Central Texas">Central Texas</SelectItem>
                <SelectItem value="South Texas">South Texas</SelectItem>
                <SelectItem value="West Texas">West Texas</SelectItem>
                <SelectItem value="Gulf Coast">Gulf Coast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Apply Filters Button */}
        <Button className="w-full mt-6">
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}
