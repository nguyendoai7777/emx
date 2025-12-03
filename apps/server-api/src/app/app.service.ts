import { Injectable } from '@nestjs/common';
import { PrismaClientService, Role } from '@prisma-client';
import { hash } from 'argon2';

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
        role: Role.ADMIN,
        username: 'admin',
        phone: '0336224228',
      },
    });
    return user;
  }
}
