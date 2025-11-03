import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Recommendation } from './recommendation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
    nullable: true
  })
  gender: 'male' | 'female' | 'other';

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Age in years'
  })
  age: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at'
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'updated_at'
  })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => Quiz, quiz => quiz.user)
  quiz: Quiz;

  @OneToMany(() => Recommendation, recommendation => recommendation.user)
  recommendations: Recommendation[];
}