//실제로 요청 처리하는곳

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'; //bcrypt로부터 bcrypt라는 이름으로 가져옴


@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService){}

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
        return { //프론트에서 사용할 수 있게 기본 정보들 리턴해줌
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        }
    }
}
