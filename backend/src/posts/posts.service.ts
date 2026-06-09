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
    async findAll(page = 1, limit = 10, search?: string, tag?: string) { //몇번째 페이지인지, 태그 or 검색어 기능도 추가
        const query = this.postRepository
            .createQueryBuilder('post') //post로 쿼리 작성
            .leftJoinAndSelect('post.author', 'author') // 작성자 정보
            .leftJoinAndSelect('post.tags', 'tag') //태그정보
            .orderBy('post.createdAt', 'DESC') //최신순으로
            .skip((page - 1) * limit) //스킵할 페이지
            .take(limit); //limit만큼 가져옴

        if(search) { //검색어가 들어왔으면
            query.andWhere( //AND 조건을 추가함.(필터 붙이기)
                '(post.title ILIKE :search OR post.content ILIKE :search)', //post.title,content ILIKE :search -> 제목이나 내용에 검색어가 포함돼있으면 찾음 (SQL 조건문)
                { search: `%${search}%`}, // 직접 값을 삽입할 수 있지만, 보안상의 이유로 따로 전달.
            );
        }

        if (tag) { //태그가 들어왔으면
            query.andWhere('tag.name = :tag', { tag: tag });
        }

        const [items, total] = await query.getManyAndCount();

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
