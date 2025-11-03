import { IsString, IsOptional, IsEnum, IsInt, Min, Max, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name should only contain letters and spaces' })
  name?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  age?: number;
}