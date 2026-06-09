import {
    Column,
    Entity,
    ManyToMany, //태그는 다대다
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true})
    name!: string;

    @ManyToMany(() => Post, (post) => post.tags)
    posts!: Post[];
}