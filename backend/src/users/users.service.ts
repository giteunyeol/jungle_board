import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; //TypeORM 레포를 NestJS서비스로 가져오게함
import { Repository } from 'typeorm'; //TypeORM에서 특정 테이블을 조작하는 객체 타입
import { User } from './user.entity';


//NestJS 데코레이터. 의존성 주입
//TypeORM에서 intectable()을 보고 내가 관리할 대상이네? 확인. 
//생성자 보고 userRepository 넣어주면 되는구나 확인 후 UsersService 에 repository넣어줌
@Injectable() 
export class UsersService {
    constructor( //생성자
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    //이메일로 유저 한명을 찾음, 비동기작업(동시에 다른작업처리)
    findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ //users테이블에서 email같은 데이터 찾아서 리턴
            where: { email },
        });
    }

    //ID로 유저 한명 찾음. 
    findById(id: number): Promise<User | null> { 
        return this.userRepository.findOne({
            where: { id },
        });
    }

    //새 유저를 만드는 함수.
    createUser(email: string, nickname: string, passwordHash: string): Promise<User> {
        const user = this.userRepository.create({
            email,
            nickname,
            passwordHash,
        });
        return this.userRepository.save(user); //저장 끝나면 저장된 User리턴
    }
}
