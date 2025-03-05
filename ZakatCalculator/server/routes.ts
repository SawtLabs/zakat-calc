import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertCalculationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// Rate limiting
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 100; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

function isRateLimited(ip: string | undefined): boolean {
  if (!ip) return false; // Skip rate limiting if IP is undefined

  const now = Date.now();
  const userRequest = requestCounts.get(ip);

  if (!userRequest || (now - userRequest.timestamp) > RATE_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (userRequest.count >= RATE_LIMIT) {
    return true;
  }

  userRequest.count++;
  return false;
}

export async function registerRoutes(app: Express) {
  // Add security headers middleware
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  app.post("/api/calculations", async (req, res) => {
    try {
      // Rate limiting check
      if (isRateLimited(req.ip)) {
        return res.status(429).json({ 
          error: "Too many requests. Please try again later." 
        });
      }

      // Input validation
      const parsedBody = insertCalculationSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ 
          error: fromZodError(parsedBody.error).message 
        });
      }

      // Validate asset values
      const hasInvalidValues = parsedBody.data.assets.some(asset => {
        const value = Number(asset.value);
        return isNaN(value) || value < 0 || !Number.isFinite(value);
      });

      if (hasInvalidValues) {
        return res.status(400).json({ 
          error: "Invalid asset values. Please enter valid numbers." 
        });
      }

      const calculation = await storage.saveCalculation(parsedBody.data);
      res.json(calculation);
    } catch (error) {
      console.error('Calculation error:', error);
      res.status(500).json({ 
        error: "An error occurred while processing your request." 
      });
    }
  });

  app.get("/api/calculations", async (_req, res) => {
    try {
      const calculations = await storage.getCalculations();
      res.json(calculations);
    } catch (error) {
      console.error('Error fetching calculations:', error);
      res.status(500).json({ 
        error: "An error occurred while fetching calculations." 
      });
    }
  });

  return createServer(app);
}