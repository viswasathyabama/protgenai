export interface User {
  id: string;
  email: string;
  plan: 'free' | 'basic' | 'pro' | 'custom';
  generationsUsed: number;
  generationsLimit: number;
  createdAt: string;
}

export interface ProteinDesign {
  id: string;
  userId: string;
  description: string;
  targetLength: number;
  foldingType: string;
  stabilityPreference: string;
  solubilityRequirement: string;
  sequence: string;
  structure?: string;
  confidence: number;
  timestamp: string;
  exported: boolean;
}

export interface GenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  result?: ProteinDesign;
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  generations: number | 'unlimited';
  speed: 'low' | 'medium' | 'high';
  watermark: boolean;
  exports: boolean;
}

export interface ProteinParameters {
  targetLength: number;
  foldingType: string;
  stabilityPreference: string;
  solubilityRequirement: string;
}