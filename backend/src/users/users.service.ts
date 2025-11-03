import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ user: Partial<User> }> {
    const { email, password, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.usersRepository.create({
      ...userData,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;

    return { user: userWithoutPassword };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ user: Partial<User> }> {
    const { email, password } = loginUserDto;

    // Find user
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword };
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['quiz']
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  // No more JWT tokens - using simple session-based auth
}
