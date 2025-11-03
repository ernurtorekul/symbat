import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { QuizResponseDto } from '../dto/quiz-response.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async submitQuiz(userId: string, submitQuizDto: SubmitQuizDto): Promise<QuizResponseDto> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['quiz']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has a quiz
    let quiz = user.quiz;

    if (quiz) {
      // Update existing quiz
      quiz.skinType = submitQuizDto.skinType;
      quiz.skinTone = submitQuizDto.skinTone;
      quiz.skinConcerns = submitQuizDto.skinConcerns;
      quiz.allergies = submitQuizDto.allergies || [];
      quiz.additionalResponses = submitQuizDto.additionalResponses || {};
      quiz.completedAt = new Date();
    } else {
      // Create new quiz
      quiz = this.quizRepository.create({
        ...submitQuizDto,
        user: user,
        completedAt: new Date(),
      });
    }

    const savedQuiz = await this.quizRepository.save(quiz);

    // Generate basic product recommendations
    await this.generateBasicRecommendations(savedQuiz);

    // Fetch the saved quiz with user relation and recommended products
    const quizWithUser = await this.quizRepository.findOne({
      where: { id: savedQuiz.id },
      relations: ['user', 'recommendedProducts'],
    });

    return this.mapToResponseDto(quizWithUser!);
  }

  async getUserQuiz(userId: string): Promise<QuizResponseDto> {
    const quiz = await this.quizRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'recommendedProducts'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found for this user');
    }

    return this.mapToResponseDto(quiz);
  }

  private async generateBasicRecommendations(quiz: Quiz): Promise<void> {
    // Generate personalized recommendations based on skin type and concerns
    let queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .where('product.isAvailable = :isAvailable', { isAvailable: true })
      .orderBy('product.rating', 'DESC')
      .take(12);

    // Filter by skin type concerns using PostgreSQL array syntax
    if (quiz.skinType === 'oily') {
      queryBuilder = queryBuilder.andWhere(
        '(:tag1 = ANY(product.tagList) OR :tag2 = ANY(product.tagList) OR product.description ILIKE :desc1)',
        { tag1: 'oil-free', tag2: 'mattifying', desc1: '%oily skin%' }
      );
    } else if (quiz.skinType === 'dry') {
      queryBuilder = queryBuilder.andWhere(
        '(:tag1 = ANY(product.tagList) OR :tag2 = ANY(product.tagList) OR product.description ILIKE :desc1)',
        { tag1: 'hydrating', tag2: 'moisturizing', desc1: '%dry skin%' }
      );
    } else if (quiz.skinType === 'sensitive') {
      queryBuilder = queryBuilder.andWhere(
        '(product.isHypoallergenic = :hypo OR :tag1 = ANY(product.tagList) OR product.description ILIKE :desc1)',
        { hypo: true, tag1: 'gentle', desc1: '%sensitive skin%' }
      );
    }

    // Filter by specific concerns using PostgreSQL array syntax
    if (quiz.skinConcerns.includes('Acne')) {
      queryBuilder = queryBuilder.andWhere(
        '(product.isNonComedogenic = :nonComedo OR :tag1 = ANY(product.tagList))',
        { nonComedo: true, tag1: 'acne' }
      );
    }

    if (quiz.skinConcerns.includes('Anti-aging') || quiz.skinConcerns.includes('Wrinkles')) {
      queryBuilder = queryBuilder.andWhere(
        '(:tag1 = ANY(product.tagList) OR :tag2 = ANY(product.tagList) OR product.description ILIKE :desc1)',
        { tag1: 'anti-aging', tag2: 'retinol', desc1: '%wrinkle%' }
      );
    }

    const recommendedProducts = await queryBuilder.getMany();

    if (recommendedProducts.length > 0) {
      quiz.recommendedProducts = recommendedProducts;
      await this.quizRepository.save(quiz);
    }
  }

  private mapToResponseDto(quiz: Quiz): QuizResponseDto {
    return {
      id: quiz.id,
      skinType: quiz.skinType as any,
      skinTone: quiz.skinTone as any,
      skinConcerns: quiz.skinConcerns,
      allergies: quiz.allergies,
      additionalResponses: quiz.additionalResponses,
      completedAt: quiz.completedAt,
      userId: quiz.user.id,
      recommendedProducts: quiz.recommendedProducts || [],
    };
  }
}