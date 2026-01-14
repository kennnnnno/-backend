import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body('message') message: string,

    @Query('token') token: string,
  ) {
    return await this.postService.createPost(message, token);
  }

  @Get()
  async getList(
    @Query('token') token: string,

    @Query('start') start: number,

    @Query('records') records: number,

    @Query('keyword') keyword?: string,
  ) {
    if (keyword) {
      return await this.postService.getSerchList(
        token,
        start,
        records,
        keyword,
      );
    } else {
      return await this.postService.getList(token, start, records);
    }
  }

  @Get(':id')
  async getUserList(
    @Param('id') id: number,

    @Query('token') token: string,

    @Query('start') start: number,

    @Query('records') records: number,
  ) {
    return await this.postService.getUserList(token, start, records, id);
  }

  @Delete()
  async deletePost(
    @Query('id') id: number,

    @Query('token') token: string,
  ) {
    await this.postService.deleteList(id, token);
  }
}
