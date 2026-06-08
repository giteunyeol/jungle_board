//HTTP 요청 받는곳

import { Body, Controller, Post } from '@nestjs/common'; 
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {} //의존성 주입

    @Post('register') //Post방식으로 /auth/register들어오면 실행
        //@Body데코레이터 : HTTP요청의 body 데이터를 꺼내 이 파라미터에 넣어라. 그러면 JSON body를 꺼내 body변수에 넣어줌. 
    register(@Body() body: { email: string; nickname: string; password: string;}) { 
        return this.authService.register(body.email, body.nickname, body.password);
    }

    @Post('login')
    login(@Body() body : {email: string, password: string}) {
        return this.authService.login(body.email, body.password);
    }
}
