import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    register(createUserDto: CreateUserDto): Promise<{
        user: Partial<User>;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        user: Partial<User>;
    }>;
    getProfile(userId: string): Promise<Partial<User>>;
}
