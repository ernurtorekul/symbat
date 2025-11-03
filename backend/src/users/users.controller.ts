import { Controller, Post, Get, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('profile')
  async getProfile(@Req() req) {
    // For now, we'll just return a simple profile without strict authentication
    // In production, you might want to add simple session validation
    return this.usersService.getProfile('72cc3ba2-aee7-4ace-9de4-859722d6efc8');
  }
}
