import { Body, Controller, Delete, Get, Headers, NotFoundException, Param, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service'; 
import { PostsService } from 'src/posts/posts.service';
import { CommentsService } from './comments.service';
import { User } from 'src/users/user.entity';

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentService: CommentsService,
        private readonly postsService: PostsService,
        private readonly authService: AuthService,
    ) {}

    //댓글 게시
    @Post('posts/:postId')
    async create(
        @Param('postId') postId: string,
        @Headers('authorization') authorization: string,
        @Body() body: { content: string },
    ) {
        const currentUser = await this.authService.me(authorization);
        const post = await this.postsService.findById(Number(postId));

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }
        
        return this.commentService.createComment(body.content, post, currentUser); 
    }

    //댓글목록 조회
    @Get('posts/:postId')
    findByPost(@Param('postId') postId: string) {
        return this.commentService.findByPost(Number(postId));
    }

    //댓글삭제API
    @Delete(':id')
    async deleteComment(
        @Param('id') id: string,
        @Headers('authorization') authorization: string,
    ) {
        const currentUser = await this.authService.me(authorization);

        await this.commentService.deleteComment(Number(id), currentUser);

        return {
            message: '댓글이 삭제됐습니다.',
        };
    }

}
