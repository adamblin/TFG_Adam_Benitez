export type UserXPEntity = {
  id: string;
  userId: string;
  totalXp: number;
  coins: number;
  lastCoinClaimAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
