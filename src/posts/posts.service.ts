import { Injectable, NotFoundException } from '@nestjs/common';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'string1',
    title: 'string1',
    content: 'string',
    likeCount: 1,
    commentCount: 1,
  },
  {
    id: 2,
    author: 'string2',
    title: 'string2',
    content: 'string',
    likeCount: 1,
    commentCount: 1,
  },
  {
    id: 3,
    author: 'string3',
    title: 'string3',
    content: 'string',
    likeCount: 1,
    commentCount: 1,
  },
];

@Injectable()
export class PostsService {
  getAllPosts(): PostModel[] {
    return posts;
  } //getAllPosts

  getPostById(id: number): PostModel {
    const post = posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException();
    } //if
    return post;
  } //getPost

  createPost(author: string, title: string, content: string): PostModel {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    // posts = [...posts, post];
    posts.push(post);
    return post;
  } //createPost

  updatePost(
    id: number,
    title?: string,
    content?: string,
    author?: string,
  ): PostModel {
    const post = posts.find((item) => item.id === id);

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

    posts = posts.map((prevPost) => (prevPost.id === id ? post : prevPost));

    return post;
  } //updatePost

  deletePost(id: number): PostModel {
    const post = posts.find((post) => post.id === id);

    if (!post) {
      throw new NotFoundException();
    } //if

    posts = posts.filter((post) => post.id !== id);

    return post;
  }
}
