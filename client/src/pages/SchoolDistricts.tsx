import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Municipality } from "@shared/schema";

export default function SchoolDistricts() {
  const { data: municipalities = [], isLoading } = useQuery<Municipality[]>({
    queryKey: ["/api/municipalities"],
  });

  const schoolDistricts = municipalities.filter(m => m.type === "school_district");

  const getRatingColor = (rating: string | null) => {
    if (!rating) return "bg-gray-100 text-gray-800";
    if (rating.startsWith("AAA")) return "bg-green-100 text-green-800";
    if (rating.startsWith("AA")) return "bg-blue-100 text-blue-800";
    if (rating.startsWith("A")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">School Districts</h1>
          <p className="text-muted-foreground mt-2">Texas Independent School District financial profiles</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{schoolDistricts.length}</div>
              <p className="text-sm text-muted-foreground">Total ISDs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                ${(schoolDistricts.reduce((sum, d) => sum + parseFloat(d.outstandingDebt), 0) / 1000000000).toFixed(1)}B
              </div>
              <p className="text-sm text-muted-foreground">Total Debt</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {schoolDistricts.reduce((sum, d) => sum + (d.population || 0), 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">AA-</div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* School Districts Table */}
        <Card>
          <CardHeader>
            <CardTitle>School District Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading school districts...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th>District Name</th>
                      <th>County</th>
                      <th>Region</th>
                      <th>Outstanding Debt</th>
                      <th>Per Capita Debt</th>
                      <th>Students</th>
                      <th>Credit Rating</th>
                      <th>Last Issuance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolDistricts.map((district) => (
                      <tr key={district.id} className="hover:bg-accent cursor-pointer">
                        <td>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                              <i className="fas fa-school text-primary text-sm"></i>
                            </div>
                            <div className="font-medium">{district.name}</div>
                          </div>
                        </td>
                        <td>{district.county}</td>
                        <td>{district.region}</td>
                        <td className="font-medium">
                          ${(parseFloat(district.outstandingDebt) / 1000000000).toFixed(2)}B
                        </td>
                        <td>
                          {district.perCapitaDebt ? `$${parseFloat(district.perCapitaDebt).toLocaleString()}` : "N/A"}
                        </td>
                        <td>{district.population?.toLocaleString() || "N/A"}</td>
                        <td>
                          {district.creditRating && (
                            <Badge className={getRatingColor(district.creditRating)}>
                              {district.creditRating}
                            </Badge>
                          )}
                        </td>
                        <td>{district.lastIssuanceDate ? new Date(district.lastIssuanceDate).toLocaleDateString() : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
