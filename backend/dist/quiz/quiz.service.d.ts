import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { QuizResponseDto } from '../dto/quiz-response.dto';
export declare class QuizService {
    private quizRepository;
    private userRepository;
    private productsRepository;
    constructor(quizRepository: Repository<Quiz>, userRepository: Repository<User>, productsRepository: Repository<Product>);
    submitQuiz(userId: string, submitQuizDto: SubmitQuizDto): Promise<QuizResponseDto>;
    getUserQuiz(userId: string): Promise<QuizResponseDto>;
    private generateBasicRecommendations;
    private mapToResponseDto;
}
