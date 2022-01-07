export type UserData = {
  id: number;
  username: string;
  email: string;
  apiKey?: string;
};

export type AuthData = {
  user?: UserData;
  loggedIn: boolean;
  sync: () => Promise<boolean>;
  signin: (
    username_email: string,
    password: string,
    remember: boolean
  ) => Promise<UserData>;
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<UserData>;
  signout: () => Promise<void>;
  generateApiKey: () => Promise<string | undefined>;
};
