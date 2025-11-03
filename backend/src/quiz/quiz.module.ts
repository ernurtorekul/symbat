import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Quiz } from '../entities/quiz.entity';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, User, Product])],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}