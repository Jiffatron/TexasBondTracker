import { municipalities, bonds, issuanceActivity, type Municipality, type InsertMunicipality, type Bond, type InsertBond, type IssuanceActivity, type InsertIssuanceActivity } from "@shared/schema";

export interface IStorage {
  // Municipality operations
  getMunicipalities(): Promise<Municipality[]>;
  getMunicipalityById(id: number): Promise<Municipality | undefined>;
  createMunicipality(municipality: InsertMunicipality): Promise<Municipality>;
  
  // Bond operations
  getBonds(): Promise<Bond[]>;
  getBondById(id: number): Promise<Bond | undefined>;
  getBondsByCusip(cusip: string): Promise<Bond[]>;
  getBondsByIssuer(issuerId: number): Promise<Bond[]>;
  createBond(bond: InsertBond): Promise<Bond>;
  
  // Issuance activity operations
  getIssuanceActivities(): Promise<IssuanceActivity[]>;
  getRecentActivities(limit?: number): Promise<IssuanceActivity[]>;
  createIssuanceActivity(activity: InsertIssuanceActivity): Promise<IssuanceActivity>;
  
  // Search and filter operations
  searchMunicipalities(filters: {
    type?: string[];
    rating?: string[];
    region?: string;
    minDebt?: number;
    maxDebt?: number;
  }): Promise<Municipality[]>;
  
  searchBonds(filters: {
    cusip?: string;
    bondType?: string[];
    minYield?: number;
    maxYield?: number;
    minMaturity?: string;
    maxMaturity?: string;
  }): Promise<Bond[]>;
}

export class MemStorage implements IStorage {
  private municipalities: Map<number, Municipality>;
  private bonds: Map<number, Bond>;
  private issuanceActivities: Map<number, IssuanceActivity>;
  private currentMunicipalityId: number;
  private currentBondId: number;
  private currentActivityId: number;

  constructor() {
    this.municipalities = new Map();
    this.bonds = new Map();
    this.issuanceActivities = new Map();
    this.currentMunicipalityId = 1;
    this.currentBondId = 1;
    this.currentActivityId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample municipalities
    const sampleMunicipalities: InsertMunicipality[] = [
      {
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
      },
      {
        name: "Plano ISD",
        type: "school_district",
        county: "Collin County",
        region: "North Texas",
        outstandingDebt: "1250000000",
        creditRating: "AAA",
        lastIssuanceDate: "2024-04-05",
        taxpayerBase: 295000,
        perCapitaDebt: "4237.29",
        population: 295000
      },
      {
        name: "City of Fort Worth",
        type: "city",
        county: "Tarrant County",
        region: "North Texas",
        outstandingDebt: "2100000000",
        creditRating: "AA+",
        lastIssuanceDate: "2023-11-12",
        taxpayerBase: 918000,
        perCapitaDebt: "2287.58",
        population: 918000
      }
    ];

    sampleMunicipalities.forEach(municipality => {
      this.createMunicipality(municipality);
    });

    // Add sample bonds
    const sampleBonds: InsertBond[] = [
      {
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
      },
      {
        cusip: "233851CX2",
        issuerId: 3,
        issuerName: "Dallas ISD",
        parAmount: "20000000",
        couponRate: "4.500",
        maturityDate: "2039-02-10",
        issueDate: "2024-02-10",
        bondType: "GO",
        yield: "4.625",
        creditRating: "A+",
        purpose: "Technology Upgrades"
      }
    ];

    sampleBonds.forEach(bond => {
      this.createBond(bond);
    });

    // Add sample activities
    const sampleActivities: InsertIssuanceActivity[] = [
      {
        municipalityId: 4,
        title: "Plano ISD issued $125M GO bonds",
        description: "General obligation bonds for new school construction",
        amount: "125000000",
        activityType: "issuance",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        municipalityId: 5,
        title: "Fort Worth rating upgraded to AA+",
        description: "Credit rating upgrade by Moody's",
        activityType: "rating_change",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        municipalityId: 2,
        title: "Austin filed new CAFR report",
        description: "Comprehensive Annual Financial Report filed",
        activityType: "filing",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      }
    ];

    sampleActivities.forEach(activity => {
      this.createIssuanceActivity(activity);
    });
  }

