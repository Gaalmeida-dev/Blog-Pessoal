import { forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Module } from '@nestjs/common'; 
import { UsuarioModule } from "../usuario/usuario.modulo";
import { Bcrypt } from "./bcrypt/bcrypt";
import { jwtConstants } from "./constants/constants";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "./strategy/jwt-auth.strategy";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
    imports: [
        forwardRef(() => UsuarioModule),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' },
        })
    ],
    providers: [
        Bcrypt,
        AuthService,
        LocalStrategy,
        JwtStrategy,
    ],
    controllers: [AuthController],
    exports: [Bcrypt],
})
export class AuthModule {};