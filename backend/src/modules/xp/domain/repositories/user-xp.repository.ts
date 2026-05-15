import { UserXPEntity } from '../entities/user-xp.entity';

export abstract class UserXPRepository {
  abstract findByUserId(userId: string): Promise<UserXPEntity | null>;
  abstract addXP(userId: string, amount: number): Promise<UserXPEntity>;
  abstract addCoins(userId: string, amount: number, claimDate?: Date): Promise<UserXPEntity>;
  abstract spendCoins(userId: string, amount: number): Promise<UserXPEntity>;
}
