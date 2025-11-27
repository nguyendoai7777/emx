import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@prisma-provider';
import { hash } from 'argon2';
import { $Enums } from '@prisma-client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaClientService) {}
  async seeding() {
    const adminEmail = 'nguyendoai7777@gmail.com';
    const passwordHash = await hash('qaz123QAZ!@#');
    const user = await this.prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        password: passwordHash,
        role: $Enums.Role.ADMIN,
        username: 'admin',
        phone: '0336224228',
      },
    });
    return user;
  }
}
