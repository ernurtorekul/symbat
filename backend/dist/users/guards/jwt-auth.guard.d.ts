import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
export declare class JwtAuthGuard {
    private reflector;
    private configService;
    constructor(reflector: Reflector, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