  async getMunicipalities(): Promise<Municipality[]> {
    return Array.from(this.municipalities.values());
  }

  async getMunicipalityById(id: number): Promise<Municipality | undefined> {
    return this.municipalities.get(id);
  }

  async createMunicipality(insertMunicipality: InsertMunicipality): Promise<Municipality> {
    const id = this.currentMunicipalityId++;
    const municipality: Municipality = { ...insertMunicipality, id };
    this.municipalities.set(id, municipality);
    return municipality;
  }

  async getBonds(): Promise<Bond[]> {
    return Array.from(this.bonds.values());
  }

  async getBondById(id: number): Promise<Bond | undefined> {
    return this.bonds.get(id);
  }

  async getBondsByCusip(cusip: string): Promise<Bond[]> {
    return Array.from(this.bonds.values()).filter(bond => bond.cusip === cusip);
  }

  async getBondsByIssuer(issuerId: number): Promise<Bond[]> {
    return Array.from(this.bonds.values()).filter(bond => bond.issuerId === issuerId);
  }

  async createBond(insertBond: InsertBond): Promise<Bond> {
    const id = this.currentBondId++;
    const bond: Bond = { ...insertBond, id };
    this.bonds.set(id, bond);
    return bond;
  }

  async getIssuanceActivities(): Promise<IssuanceActivity[]> {
    return Array.from(this.issuanceActivities.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getRecentActivities(limit: number = 10): Promise<IssuanceActivity[]> {
    const activities = await this.getIssuanceActivities();
    return activities.slice(0, limit);
  }

  async createIssuanceActivity(insertActivity: InsertIssuanceActivity): Promise<IssuanceActivity> {
    const id = this.currentActivityId++;
    const activity: IssuanceActivity = { ...insertActivity, id };
    this.issuanceActivities.set(id, activity);
    return activity;
  }

  async searchMunicipalities(filters: {
    type?: string[];
    rating?: string[];
    region?: string;
    minDebt?: number;
    maxDebt?: number;
  }): Promise<Municipality[]> {
    let municipalities = Array.from(this.municipalities.values());

    if (filters.type?.length) {
      municipalities = municipalities.filter(m => filters.type!.includes(m.type));
    }

    if (filters.rating?.length) {
      municipalities = municipalities.filter(m => m.creditRating && filters.rating!.includes(m.creditRating));
    }

    if (filters.region) {
      municipalities = municipalities.filter(m => m.region === filters.region);
    }

    if (filters.minDebt !== undefined) {
      municipalities = municipalities.filter(m => parseFloat(m.outstandingDebt) >= filters.minDebt!);
    }

    if (filters.maxDebt !== undefined) {
      municipalities = municipalities.filter(m => parseFloat(m.outstandingDebt) <= filters.maxDebt!);
    }

    return municipalities;
  }

  async searchBonds(filters: {
    cusip?: string;
    bondType?: string[];
    minYield?: number;
    maxYield?: number;
    minMaturity?: string;
    maxMaturity?: string;
  }): Promise<Bond[]> {
    let bonds = Array.from(this.bonds.values());

    if (filters.cusip) {
      bonds = bonds.filter(b => b.cusip.includes(filters.cusip!));
    }

    if (filters.bondType?.length) {
      bonds = bonds.filter(b => filters.bondType!.includes(b.bondType));
    }

    if (filters.minYield !== undefined) {
      bonds = bonds.filter(b => b.yield && parseFloat(b.yield) >= filters.minYield!);
    }

    if (filters.maxYield !== undefined) {
      bonds = bonds.filter(b => b.yield && parseFloat(b.yield) <= filters.maxYield!);
    }

    if (filters.minMaturity) {
      bonds = bonds.filter(b => b.maturityDate >= filters.minMaturity!);
    }

    if (filters.maxMaturity) {
      bonds = bonds.filter(b => b.maturityDate <= filters.maxMaturity!);
    }

    return bonds;
  }
}

export const storage = new MemStorage();
