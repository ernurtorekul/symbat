import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  BadRequestException
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { QuizResponseDto } from '../dto/quiz-response.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('submit')
  async submitQuiz(@Body() submitQuizDto: SubmitQuizDto): Promise<QuizResponseDto> {
    try {
      // For simplicity, use a default user ID. In production, you'd want proper session handling
      return await this.quizService.submitQuiz('df8bc604-2a91-4d18-8d81-6a93bd2b047b', submitQuizDto);
    } catch (error) {
      if (error.message === 'User not found') {
        throw new BadRequestException('Invalid user');
      }
      throw error;
    }
  }

  @Get('profile/:userId')
  async getUserQuiz(@Param('userId') userId: string): Promise<QuizResponseDto> {
    try {
      return await this.quizService.getUserQuiz(userId);
    } catch (error) {
      if (error.message === 'Quiz not found for this user') {
        throw new BadRequestException('Quiz not found for this user');
      }
      throw error;
    }
  }

  @Get('my-profile')
  async getMyQuiz(): Promise<QuizResponseDto> {
    try {
      return await this.quizService.getUserQuiz('df8bc604-2a91-4d18-8d81-6a93bd2b047b');
    } catch (error) {
      if (error.message === 'Quiz not found for this user') {
        throw new BadRequestException('Quiz not found for this user');
      }
      throw error;
    }
  }
}