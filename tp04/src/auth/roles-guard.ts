import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles-decorator.js";
import { Role } from "../users.js";
import { AuthenticatedRequest } from "./auth.guard.js";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const required = this.reflector.getAllAndOverride<Role[] | undefined>(
            ROLES_KEY, [context.getHandler(), context.getClass()],
        );

        if (required === undefined) return true;

        const {user} = context.switchToHttp().getRequest<AuthenticatedRequest>();

        if (!user || !required.includes(user.role)) {
            throw new ForbiddenException();
        }

        return true;
    }
    
}
