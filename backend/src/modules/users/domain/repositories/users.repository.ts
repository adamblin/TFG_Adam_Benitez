import { UserEntity } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract create(data: {
    email: string;
    username: string;
    passwordHash: string;
  }): Promise<UserEntity>;

  abstract findByEmail(email: string): Promise<UserEntity | null>;

  abstract findByUsername(username: string): Promise<UserEntity | null>;

  abstract findById(id: string): Promise<UserEntity | null>;
}