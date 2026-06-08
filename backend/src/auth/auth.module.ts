//auth 기능 묶음
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({  //AuthModule 안에서 UserModule 기능을 사용할 수 있게 연결
            secret: 'dev-secret', //JWT 토큰 서명할 때 사용할 비밀 키
            signOptions: {
                expiresIn: '30min',
            },
        }),
    ], 
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }

