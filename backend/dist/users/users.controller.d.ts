import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        user: Partial<import("../entities").User>;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        user: Partial<import("../entities").User>;
    }>;
    getProfile(req: any): Promise<Partial<import("../entities").User>>;
}
