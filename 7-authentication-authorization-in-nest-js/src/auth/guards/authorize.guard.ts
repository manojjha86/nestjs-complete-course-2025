import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import authConfig from "../config/auth.config";
import { Reflector } from "@nestjs/core";
import { REQUEST_USER_KEY } from "src/constants/constants";

@Injectable()
export class AuthorizeGurad implements CanActivate{
    constructor(
        private readonly jwtService: JwtService,
        
        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        private readonly reflector: Reflector
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //READ isPublic Metadata
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass()
        ])

        if(isPublic){
            return true;
        }


        //1. EXTRACT REQUEST FROM EXECUTION CONTEXT
        const request: Request = context.switchToHttp().getRequest();

        //2. EXTRACT TOKEN FROM THE REQUEST HEADER
        //Bearer actual-json-we-token = ['Bearer', 'actual-json-we-token']
        const token = request.headers.authorization?.split(' ')[1];

        //3. VALIDATE TOKEN AND PROVIDE / DENY ACCESS
        if(!token){
            throw new UnauthorizedException();
        }

        try{
            const payload = await this.jwtService
                                .verifyAsync(token, this.authConfiguration);
            request[REQUEST_USER_KEY] = payload;
            
        }catch(error){
            throw new UnauthorizedException();
        } 

        return true;
    }
}