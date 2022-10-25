import { NormalizedUser, User } from "./User";

export interface AuthResponse {
  data: {
    firebaseToken: string;
    user: User | null;
    kakaoUser: NormalizedUser;
  };
}
