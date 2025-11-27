import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserInfoDto } from '@emx/dto';
import { vnd } from '@emx/core';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  getData() {
    return { pong: 'ok' };
  }

  @Get('seed')
  seed() {
    return this.appService.seeding();
  }
}
