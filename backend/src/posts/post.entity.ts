//posts 테이블들 컬럼 정의(게시글)

import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne, //여러개의 Post가 하나의 User에 연결
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id!: number; //게시글 고유번호

    @Column()
    title!: string; //게시글 제목

    @Column('text')
    content!: string; //게시글 내용

    @ManyToMany(() => Tag, (tag) => tag.posts) 
    @JoinTable() //Post, Tag의 연결 정보를 저장할 중간 테이블 생성
    tags!: Tag[];

    @ManyToOne(() => User) //여러 게시글이 한명 유저로 연결
    author!: User;

    @CreateDateColumn()
    createdAt!: Date; //게시글 작성시간

    @UpdateDateColumn()
    updatedAt!: Date; //게시글 수정시간
}