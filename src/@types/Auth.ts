import { NormalizedUser, User } from "./User";

export interface Auth {
  firebaseToken: string;
  user: User | null;
  kakaoUser: NormalizedUser;
}
