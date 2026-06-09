import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service'; //인증
import { PostsService } from './posts.service'; //게시글 CRUD로직 사용

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly authService: AuthService,
    ) {}

    @Post() //Post/posts요청 처리
    async create (
        @Headers('authorization') authorization: string, // JWT토큰이 들어있는 Authorization 헤더 꺼냄 
        @Body() body : { title: string; content: string; tagNames?: string[] }, // 요청 body에서 title, content 꺼냄
    ) {
        const currentUser = await this.authService.me(authorization);

        return this.postsService.createPost(
            body.title,
            body.content,
            currentUser,
            body.tagNames,
        );
    }

    @Get() 
    findAll( 
        @Query('page') page?: string, //처음에 게시판 들어올때 몇번째일지 안알려줄 수 있으니까 
        @Query('limit') limit?: string, 
        @Query('search') search?: string,
        @Query('tag') tag?: string,
    ) { 
        return this.postsService.findAll( page ? Number(page) : 1, limit ? Number(limit) : 10, search, tag); //삼항연산자, page있으면 해당 넘버, 없으면 기본값(1)
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.postsService.findById(Number(id));
    }

    @Patch(':id') 
    async updatePost(
        @Param('id') id: string,
        @Headers('authorization') authorization: string,
        @Body() body: { title: string; content; string; tagNames?: string[] },
    ){
        const currentUser = await this.authService.me(authorization);

        return this.postsService.updatePost(
            Number(id),
            body.title,
            body.content,
            currentUser,
            body.tagNames,
        );
    }

    @Delete(':id')
    async deletePost(
        @Param('id') id: string,
        @Headers('authorization') authorization: string
    ) {
        const currentUser = await this.authService.me(authorization);

        await this.postsService.deletePost(Number(id), currentUser);

        return {
            messege: '게시글이 삭제됐습니다.',
        }
    }

}
