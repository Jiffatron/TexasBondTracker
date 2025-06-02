import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const municipalities = pgTable("municipalities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "school_district", "city", "county", "special_district"
  county: text("county").notNull(),
  region: text("region").notNull(),
  outstandingDebt: decimal("outstanding_debt", { precision: 15, scale: 2 }).notNull(),
  creditRating: text("credit_rating"),
  lastIssuanceDate: text("last_issuance_date"),
  taxpayerBase: integer("taxpayer_base"),
  perCapitaDebt: decimal("per_capita_debt", { precision: 10, scale: 2 }),
  population: integer("population"),
});

export const bonds = pgTable("bonds", {
  id: serial("id").primaryKey(),
  cusip: text("cusip").notNull().unique(),
  issuerId: integer("issuer_id").references(() => municipalities.id).notNull(),
  issuerName: text("issuer_name").notNull(),
  parAmount: decimal("par_amount", { precision: 15, scale: 2 }).notNull(),
  couponRate: decimal("coupon_rate", { precision: 5, scale: 3 }).notNull(),
  maturityDate: text("maturity_date").notNull(),
  issueDate: text("issue_date").notNull(),
  bondType: text("bond_type").notNull(), // "GO", "Revenue", "CO", "Refunding"
  callDate: text("call_date"),
  yield: decimal("yield", { precision: 5, scale: 3 }),
  creditRating: text("credit_rating"),
  purpose: text("purpose"),
});

export const issuanceActivity = pgTable("issuance_activity", {
  id: serial("id").primaryKey(),
  municipalityId: integer("municipality_id").references(() => municipalities.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 15, scale: 2 }),
  activityType: text("activity_type").notNull(), // "issuance", "rating_change", "filing"
  timestamp: timestamp("timestamp").notNull(),
});

export const insertMunicipalitySchema = createInsertSchema(municipalities).omit({
  id: true,
});

export const insertBondSchema = createInsertSchema(bonds).omit({
  id: true,
});

export const insertIssuanceActivitySchema = createInsertSchema(issuanceActivity).omit({
  id: true,
});

export type Municipality = typeof municipalities.$inferSelect;
export type InsertMunicipality = z.infer<typeof insertMunicipalitySchema>;
export type Bond = typeof bonds.$inferSelect;
export type InsertBond = z.infer<typeof insertBondSchema>;
export type IssuanceActivity = typeof issuanceActivity.$inferSelect;
export type InsertIssuanceActivity = z.infer<typeof insertIssuanceActivitySchema>;
