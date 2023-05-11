export type MBTI =
  | "ISTJ"
  | "ISFJ"
  | "INFJ"
  | "INTJ"
  | "ISTP"
  | "ISFP"
  | "INFP"
  | "INTP"
  | "ESTP"
  | "ESFP"
  | "ENFP"
  | "ENTP"
  | "ESTJ"
  | "ESFJ"
  | "ENFJ"
  | "ENTJ"
  | null;

export interface User {
  id: string;
  email: string | null;
  nickname: string;
  region: string;
  birthdate: number;
  gender: string;
  MBTI: MBTI;
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
  gender?: string;
}
