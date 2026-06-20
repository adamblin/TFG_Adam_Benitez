import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    email: string;
    username: string;
    passwordHash: string;
  }): Promise<UserEntity> {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createOAuthUser(data: {
    email: string;
    googleId: string;
  }): Promise<UserEntity> {
    return this.prisma.user.create({ data });
  }

  async findByGoogleId(googleId: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async update(
    id: string,
    data: { username?: string; email?: string; googleId?: string },
  ): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateUsername(id: string, username: string): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data: { username } });
  }
}
