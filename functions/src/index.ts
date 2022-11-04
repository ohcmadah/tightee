import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
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

config();

const app = express();
app.use(cors({ origin: true }));

const updateOrCreateUser = async (
  normalizedUser: NormalizedUser
): Promise<User> => {
  const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY || "");

  const app = !admin.apps.length
    ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
      })
    : admin.app();
  const auth = admin.auth(app);

  const properties = {
    uid: normalizedUser.id,
    provider: normalizedUser.provider,
    displayName: normalizedUser.nickname,
    email: normalizedUser.email,
  };

  try {
    const user: UserRecord = await auth.updateUser(
      normalizedUser.id,
      properties
    );
    return user;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      const user: UserRecord = await auth.createUser(properties);
      return user;
    }
    console.error(error);
    throw error;
  }
};

const normalizeGender = (gender: string): string => {
  const map: { [key: string]: string } = {
    [KAKAO_GENDER_MALE]: GENDER_MALE,
    [KAKAO_GENDER_FEMALE]: GENDER_FEMALE,
  };

  return map[gender];
};

const normalizeKakaoUser = (user: KakaoUser): NormalizedUser => {
  const kakaoAccount = user.kakao_account;

  const normalizedUser = {
    id: `kakao:${user.id}`,
    provider: KAKAO_PROVIDER,
    nickname: kakaoAccount?.profile?.nickname,
    email: kakaoAccount?.email,
    birthday: kakaoAccount?.birthday,
    gender: kakaoAccount?.gender && normalizeGender(kakaoAccount.gender),
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

app.post("/kakao", async (req, res) => {
  const { code } = req.body;
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
    const normalizedUser: NormalizedUser = normalizeKakaoUser(kakaoUser);

    const authUser = await updateOrCreateUser(normalizedUser);
    const firebaseToken = await admin
      .auth()
      .createCustomToken(authUser.uid, { KAKAO_PROVIDER });

    const user = await admin
      .firestore()
      .collection("users")
      .doc(authUser.uid)
      .get();

    return res.status(200).json({
      user: user.data(),
      kakaoUser: normalizedUser,
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
});

exports.auth = functions
  .runWith({ secrets: ["SERVICE_ACCOUNT_KEY"] })
  .region(SEOUL_CODE)
  .https.onRequest(app);
