import { type Calculation, type InsertCalculation } from "@shared/schema";

export interface IStorage {
  saveCalculation(calc: InsertCalculation): Promise<Calculation>;
  getCalculations(): Promise<Calculation[]>;
}

export class MemStorage implements IStorage {
  private calculations: Map<number, Calculation>;
  private currentId: number;

  constructor() {
    this.calculations = new Map();
    this.currentId = 1;
  }

  async saveCalculation(calc: InsertCalculation): Promise<Calculation> {
    // Ensure type safety for assets
    const validatedAssets = calc.assets.map(asset => ({
      name: String(asset.name),
      value: Number(asset.value)
    }));

    // Calculate net wealth with validated values
    const netWealth = validatedAssets.reduce((sum, asset) => {
      if (isNaN(asset.value)) {
        throw new Error(`Invalid value for asset: ${asset.name}`);
      }
      return sum + asset.value;
    }, 0);

    const zakatAmount = netWealth * 0.025;

    const calculation: Calculation = {
      id: this.currentId++,
      assets: validatedAssets,
      netWealth,
      zakatAmount,
      currency: calc.currency || "INR",
      nisabValue: calc.nisabValue || 5000
    };

    this.calculations.set(calculation.id, calculation);
    return calculation;
  }

  async getCalculations(): Promise<Calculation[]> {
    return Array.from(this.calculations.values());
  }
}

export const storage = new MemStorage();