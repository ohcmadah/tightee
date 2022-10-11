import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import axios from "axios";
import { config } from "dotenv";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import {
  GENDER_FEMALE,
  GENDER_MALE,
  KAKAO_GENDER_FEMALE,
  KAKAO_GENDER_MALE,
  KAKAO_GET_TOKEN_URL,
  KAKAO_GET_USER_INFO_URL,
  KAKAO_PROVIDER,
  SEOUL_CODE,
} from "./constants";

const corsOptions: cors.CorsOptions = { origin: true };
config();

const getOrCreateUser = async (
  normalizedUser: NormalizedUser
): Promise<User> => {
  const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY || "");

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
  const auth = admin.auth(app);

  try {
    const user: UserRecord = await auth.getUser(normalizedUser.id);
    return user;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      const newUser = {
        uid: normalizedUser.id,
        provider: normalizedUser.provider,
        displayName: normalizedUser.nickname,
        photoURL: normalizedUser.profileImg,
        email: normalizedUser.email,
      };
      const user: UserRecord = await auth.createUser(newUser);
      return user;
    }
    console.error(error);
    throw error;
  }
};

const normalizeGender = (gender: string): number => {
  const map: { [key: string]: number } = {
    [KAKAO_GENDER_MALE]: GENDER_MALE,
    [KAKAO_GENDER_FEMALE]: GENDER_FEMALE,
  };

  return map[gender];
};

const normalizeKakaoUser = (user: KakaoUser): NormalizedUser => {
  const normalizedUser = {
    id: `kakao:${user.id}`,
    provider: KAKAO_PROVIDER,
    nickname: user.kakao_account.profile.nickname,
    profileImg: user.kakao_account.profile.profile_image_url,
    email: user.kakao_account.email,
    birthday: user.kakao_account.birthday,
    gender: normalizeGender(user.kakao_account.gender),
  };
  return normalizedUser;
};

const getKakaoUser = async (token: string): Promise<KakaoUser> => {
  const res = await axios.get(KAKAO_GET_USER_INFO_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

interface TokenResponse {
  token_type: string;
  access_token: string;
  id_token?: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
}

const getToken = async (code: string): Promise<TokenResponse> => {
  const body = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_REST_API_KEY || "",
    redirect_uri: process.env.KAKAO_REDIRECT_URI || "",
    code,
  };

  const res = await axios.post(KAKAO_GET_TOKEN_URL, new URLSearchParams(body));
  return res.data;
};

export const onLoginWithKakao = functions
  .runWith({ secrets: ["SERVICE_ACCOUNT_KEY"] })
  .region(SEOUL_CODE)
  .https.onRequest(
    (req: functions.https.Request, res: functions.Response<any>) => {
      return cors(corsOptions)(req, res, async () => {
        switch (req.method) {
          case "POST":
            const { code } = req.body.data;
            if (!code) {
              return res.status(400).json({
                code: 400,
                message: "code is a required parameter.",
              });
            }

            try {
              const response: TokenResponse = await getToken(code);
              const token = response.access_token;

              const kakaoUser: KakaoUser = await getKakaoUser(token);
              const normalizedUser: NormalizedUser =
                normalizeKakaoUser(kakaoUser);

              const user = await getOrCreateUser(normalizedUser);
              const firebaseToken = await admin
                .auth()
                .createCustomToken(user.uid, { KAKAO_PROVIDER });

              return res.status(200).json({
                user,
                firebaseToken,
              });
            } catch (error: any) {
              console.error(error);

              const err = error.response;
              return res.status(err.status).json({
                code: err.status,
                message: err.statusText,
              });
            }

          default:
            return res.json({});
        }
      });
    }
  );
