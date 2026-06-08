//DB 테이블 설계도

//users 테이블에 컬럼 구조를 TypeScript클래스로 정의하는 파일

//typeorm 패키지에서 column,createdatecolumn, ...이것들을 가져옴.
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';



//해당 클래스는 users 테이블을 User클래스로 다룸.
@Entity('users') 
export class User { //테이블 컬럼을 정의, 다른 TypeScript파일에서 User클래스를 쓰게하려고 Export
    // '!'는 지금 당장 값이 없어도 실제로 실행될때 TypeORM이 값을 넣어줄 것이라는걸 암시.
    @PrimaryGeneratedColumn() //기본키
    id!: number; 

    @Column({unique: true}) //이메일, 중복 허용 X
    email!: string;

    @Column() //닉네임
    nickname!: string;

    @Column( { select: false }) //암호화된 비밀번호 저장 
    passwordHash!: string;

    @CreateDateColumn() //데이터가 처음 만들어진 시간 저장
    createdAt!: Date;

    @UpdateDateColumn() //데이터가 마지막으로 수정된 시간 저장
    updatedAt!: Date; 
}