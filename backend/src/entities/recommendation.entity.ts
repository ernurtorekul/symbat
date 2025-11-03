import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({
    type: 'enum',
    enum: ['general', 'personal'],
    default: 'general',
    comment: 'Recommendation mode: general (filter-based) or personal (AI-based)'
  })
  mode: 'general' | 'personal';

  @Column({
    type: 'text',
    nullable: true,
    comment: 'AI-generated or filter-based explanation for recommendation'
  })
  reason: string;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
    comment: 'Confidence score (0.00-1.00) for AI recommendations'
  })
  confidenceScore: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Whether user has favorited/saved this recommendation'
  })
  isFavorite: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Whether user has viewed this recommendation'
  })
  isViewed: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Additional metadata like matching criteria, user feedback, etc.'
  })
  metadata: Record<string, any>;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at'
  })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => User, user => user.recommendations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, product => product.recommendations, { onDelete: 'CASCADE' })
  product: Product;
}