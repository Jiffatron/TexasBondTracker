import { Municipality, Bond, IssuanceActivity } from "@shared/schema";

export const mockMunicipalities: Municipality[] = [
  {
    id: 1,
    name: "Houston ISD",
    type: "school_district",
    county: "Harris County",
    region: "Gulf Coast",
    outstandingDebt: "4200000000",
    creditRating: "AA",
    lastIssuanceDate: "2024-03-15",
    taxpayerBase: 850000,
    perCapitaDebt: "4941.18",
    population: 850000
  },
  {
    id: 2,
    name: "City of Austin",
    type: "city",
    county: "Travis County",
    region: "Central Texas",
    outstandingDebt: "3800000000",
    creditRating: "AAA",
    lastIssuanceDate: "2024-01-20",
    taxpayerBase: 980000,
    perCapitaDebt: "3877.55",
    population: 980000
  },
  {
    id: 3,
    name: "Dallas ISD",
    type: "school_district",
    county: "Dallas County",
    region: "North Texas",
    outstandingDebt: "3100000000",
    creditRating: "A+",
    lastIssuanceDate: "2024-02-10",
    taxpayerBase: 1340000,
    perCapitaDebt: "2313.43",
    population: 1340000
  }
];

export const mockBonds: Bond[] = [
  {
    id: 1,
    cusip: "442654JZ1",
    issuerId: 1,
    issuerName: "Houston ISD",
    parAmount: "15000000",
    couponRate: "4.125",
    maturityDate: "2034-02-15",
    issueDate: "2024-03-15",
    bondType: "GO",
    yield: "4.250",
    creditRating: "AA",
    purpose: "School Construction"
  },
  {
    id: 2,
    cusip: "064058BV8",
    issuerId: 2,
    issuerName: "City of Austin",
    parAmount: "25000000",
    couponRate: "3.875",
    maturityDate: "2029-08-15",
    issueDate: "2024-01-20",
    bondType: "Revenue",
    yield: "3.950",
    creditRating: "AAA",
    purpose: "Water Utility Infrastructure"
  }
];

export const mockActivities: IssuanceActivity[] = [
  {
    id: 1,
    municipalityId: 1,
    title: "Houston ISD issued $125M GO bonds",
    description: "General obligation bonds for new school construction",
    amount: "125000000",
    activityType: "issuance",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 2,
    municipalityId: 2,
    title: "Austin rating upgraded to AAA",
    description: "Credit rating upgrade by Moody's",
    activityType: "rating_change",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  }
];
