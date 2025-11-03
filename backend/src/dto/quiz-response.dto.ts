import { SkinType, SkinTone } from './submit-quiz.dto';
import { Product } from '../entities/product.entity';

export class QuizResponseDto {
  id: string;
  skinType: SkinType;
  skinTone: SkinTone;
  skinConcerns: string[];
  allergies: string[];
  additionalResponses?: Record<string, any>;
  completedAt: Date;
  userId: string;
  recommendedProducts: Product[];
}