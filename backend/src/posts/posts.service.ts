import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
    constructor( 
        @InjectRepository(Post) //Post테이블 조작 레포를 주입해줌
        //이 클래스 내부에서만 / 생성 후 수정 불가 / 프로퍼티 이름 / posts테이블을 다루는 레포 타입
        private readonly postRepository: Repository<Post>, 
    ) {}

    //게시물 만드는 함수
    createPost(title: string, content: string, author: User): Promise<Post> { 
        const post = this.postRepository.create({ //post객체 생성
           title,
           content,
           author, 
        });
        return this.postRepository.save(post); //생성된 게시글 객체 리턴
    }

    //모든 게시글 목록 조회
    findAll(): Promise<Post[]> { //비동기로 Post 배열 리턴
        return this.postRepository.find({ //posts 테이블에서 여러 게시글 조회
            relations: { author: true }, //author 관계데이터도 가져와라. true로 표시해주는 이유는 객체방식은 명시를 해줘서.
            order: { createdAt: 'DESC'}, //그리고 createdAt기준으로 내림차순 정렬해라
        });
    }

    //게시글 ID로 게시글 하나 조회
    findById(id: number): Promise<Post | null> { //게시글 id로 게시글 하나 조회
        return this.postRepository.findOne({
            where: { id },
            relations: { author: true, }, //게시글을 가져올 때 작성자 정보도 같이 가져와라
        });
    }

    //게시글 수정 함수
    async updatePost(id: number, title: string, content: string, currentUser: User,): Promise<Post> {
        const post = await this.findById(id); //id로 게시물 찾아서 post에 세이브
        if(!post) { //게시글 없으면 에러던짐
            throw new NotFoundException();
        }
        if(post.author.id !== currentUser.id) { //게시글 수정권한 있는 사용자인지 확인
            throw new ForbiddenException('게시글 수정 권한이 없습니다.');
        }
        
        post.title = title;
        post.content = content;
        
        return this.postRepository.save(post);
    }

    //게시글 삭제 함수
    async deletePost(id: number, currentUser: User): Promise<void> {
        const post = await this.findById(id);
        if(!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }
        if(post.author.id !== currentUser.id) {
            throw new ForbiddenException('게시글 삭제 권한이 없습니다.');
        }

        await this.postRepository.remove(post); 
    }
}
