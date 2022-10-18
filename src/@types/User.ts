export interface User {
  id: string;
  email?: string;
  nickname: string;
  profileImg: string;
  region: string;
  birthdate: Date;
  gender: number;
  MBTI?: string;
  subscribe: {
    marketing: boolean;
  };
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
