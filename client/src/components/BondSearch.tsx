import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bond } from "@shared/schema";

export default function BondSearch() {
  const [searchFilters, setSearchFilters] = useState({
    cusip: "",
    bondType: "",
    maturityRange: "",
    yieldRange: "",
  });

  const [bonds, setBonds] = useState<Bond[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const loadBonds = async () => {
      try {
        const res = await fetch(`${base}data/bonds.json`);
        if (!res.ok) {
          console.error("Failed to fetch bonds:", res.status);
          return;
        }
        const data: Bond[] = await res.json();
        setBonds(data);
      } catch (err) {
        console.error("Error loading bonds:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBonds();
  }, [base]);

  // Filter bonds based on search criteria
  const filteredBonds = bonds.filter(bond => {
    if (searchFilters.cusip && !bond.cusip.toLowerCase().includes(searchFilters.cusip.toLowerCase())) {
      return false;
    }
    if (searchFilters.bondType && bond.bondType !== searchFilters.bondType) {
      return false;
    }
    // Add more filtering logic for maturity and yield ranges
    return true;
  }).slice(0, 5); // Show only first 5 results

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
        <CardTitle>Advanced Bond Search</CardTitle>
        <p className="text-sm text-muted-foreground">Search and filter bonds by CUSIP, maturity, yield, and more</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">CUSIP</label>
            <Input
              type="text"
              placeholder="Enter CUSIP..."
              value={searchFilters.cusip}
              onChange={(e) => setSearchFilters({ ...searchFilters, cusip: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Maturity Range</label>
            <Select 
              value={searchFilters.maturityRange} 
              onValueChange={(value) => setSearchFilters({ ...searchFilters, maturityRange: value })}
            >
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
            <label className="block text-sm font-medium text-foreground mb-2">Yield Range</label>
            <Select 
              value={searchFilters.yieldRange} 
              onValueChange={(value) => setSearchFilters({ ...searchFilters, yieldRange: value })}
            >
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Bond Type</label>
            <Select 
              value={searchFilters.bondType} 
              onValueChange={(value) => setSearchFilters({ ...searchFilters, bondType: value })}
            >
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
        </div>

        {/* Search Results Preview */}
        <div className="border border-border rounded-lg">
          <div className="bg-muted/30 px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Search Results</h4>
              <span className="text-sm text-muted-foreground">{filteredBonds.length} bonds found</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">Loading bonds...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">CUSIP</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Issuer</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Par Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Coupon</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Maturity</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBonds.map((bond) => (
                    <tr key={bond.id} className="hover:bg-accent">
                      <td className="px-4 py-3 font-mono text-xs">{bond.cusip}</td>
                      <td className="px-4 py-3">{bond.issuerName}</td>
                      <td className="px-4 py-3 font-medium">
                        ${(parseFloat(bond.parAmount) / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-4 py-3">{bond.couponRate}%</td>
                      <td className="px-4 py-3">{new Date(bond.maturityDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {bond.creditRating && (
                          <Badge className={getRatingColor(bond.creditRating)}>
                            {bond.creditRating}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredBonds.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No bonds match your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
