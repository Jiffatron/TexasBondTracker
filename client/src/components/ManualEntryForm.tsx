import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExtractedFinancialData } from "@/types";
import { AuditPDFParser } from "@/utils/pdfParser";

interface ManualEntryFormProps {
  initialData: ExtractedFinancialData;
  onDataChange: (data: ExtractedFinancialData) => void;
}

export default function ManualEntryForm({ initialData, onDataChange }: ManualEntryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ExtractedFinancialData>(initialData);
  const parser = new AuditPDFParser();

  const handleInputChange = (section: keyof ExtractedFinancialData, field: string, value: string) => {
    // Validate numeric input - allow empty string, numbers, and decimal points
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return; // Reject invalid input
    }
    
    const numericValue = value === '' ? 0 : parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: numericValue
      }
    }));
  };

  const handleStringChange = (field: keyof ExtractedFinancialData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportManual = () => {
    onDataChange(formData);
    parser.exportToJSON(formData);
  };

  const formatNumber = (num: number) => num.toString();

  const HelpTooltip = ({ content }: { content: string }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2">
          <i className="fas fa-question-circle text-muted-foreground text-xs"></i>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <i className="fas fa-edit"></i>
                <span>Manual Entry & Corrections</span>
              </div>
              <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* District Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">District Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="districtName">District Name</Label>
                  <Input
                    id="districtName"
                    value={formData.districtName || ''}
                    onChange={(e) => handleStringChange('districtName', e.target.value)}
                    placeholder="Enter district name..."
                  />
                </div>
                <div>
                  <Label htmlFor="fiscalYear">Fiscal Year</Label>
                  <Input
                    id="fiscalYear"
                    value={formData.fiscalYear || ''}
                    onChange={(e) => handleStringChange('fiscalYear', e.target.value)}
                    placeholder="Enter fiscal year..."
                  />
                </div>
              </div>
            </div>

            {/* Net Position */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">Net Position</h3>
                <HelpTooltip content="Government-wide financial position showing total assets minus total liabilities. Net Position = Assets - Liabilities" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalAssets">Total Assets ($)</Label>
                  <Input
                    id="totalAssets"
                    type="number"
                    value={formatNumber(formData.netPosition.totalAssets)}
                    onChange={(e) => handleInputChange('netPosition', 'totalAssets', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="totalLiabilities">Total Liabilities ($)</Label>
                  <Input
                    id="totalLiabilities"
                    type="number"
                    value={formatNumber(formData.netPosition.totalLiabilities)}
                    onChange={(e) => handleInputChange('netPosition', 'totalLiabilities', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="netPosition">Net Position ($)</Label>
                  <Input
                    id="netPosition"
                    type="number"
                    value={formatNumber(formData.netPosition.netPosition)}
                    onChange={(e) => handleInputChange('netPosition', 'netPosition', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Fund Balance */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">Fund Balance</h3>
                <HelpTooltip content="Fund balances represent resources available for future spending in specific fund types." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="generalFund">General Fund ($)</Label>
                  <Input
                    id="generalFund"
                    type="number"
                    value={formatNumber(formData.fundBalance.generalFund)}
                    onChange={(e) => handleInputChange('fundBalance', 'generalFund', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="debtServiceFund">Debt Service Fund ($)</Label>
                  <Input
                    id="debtServiceFund"
                    type="number"
                    value={formatNumber(formData.fundBalance.debtServiceFund)}
                    onChange={(e) => handleInputChange('fundBalance', 'debtServiceFund', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Revenues */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">Revenues by Source</h3>
                <HelpTooltip content="Revenue sources for school districts: Local (property taxes), State (foundation funding), Federal (grants and programs)." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="localRevenue">Local Sources ($)</Label>
                  <Input
                    id="localRevenue"
                    type="number"
                    value={formatNumber(formData.revenues.local)}
                    onChange={(e) => handleInputChange('revenues', 'local', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stateRevenue">State Sources ($)</Label>
                  <Input
                    id="stateRevenue"
                    type="number"
                    value={formatNumber(formData.revenues.state)}
                    onChange={(e) => handleInputChange('revenues', 'state', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="federalRevenue">Federal Sources ($)</Label>
                  <Input
                    id="federalRevenue"
                    type="number"
                    value={formatNumber(formData.revenues.federal)}
                    onChange={(e) => handleInputChange('revenues', 'federal', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Expenditures */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">Expenditures by Function</h3>
                <HelpTooltip content="Major spending categories: Instruction (teaching), Administration (management), Debt Service (bond payments)." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="instruction">Instruction ($)</Label>
                  <Input
                    id="instruction"
                    type="number"
                    value={formatNumber(formData.expenditures.instruction)}
                    onChange={(e) => handleInputChange('expenditures', 'instruction', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="admin">Administration ($)</Label>
                  <Input
                    id="admin"
                    type="number"
                    value={formatNumber(formData.expenditures.admin)}
                    onChange={(e) => handleInputChange('expenditures', 'admin', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="debtService">Debt Service ($)</Label>
                  <Input
                    id="debtService"
                    type="number"
                    value={formatNumber(formData.expenditures.debtService)}
                    onChange={(e) => handleInputChange('expenditures', 'debtService', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-center pt-4">
              <Button onClick={handleExportManual} className="flex items-center gap-2">
                <i className="fas fa-download"></i>
                Export Corrected Data to JSON
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}