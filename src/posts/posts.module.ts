import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entities/post.entity';

@Module({
  //forFeature : 모델에 해당되는 repository 주입
  imports: [TypeOrmModule.forFeature([PostModel])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
