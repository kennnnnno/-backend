import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth.entity';
import { MicroPost } from 'src/entities/microposts';

@Module({
  imports: [TypeOrmModule.forFeature([MicroPost, Auth])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
