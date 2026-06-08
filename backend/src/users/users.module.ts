import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({ 
  imports: [TypeOrmModule.forFeature([User])], //이 UsersModule 안에서 User Entity의 DB 저장소를 쓸 수 있게 해라
  providers: [UsersService], //UsersService를 이 모듈 안에서 사용할 수 있는 서비스로 등록해라
  exports: [UsersService], //UsersService를 다른 모듈에서도 사용할 수 있게 밖으로 공개해라
})
export class UsersModule { }