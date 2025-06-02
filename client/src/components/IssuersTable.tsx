import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Municipality } from "@shared/schema";
import { FilterState } from "@/types";

interface IssuersTableProps {
  filters: FilterState;
}

export default function IssuersTable({ filters }: IssuersTableProps) {
  const { data: municipalities = [], isLoading } = useQuery<Municipality[]>({
    queryKey: ["/api/municipalities"],
  });

  // Apply client-side filtering based on the filters
  const filteredMunicipalities = municipalities
    .filter(m => filters.entityTypes.length === 0 || filters.entityTypes.includes(m.type))
    .filter(m => !filters.region || m.region === filters.region)
    .filter(m => parseFloat(m.outstandingDebt) >= filters.minDebt)
    .sort((a, b) => parseFloat(b.outstandingDebt) - parseFloat(a.outstandingDebt))
    .slice(0, 10); // Top 10

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "school_district":
        return "fa-school";
      case "city":
        return "fa-city";
      case "county":
        return "fa-map";
      default:
        return "fa-building";
    }
  };

  const getEntityTypeLabel = (type: string) => {
    switch (type) {
      case "school_district":
        return "School District";
      case "city":
        return "City";
      case "county":
        return "County";
      case "special_district":
        return "Special District";
      default:
        return type;
    }
  };

  const getEntityTypeColor = (type: string) => {
    switch (type) {
      case "school_district":
        return "bg-blue-100 text-blue-800";
      case "city":
        return "bg-green-100 text-green-800";
      case "county":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingColor = (rating: string | null) => {
    if (!rating) return "bg-gray-100 text-gray-800";
    if (rating.startsWith("AAA")) return "bg-green-100 text-green-800";
    if (rating.startsWith("AA")) return "bg-blue-100 text-blue-800";
    if (rating.startsWith("A")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Municipal Bond Issuers</CardTitle>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-muted-foreground hover:text-foreground">
              <i className="fas fa-filter"></i>
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground">
              <i className="fas fa-sort"></i>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading municipalities...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>Entity</th>
                    <th>Type</th>
                    <th>Outstanding Debt</th>
                    <th>Rating</th>
                    <th>Last Issuance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMunicipalities.map((municipality) => (
                    <tr key={municipality.id} className="hover:bg-accent cursor-pointer">
                      <td>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <i className={`fas ${getEntityIcon(municipality.type)} text-primary text-sm`}></i>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-foreground">{municipality.name}</div>
                            <div className="text-sm text-muted-foreground">{municipality.county}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge className={getEntityTypeColor(municipality.type)}>
                          {getEntityTypeLabel(municipality.type)}
                        </Badge>
                      </td>
                      <td className="text-sm font-medium">
                        ${(parseFloat(municipality.outstandingDebt) / 1000000000).toFixed(1)}B
                      </td>
                      <td>
                        {municipality.creditRating && (
                          <Badge className={getRatingColor(municipality.creditRating)}>
                            {municipality.creditRating}
                          </Badge>
                        )}
                      </td>
                      <td className="text-sm text-muted-foreground">
                        {municipality.lastIssuanceDate 
                          ? new Date(municipality.lastIssuanceDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })
                          : "N/A"
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing top {filteredMunicipalities.length} of {municipalities.length} entities
                </p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-border rounded hover:bg-accent disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm border border-border rounded hover:bg-accent">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
