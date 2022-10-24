export interface User {
  id: string;
  email: string | null;
  nickname: string;
  region: string;
  birthdate: number;
  gender: number;
  MBTI: string | null;
  subscribe: {
    marketing: boolean;
  };
}

export interface NormalizedUser {
  id: string;
  provider: string;
  nickname?: string;
  email?: string;
  birthday?: string;
  gender?: number;
}
