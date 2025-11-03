import { IsEmail, IsString, IsOptional, IsEnum, IsInt, Min, Max, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name should only contain letters and spaces' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
    message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number'
  })
  password: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  age?: number;
}