import { User } from './user.entity';
import { Product } from './product.entity';
export declare class Quiz {
    id: string;
    userId: string;
    skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
    skinTone: 'very_fair' | 'fair' | 'medium' | 'olive' | 'tan' | 'deep';
    allergies: string[];
    skinConcerns: string[];
    additionalResponses: Record<string, any>;
    completedAt: Date;
    user: User;
    recommendedProducts: Product[];
}
