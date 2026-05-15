export type UserInventoryEntity = {
  id: string;
  userId: string;
  itemId: string;
  createdAt: Date;
};

export type UserPreferencesEntity = {
  id: string;
  userId: string;
  iconColor: string;
  theme: string;
  updatedAt: Date;
};
