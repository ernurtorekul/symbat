import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Recommendation } from './recommendation.entity';
import { Quiz } from './quiz.entity';

export type ProductCategory =
  | 'foundation'
  | 'mascara'
  | 'lipstick'
  | 'eyeliner'
  | 'eyeshadow'
  | 'blush'
  | 'bronzer'
  | 'concealer'
  | 'primer'
  | 'setting_powder'
  | 'setting_spray'
  | 'highlighter'
  | 'eyebrow'
  | 'eyelashes'
  | 'lip_liner'
  | 'lip_gloss'
  | 'nail_polish'
  | 'skincare'
  | 'makeup'
  | 'haircare'
  | 'fragrance'
  | 'bodycare'
  | 'suncare';

export type ProductType =
  | 'foundation'
  | 'mascara'
  | 'lipstick'
  | 'eyeliner'
  | 'eyeshadow'
  | 'blush'
  | 'bronzer'
  | 'concealer'
  | 'primer'
  | 'powder'
  | 'spray'
  | 'highlighter'
  | 'eyebrow'
  | 'lip_liner'
  | 'lip_gloss'
  | 'nail_polish'
  | 'cleanser'
  | 'moisturizer'
  | 'serum'
  | 'treatment';

export type SkinTypeCompatibility = 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
export type BudgetRange = 'budget' | 'mid' | 'premium';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 100, nullable: true })
  brand: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Product main category'
  })
  category: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Specific product category from API'
  })
  productCategory: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Product type from API'
  })
  productType: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'image_url'
  })
  imageUrl: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'product_link'
  })
  productLink: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    comment: 'List of ingredients'
  })
  ingredients: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    name: 'suitable_skin_types',
    comment: 'Skin types this product is suitable for'
  })
  suitableSkinTypes: SkinTypeCompatibility[];

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    comment: 'Target skin concerns'
  })
  targetConcerns: string[]; // ['acne', 'aging', 'dark_spots', 'dryness', 'oiliness']

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    comment: 'Tags for filtering and search'
  })
  tags: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    comment: 'Tag list from API'
  })
  tagList: string[];

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Price in USD'
  })
  price: number;

  @Column({
    type: 'enum',
    enum: ['budget', 'mid', 'premium'],
    default: 'mid',
    comment: 'Budget classification'
  })
  budgetRange: string;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true,
    comment: 'Product rating (1-5)'
  })
  rating: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'api_source_id',
    comment: 'ID from external API source'
  })
  apiSourceId: string;

  @Column({
    type: 'enum',
    enum: ['makeup_api', 'open_beauty_facts', 'sephora', 'ulta', 'cosdna'],
    default: 'makeup_api',
    name: 'api_source'
  })
  apiSource: 'makeup_api' | 'open_beauty_facts' | 'sephora' | 'ulta' | 'cosdna';

  @Column({
    type: 'timestamp',
    name: 'last_updated'
  })
  lastUpdated: Date;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Whether this product is currently available'
  })
  isAvailable: boolean;

  @Column({ default: false, comment: 'Product is non-comedogenic' })
  isNonComedogenic: boolean;

  @Column({ default: false, comment: 'Product is hypoallergenic' })
  isHypoallergenic: boolean;

  @Column({ default: false, comment: 'Product contains natural/organic ingredients' })
  isOrganic: boolean;

  @Column({ default: false, comment: 'Product is cruelty-free' })
  isCrueltyFree: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Recommendation, recommendation => recommendation.product)
  recommendations: Recommendation[];

  @ManyToMany(() => Quiz, quiz => quiz.recommendedProducts)
  recommendedFor: Quiz[];
}