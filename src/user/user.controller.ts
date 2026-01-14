import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body('name') name: string,

    @Body('email') email: string,

    @Body('password') password: string,
  ) {
    return await this.userService.createUser(name, email, password);
  }

  @Get(':id')
  async getUser(@Param('id') id: number, @Query('token') token: string) {
    return await this.userService.getUser(token, id);
  }

  @Get()
  async getUserinfo(
    @Query('name') name: string,
    @Query('token') token: string,
  ) {
    return await this.userService.getUserinfo(name, token);
  }

  @Put(':id')
  async putUserinfo(
    @Param('id') id: number,
    @Query('token') token: string,
    @Body('Photoid') Photoid: string,
    @Body('mail') mail: string,
    @Body('text') text: string,
  ) {
    return await this.userService.putUserinfo(id, token, Photoid, mail, text);
  }
}
