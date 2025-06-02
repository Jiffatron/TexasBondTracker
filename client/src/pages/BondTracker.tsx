import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bond } from "@shared/schema";

export default function BondTracker() {
  const [searchFilters, setSearchFilters] = useState({
    cusip: "",
    bondType: "",
    maturityRange: "",
    yieldRange: "",
  });

  const { data: bonds = [], isLoading } = useQuery<Bond[]>({
    queryKey: ["/api/bonds"],
  });

  const handleSearch = () => {
    // This would trigger a filtered search
    console.log("Searching with filters:", searchFilters);
  };

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
          <h1 className="text-3xl font-bold text-foreground">Bond Tracker</h1>
          <p className="text-muted-foreground mt-2">Search and analyze Texas municipal bonds</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Bonds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">CUSIP</label>
                <Input
                  placeholder="Enter CUSIP..."
                  value={searchFilters.cusip}
                  onChange={(e) => setSearchFilters({ ...searchFilters, cusip: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bond Type</label>
                <Select value={searchFilters.bondType} onValueChange={(value) => setSearchFilters({ ...searchFilters, bondType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="GO">General Obligation</SelectItem>
                    <SelectItem value="Revenue">Revenue Bonds</SelectItem>
                    <SelectItem value="CO">Certificate of Obligation</SelectItem>
                    <SelectItem value="Refunding">Refunding Bonds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Maturity Range</label>
                <Select value={searchFilters.maturityRange} onValueChange={(value) => setSearchFilters({ ...searchFilters, maturityRange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Maturities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Maturities</SelectItem>
                    <SelectItem value="1-5">1-5 Years</SelectItem>
                    <SelectItem value="5-10">5-10 Years</SelectItem>
                    <SelectItem value="10-20">10-20 Years</SelectItem>
                    <SelectItem value="20+">20+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Yield Range</label>
                <Select value={searchFilters.yieldRange} onValueChange={(value) => setSearchFilters({ ...searchFilters, yieldRange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Yields" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Yields</SelectItem>
                    <SelectItem value="0-2">0-2%</SelectItem>
                    <SelectItem value="2-4">2-4%</SelectItem>
                    <SelectItem value="4-6">4-6%</SelectItem>
                    <SelectItem value="6+">6%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              Search Bonds
            </Button>
          </CardContent>
        </Card>

        {/* Bond Results */}
        <Card>
          <CardHeader>
            <CardTitle>Bond Search Results</CardTitle>
            <p className="text-sm text-muted-foreground">{bonds.length} bonds found</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading bonds...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th>CUSIP</th>
                      <th>Issuer</th>
                      <th>Par Amount</th>
                      <th>Coupon</th>
                      <th>Yield</th>
                      <th>Maturity</th>
                      <th>Type</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonds.map((bond) => (
                      <tr key={bond.id} className="hover:bg-accent cursor-pointer">
                        <td className="font-mono text-xs">{bond.cusip}</td>
                        <td className="font-medium">{bond.issuerName}</td>
                        <td className="font-medium">${(parseFloat(bond.parAmount) / 1000000).toFixed(1)}M</td>
                        <td>{bond.couponRate}%</td>
                        <td>{bond.yield ? `${bond.yield}%` : "N/A"}</td>
                        <td>{new Date(bond.maturityDate).toLocaleDateString()}</td>
                        <td>
                          <Badge variant="secondary">{bond.bondType}</Badge>
                        </td>
                        <td>
                          {bond.creditRating && (
                            <Badge className={getRatingColor(bond.creditRating)}>
                              {bond.creditRating}
                            </Badge>
                          )}
                        </td>
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
