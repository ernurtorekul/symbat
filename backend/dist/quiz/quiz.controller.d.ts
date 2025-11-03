import { QuizService } from './quiz.service';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { QuizResponseDto } from '../dto/quiz-response.dto';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    submitQuiz(submitQuizDto: SubmitQuizDto): Promise<QuizResponseDto>;
    getUserQuiz(userId: string): Promise<QuizResponseDto>;
    getMyQuiz(): Promise<QuizResponseDto>;
}
