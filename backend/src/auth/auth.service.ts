//실제로 요청 처리하는곳

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'; //bcrypt로부터 bcrypt라는 이름으로 가져옴
import { JwtService } from '@nestjs/jwt'; //jwt토큰 검증 서비스


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,        
    ){}

    //회원가입 처리 함수. 비동기
    async register(email: string, nickname: string, password: string) {
        const existingUser = await this.userService.findByEmail(email); //users테이블에서 같은 이메일 가진 유저 찾아서 결과 existingUser에 담음
        
        if (existingUser) { //같은 이메일 유저가 있으면 에러 발생(예외처리)
            throw new ConflictException('이미 가입된 이메일입니다.');
        }
        //hash로 변환해서 passwordHash에 삽입. 10:saltround, 비밀번호를 해시할 때 얼마나 오래/강하게 계산할지 정하는 숫자
        const passwordHash = await bcrypt.hash(password, 10);         

        return this.userService.createUser(email, nickname, passwordHash); //이메일 닉네임 해쉬된 비밀번호로 users테이블에 저장하고 저장된 유저 리턴
    }
    
    //로그인 함수
    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) { //틀리면 에러 뱉기
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        //bcrypt가 password가 자동으로 해시화해서 user.passwordHash와 비교
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash); 
        if (!isPasswordValid) { //PW 틀리면
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        const accessToken = this.jwtService.sign({ //accessToken 저장
            sub: user.id,
            email: user.email,
        });

        return { //프론트에서 사용할 수 있게 기본 정보들 리턴해줌
            accessToken,
            user: { //토큰정보와 유저정보 구분하려고 묶음
                id: user.id,
                email: user.email,
                nickname: user.nickname,
            }
        }
    }

    async me(authorization: string) { //현재 로그인한 유저 정보 리턴하는 함수
        if(!authorization) {
            throw new UnauthorizedException('인증 토큰이 없습니다.');
        }
        
        //Bearer abc.def.ghi 이런식으로 들어옴. 그래서 Bearer부분을 빈 문자열로 바꿈.
        const accessToken = authorization.replace('Bearer ', ''); 
        const payload = this.jwtService.verify(accessToken); //jwt토큰이 유효한지 확인
        
        // JWT payload의 sub(user id)를 이용해서 DB에서 현재 유저를 조회
        const user = await this.userService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
        }

        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        }
    } 
}
