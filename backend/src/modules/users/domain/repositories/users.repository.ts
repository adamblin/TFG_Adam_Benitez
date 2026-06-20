import { UserEntity } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract create(data: {
    email: string;
    username: string;
    passwordHash: string;
  }): Promise<UserEntity>;

  abstract createOAuthUser(data: {
    email: string;
    googleId: string;
  }): Promise<UserEntity>;

  abstract findByEmail(email: string): Promise<UserEntity | null>;

  abstract findByUsername(username: string): Promise<UserEntity | null>;

  abstract findById(id: string): Promise<UserEntity | null>;

  abstract findByGoogleId(googleId: string): Promise<UserEntity | null>;

  abstract update(
    id: string,
    data: { username?: string; email?: string; googleId?: string },
  ): Promise<UserEntity>;

  abstract updateUsername(id: string, username: string): Promise<UserEntity>;
}
