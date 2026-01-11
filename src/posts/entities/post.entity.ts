import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn() // TypeOrm 에서는 모든 Entity는 반드시 pk가 필요하다.
  id: number;
  @Column()
  author: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  likeCount: number;
  @Column()
  commentCount: number;
}
