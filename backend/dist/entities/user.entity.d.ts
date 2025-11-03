import { Quiz } from './quiz.entity';
import { Recommendation } from './recommendation.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    gender: 'male' | 'female' | 'other';
    age: number;
    createdAt: Date;
    updatedAt: Date;
    quiz: Quiz;
    recommendations: Recommendation[];
}
