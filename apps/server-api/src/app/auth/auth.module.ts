import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthConsoleController } from './auth.console.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthConsoleController],
  providers: [AuthService],
})
export class AuthModule {}
