import { User } from './user.entity';
import { Product } from './product.entity';
export declare class Recommendation {
    id: string;
    userId: string;
    productId: string;
    mode: 'general' | 'personal';
    reason: string;
    confidenceScore: number;
    isFavorite: boolean;
    isViewed: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    user: User;
    product: Product;
}
