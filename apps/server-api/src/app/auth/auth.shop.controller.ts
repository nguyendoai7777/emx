import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth/shop')
export class AuthShopController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerClient(@Body body) {}
}
