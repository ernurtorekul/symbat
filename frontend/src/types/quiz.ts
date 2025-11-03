export enum SkinType {
  OILY = 'oily',
  DRY = 'dry',
  COMBINATION = 'combination',
  NORMAL = 'normal',
  SENSITIVE = 'sensitive'
}

export enum SkinTone {
  VERY_FAIR = 'very_fair',
  FAIR = 'fair',
  MEDIUM = 'medium',
  OLIVE = 'olive',
  TAN = 'tan',
  DEEP = 'deep'
}

export interface QuizData {
  skinType: SkinType;
  skinTone: SkinTone;
  skinConcerns: string[];
  allergies?: string[];
  additionalResponses?: Record<string, any>;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string | null;
  productCategory: string | null;
  productType: string | null;
  description: string | null;
  imageUrl: string | null;
  productLink: string | null;
  ingredients: string[] | null;
  suitableSkinTypes: string[];
  targetConcerns: string[] | null;
  tags: string[] | null;
  tagList: string[] | null;
  price: number | null;
  budgetRange: string;
  rating: number | null;
  apiSourceId: string | null;
  apiSource: string;
  lastUpdated: string;
  isAvailable: boolean;
  isNonComedogenic: boolean;
  isHypoallergenic: boolean;
  isOrganic: boolean;
  isCrueltyFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResponse {
  id: string;
  skinType: SkinType;
  skinTone: SkinTone | null;
  skinConcerns: string[];
  allergies: string[];
  additionalResponses?: Record<string, any>;
  completedAt: string;
  userId: string;
  recommendedProducts?: Product[];
}