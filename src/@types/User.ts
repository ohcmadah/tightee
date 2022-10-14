export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
}

export interface NormalizedUser {
  id: string;
  provider: string;
  nickname?: string;
  profileImg?: string;
  email?: string;
  birthday?: string;
  gender?: number;
}
