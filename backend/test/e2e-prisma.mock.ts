type UserRecord = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
};

type PrismaUserDelegateMock = {
  create: (args: {
    data: {
      email: string;
      username: string;
      passwordHash: string;
    };
  }) => Promise<UserRecord>;
  findUnique: (args: {
    where: Partial<Pick<UserRecord, 'id' | 'email' | 'username'>>;
  }) => Promise<UserRecord | null>;
};

export function createPrismaServiceMock(): {
  user: PrismaUserDelegateMock;
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
} {
  const users = new Map<string, UserRecord>();

  return {
    user: {
      create({ data }) {
        const user: UserRecord = {
          id: `user_${users.size + 1}`,
          email: data.email,
          username: data.username,
          passwordHash: data.passwordHash,
        };

        users.set(user.id, user);
        return Promise.resolve(user);
      },
      findUnique({ where }) {
        if (where.id) {
          return Promise.resolve(users.get(where.id) ?? null);
        }

        if (where.email) {
          for (const user of users.values()) {
            if (user.email === where.email) {
              return Promise.resolve(user);
            }
          }
        }

        if (where.username) {
          for (const user of users.values()) {
            if (user.username === where.username) {
              return Promise.resolve(user);
            }
          }
        }

        return Promise.resolve(null);
      },
    },
    async $connect() {},
    async $disconnect() {},
  };
}
