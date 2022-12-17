import { NormalizedUser } from "./User";

export interface Auth {
  firebaseToken: string;
  kakaoUser: NormalizedUser;
  isJoined: boolean;
}
