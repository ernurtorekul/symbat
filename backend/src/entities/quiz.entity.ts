import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({
    type: 'enum',
    enum: ['oily', 'dry', 'combination', 'normal', 'sensitive'],
    comment: 'Primary skin type'
  })
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';

  @Column({
    type: 'enum',
    enum: ['very_fair', 'fair', 'medium', 'olive', 'tan', 'deep'],
    nullable: true,
    comment: 'Skin tone/complexion'
  })
  skinTone: 'very_fair' | 'fair' | 'medium' | 'olive' | 'tan' | 'deep';

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    comment: 'List of allergies'
  })
  allergies: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    comment: 'List of skin concerns'
  })
  skinConcerns: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Additional quiz responses as JSON'
  })
  additionalResponses: Record<string, any>;

  @Column({
    type: 'timestamp',
    name: 'completed_at'
  })
  completedAt: Date;

  // Relationships
  @OneToOne(() => User, user => user.quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Product, product => product.recommendedFor, { cascade: true })
  @JoinTable({
    name: 'quiz_recommended_products',
    joinColumn: { name: 'quiz_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' }
  })
  recommendedProducts: Product[];
}