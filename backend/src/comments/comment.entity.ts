import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn() //댓글 고유 번호
    id!: number;

    @Column('text') //댓글 내용
    content!: string;

    //ManyToOne:외래키
    @ManyToOne(() => User) //누가 쓴 댓글인가?
    author!: User;

    @ManyToOne(() => Post) //어떤 게시글에 달린 댓글인가?
    post!: Post;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}