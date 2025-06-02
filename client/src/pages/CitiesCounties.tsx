import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Municipality } from "@shared/schema";

export default function CitiesCounties() {
  const { data: municipalities = [], isLoading } = useQuery<Municipality[]>({
    queryKey: ["/api/municipalities"],
  });

  const cities = municipalities.filter(m => m.type === "city");
  const counties = municipalities.filter(m => m.type === "county");

  const getRatingColor = (rating: string | null) => {
    if (!rating) return "bg-gray-100 text-gray-800";
    if (rating.startsWith("AAA")) return "bg-green-100 text-green-800";
    if (rating.startsWith("AA")) return "bg-blue-100 text-blue-800";
    if (rating.startsWith("A")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const renderMunicipalityTable = (data: Municipality[], type: string) => (
    <div className="overflow-x-auto">
      <table className="w-full data-table">
        <thead>
          <tr>
            <th>{type} Name</th>
            <th>County</th>
            <th>Region</th>
            <th>Outstanding Debt</th>
            <th>Per Capita Debt</th>
            <th>Population</th>
            <th>Credit Rating</th>
            <th>Last Issuance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((municipality) => (
            <tr key={municipality.id} className="hover:bg-accent cursor-pointer">
              <td>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                    <i className={`fas ${type === "City" ? "fa-city" : "fa-map"} text-secondary text-sm`}></i>
                  </div>
                  <div className="font-medium">{municipality.name}</div>
                </div>
              </td>
              <td>{municipality.county}</td>
              <td>{municipality.region}</td>
              <td className="font-medium">
                ${(parseFloat(municipality.outstandingDebt) / 1000000000).toFixed(2)}B
              </td>
              <td>
                {municipality.perCapitaDebt ? `$${parseFloat(municipality.perCapitaDebt).toLocaleString()}` : "N/A"}
              </td>
              <td>{municipality.population?.toLocaleString() || "N/A"}</td>
              <td>
                {municipality.creditRating && (
                  <Badge className={getRatingColor(municipality.creditRating)}>
                    {municipality.creditRating}
                  </Badge>
                )}
              </td>
              <td>{municipality.lastIssuanceDate ? new Date(municipality.lastIssuanceDate).toLocaleDateString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cities & Counties</h1>
          <p className="text-muted-foreground mt-2">Texas municipal and county government finances</p>
        </div>

        <Tabs defaultValue="cities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="counties">Counties</TabsTrigger>
          </TabsList>

          <TabsContent value="cities" className="space-y-6">
            {/* City Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{cities.length}</div>
                  <p className="text-sm text-muted-foreground">Total Cities</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    ${(cities.reduce((sum, d) => sum + parseFloat(d.outstandingDebt), 0) / 1000000000).toFixed(1)}B
                  </div>
                  <p className="text-sm text-muted-foreground">Total Debt</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {cities.reduce((sum, d) => sum + (d.population || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Population</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">AA</div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Cities Table */}
            <Card>
              <CardHeader>
                <CardTitle>City Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading cities...</div>
                ) : (
                  renderMunicipalityTable(cities, "City")
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="counties" className="space-y-6">
            {/* County Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{counties.length}</div>
                  <p className="text-sm text-muted-foreground">Total Counties</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    ${(counties.reduce((sum, d) => sum + parseFloat(d.outstandingDebt), 0) / 1000000000).toFixed(1)}B
                  </div>
                  <p className="text-sm text-muted-foreground">Total Debt</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {counties.reduce((sum, d) => sum + (d.population || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Population</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">AA-</div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Counties Table */}
            <Card>
              <CardHeader>
                <CardTitle>County Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading counties...</div>
                ) : counties.length > 0 ? (
                  renderMunicipalityTable(counties, "County")
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No county data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
