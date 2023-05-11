import { NormalizedUser } from "./user";

export interface Auth {
  firebaseToken: string;
  kakaoUser: NormalizedUser;
  isJoined: boolean;
}
