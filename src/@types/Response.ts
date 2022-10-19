import { NormalizedUser } from "./User";

export interface AuthResponse {
  data: {
    firebaseToken: string;
    user: NormalizedUser;
  };
}
