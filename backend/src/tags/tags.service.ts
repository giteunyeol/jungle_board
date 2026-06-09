import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    //태그를 이름으로 찾거나 생성한다.
    async findOrCreateTag(name: string): Promise<Tag> { 
        const existingTag = await this.tagRepository.findOne({
            where: { name },
        });

        if (existingTag) {
            return existingTag;
        }

        const tag = this.tagRepository.create({ name });
        return this.tagRepository.save(tag);
    }

    //여러 문자열을 Tag 객체들로 해결/변환
    async resolveTags(names: string[]): Promise<Tag[]> {
        const uniqueNames = [...new Set(names)]; // 중복태그를 제거해줌

        //uniqueNames에 있는 name들을 차례대로 받아서 Tag 객체로 바꿔줌
        const tags = await Promise.all(
            uniqueNames.map((name) => this.findOrCreateTag(name)),
        );

        return tags;
    }

    
}
