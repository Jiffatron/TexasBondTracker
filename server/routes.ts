import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Municipality routes
  app.get("/api/municipalities", async (req, res) => {
    try {
      const municipalities = await storage.getMunicipalities();
      res.json(municipalities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch municipalities" });
    }
  });

  app.get("/api/municipalities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const municipality = await storage.getMunicipalityById(id);
      if (!municipality) {
        return res.status(404).json({ message: "Municipality not found" });
      }
      res.json(municipality);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch municipality" });
    }
  });

  // Municipality search with filters
  app.post("/api/municipalities/search", async (req, res) => {
    try {
      const filterSchema = z.object({
        type: z.array(z.string()).optional(),
        rating: z.array(z.string()).optional(),
        region: z.string().optional(),
        minDebt: z.number().optional(),
        maxDebt: z.number().optional(),
      });

      const filters = filterSchema.parse(req.body);
      const municipalities = await storage.searchMunicipalities(filters);
      res.json(municipalities);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  // Bond routes
  app.get("/api/bonds", async (req, res) => {
    try {
      const bonds = await storage.getBonds();
      res.json(bonds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bonds" });
    }
  });

  app.get("/api/bonds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bond = await storage.getBondById(id);
      if (!bond) {
        return res.status(404).json({ message: "Bond not found" });
      }
      res.json(bond);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bond" });
    }
  });

  app.get("/api/bonds/cusip/:cusip", async (req, res) => {
    try {
      const cusip = req.params.cusip;
      const bonds = await storage.getBondsByCusip(cusip);
      res.json(bonds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bonds by CUSIP" });
    }
  });

  app.get("/api/bonds/issuer/:issuerId", async (req, res) => {
    try {
      const issuerId = parseInt(req.params.issuerId);
      const bonds = await storage.getBondsByIssuer(issuerId);
      res.json(bonds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bonds by issuer" });
    }
  });

  // Bond search with filters
  app.post("/api/bonds/search", async (req, res) => {
    try {
      const filterSchema = z.object({
        cusip: z.string().optional(),
        bondType: z.array(z.string()).optional(),
        minYield: z.number().optional(),
        maxYield: z.number().optional(),
        minMaturity: z.string().optional(),
        maxMaturity: z.string().optional(),
      });

      const filters = filterSchema.parse(req.body);
      const bonds = await storage.searchBonds(filters);
      res.json(bonds);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  // Issuance activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const municipalities = await storage.getMunicipalities();
      const bonds = await storage.getBonds();
      
      const totalDebt = municipalities.reduce((sum, m) => sum + parseFloat(m.outstandingDebt), 0);
      const activeIssuers = municipalities.length;
      
      // Calculate average rating (simplified)
      const ratings = municipalities.filter(m => m.creditRating).map(m => m.creditRating!);
      const avgRating = ratings.length > 0 ? "AA-" : "N/A"; // Simplified calculation
      
      // Calculate YTD issuances (simplified)
      const currentYear = new Date().getFullYear();
      const ytdBonds = bonds.filter(b => new Date(b.issueDate).getFullYear() === currentYear);
      const ytdIssuances = ytdBonds.reduce((sum, b) => sum + parseFloat(b.parAmount), 0);

      res.json({
        totalDebt: totalDebt / 1000000000, // Convert to billions
        activeIssuers,
        avgRating,
        ytdIssuances: ytdIssuances / 1000000000, // Convert to billions
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Credit rating distribution
  app.get("/api/dashboard/rating-distribution", async (req, res) => {
    try {
      const municipalities = await storage.getMunicipalities();
      const distribution = municipalities.reduce((acc, m) => {
        if (m.creditRating) {
          acc[m.creditRating] = (acc[m.creditRating] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      res.json(distribution);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rating distribution" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
