export type UserEntity = {
  id: string;
  email: string;
  username: string | null;
  passwordHash: string | null;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
};
