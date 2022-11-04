interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
}

interface KakaoProfile {
  nickname?: string;
  thumbnail_image_url?: string;
  profile_image_url?: string;
  is_default_image?: boolean;
}

interface KakaoAccount {
  profile?: KakaoProfile;
  name?: string;
  email?: string;
  birthday?: string;
  gender?: "male" | "female";
}

interface KakaoUser {
  id: number;
  kakao_account?: KakaoAccount;
}

interface NormalizedUser {
  id: string;
  provider: string;
  nickname?: string;
  email?: string;
  birthday?: string;
  gender?: string;
}
