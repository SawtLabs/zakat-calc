import { pgTable, text, serial, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const zakatCalculations = pgTable("zakat_calculations", {
  id: serial("id").primaryKey(),
  assets: jsonb("assets").notNull().$type<Array<{name: string, value: number}>>(),
  netWealth: real("net_wealth").notNull(),
  zakatAmount: real("zakat_amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  nisabValue: real("nisab_value").notNull().default(5000),
});

export const insertCalculationSchema = createInsertSchema(zakatCalculations).omit({ 
  id: true,
  netWealth: true,
  zakatAmount: true
});

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof zakatCalculations.$inferSelect;

export const currencies = [
  "USD", "EUR", "GBP", "SAR", "AED", "MYR", "PKR", "INR"
] as const;