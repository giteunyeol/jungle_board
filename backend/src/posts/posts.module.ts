import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; //PostModule 안에서 TypeORM repository를 쓸거임
import { Post } from './post.entity'; 
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule, TagsModule], //PostsModule 안에서 Post Entity용 Repository를 사용할 수 있게 등록
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
