import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
    constructor (
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    //content:댓글 내용, post:댓글 달릴 게시글, author:댓글 작성자
    createComment(content: string, post: Post, author: User): Promise<Comment> {
        const comment = this.commentRepository.create({
            content,
            post,
            author,
        });
        return this.commentRepository.save(comment);
    }

    //특정 게시물 댓글 목록 조회
    findByPost(postId: number): Promise<Comment[]> { 
        return this.commentRepository.find({
            where: { post: { id: postId, }, }, //postId: 댓글 조회할 게시글 id
            relations: { author: true, }, //댓글 작성자 정보도 가져오기
            order: { createdAt: 'ASC' } //오래된 댓글 순으로 정렬
        })
    }

    //댓글 삭제
    async deleteComment(id: number, currentUser: User): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: { author: true, },
        });

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }

        if (comment.author.id !== currentUser.id) {
            throw new ForbiddenException('댓글 삭제 권한이 없습니다.');
        }

        await this.commentRepository.remove(comment);
    }
}
