import { IsString, IsArray, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export enum SkinType {
  OILY = 'oily',
  DRY = 'dry',
  COMBINATION = 'combination',
  NORMAL = 'normal',
  SENSITIVE = 'sensitive'
}

export enum SkinTone {
  VERY_FAIR = 'very_fair',
  FAIR = 'fair',
  MEDIUM = 'medium',
  OLIVE = 'olive',
  TAN = 'tan',
  DEEP = 'deep'
}

export class SubmitQuizDto {
  @IsEnum(SkinType)
  @IsNotEmpty()
  skinType: SkinType;

  @IsEnum(SkinTone)
  @IsNotEmpty()
  skinTone: SkinTone;

  @IsArray()
  @IsString({ each: true })
  skinConcerns: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  @IsOptional()
  additionalResponses?: Record<string, any>;
}