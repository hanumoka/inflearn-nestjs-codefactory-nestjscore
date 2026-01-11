import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    // NestJs에게 PostModel 엔티티용 Repository를 주입해줘 라고 요청
    // TypeOrm이 PostModel 기반으로 스스로 Repository 인스턴스를 생성하여 주입한다.
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  async getAllPosts() {
    // Nestjs에서 Controller가 Promise를 반환하면 자동으로 await 처리를 해준다.
    return this.postRepository.find();
  } //getAllPosts

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    } //if

    return post;
  } //getPost

  async createPost(author: string, title: string, content: string) {
    // create(저장할 객체만 메모리에 생성) -> save(실제 저장)
    // save의 기능
    // 1. 만약에 데이터가 존재하지 않는다면 (id 기준) 새로 생성한다.
    // 2. 만약에 데이터가 존재한다면(id 기준) update를 한다.
    const post = this.postRepository.create({
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = this.postRepository.save(post);

    return newPost;
  } //createPost

  async updatePost(
    id: number,
    title?: string,
    content?: string,
    author?: string,
  ) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    } //if

    if (title) {
      post.title = title;
    } //if

    if (content) {
      post.content = content;
    } //if

    if (author) {
      post.author = author;
    } //if

    const newPost = await this.postRepository.save(post);
    return newPost;
  } //updatePost

  async deletePost(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    } //if

    await this.postRepository.delete(id);

    return post;
  }
} //PostsService
