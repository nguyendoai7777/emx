import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DtoLogin } from '@emx/dto';

@Controller('auth/console')
export class AuthConsoleController {
  constructor(private readonly auth$$: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async registerClient(@Body() body: DtoLogin) {
    console.log(`@@ login from admin`, body);
    return this.auth$$.login(body);
  }
}
