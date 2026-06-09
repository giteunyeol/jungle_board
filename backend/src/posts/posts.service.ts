import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class PostsService {
    constructor( 
        @InjectRepository(Post) //Post테이블 조작 레포를 주입해줌
        //이 클래스 내부에서만 / 생성 후 수정 불가 / 프로퍼티 이름 / posts테이블을 다루는 레포 타입
        private readonly postRepository: Repository<Post>, 
        private readonly tagsService: TagsService,
    ) {}

    //게시물 만드는 함수
    async createPost(title: string, content: string, author: User, tagNames: string[] = [],): Promise<Post> { 
        const tags = await this.tagsService.resolveTags(tagNames);

        const post = this.postRepository.create({ //post객체 생성
           title,
           content,
           author, 
           tags,
        });
        return this.postRepository.save(post); //생성된 게시글 객체 리턴
    }

    //게시글 목록 조회(페이징)
    async findAll(page = 1, limit = 10) { //비동기로 Post 배열 리턴
        const [items, total] = await this.postRepository.findAndCount({ //findAndCount: 게시글 목록을 찾고, 조건에 맞는 전체 갯수도 세라. (게시글목록, 전체갯수 리턴함)
            relations: {author: true, tags: true}, //작성자 author정보랑 태그정보도 가져와라
            order: { createdAt: 'DESC' }, //최신글부터 나오게
            skip: (page - 1) * limit, //앞부터 몇개를 건너뛸지
            take: limit, //몇개 가져올지
        });

        return {
            items, //현재 페이지에 넣을 게시글 목록
            total, //전체 게시글 갯수
            page, //현재 페이지 번호
            limit, //한 페이지에 몇개 보여줄지
            totalPages: Math.ceil(total / limit), //전체 페이지 수
        }
    }

    //게시글 ID로 게시글 하나 조회
    findById(id: number): Promise<Post | null> { //게시글 id로 게시글 하나 조회
        return this.postRepository.findOne({
            where: { id },
            relations: { author: true, tags: true }, //게시글을 가져올 때 작성자 정보도 같이 가져와라
        });
    }

    //게시글 수정 함수
    async updatePost(id: number, title: string, content: string, currentUser: User, tagNames?: string[], ): Promise<Post> {
        const post = await this.findById(id); //id로 게시물 찾아서 post에 세이브
        if(!post) { //게시글 없으면 에러던짐
            throw new NotFoundException();
        }
        if(post.author.id !== currentUser.id) { //게시글 수정권한 있는 사용자인지 확인
            throw new ForbiddenException('게시글 수정 권한이 없습니다.');
        }

        post.title = title;
        post.content = content;
        if (tagNames) { //태그 들어온 경우 태그 바꿈
            post.tags = await this.tagsService.resolveTags(tagNames);
        }
        
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
