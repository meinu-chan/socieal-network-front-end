export enum UserRole {
  admin = 'admin',
  user = 'user',
}

export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
  nickname?: string;
  photo: string;
  backgroundAvatar: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface UserData extends Omit<IUser, 'password' | 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export type UpdateUserParams = Partial<
  Pick<IUser, 'fullName' | 'nickname' | 'photo' | 'backgroundAvatar'>
>;

export type GetUserResponse = Promise<UserData>;

export type GetNonPaginatedUsersResponse = Promise<UserData[]>;
