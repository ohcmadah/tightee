import * as functions from "firebase-functions";
import * as cors from "cors";
import axios from "axios";
import { config } from "dotenv";

const corsOptions: cors.CorsOptions = { origin: true };
config();

const KAKAO_GET_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
type TokenResponse = {
  token_type: string;
  access_token: string;
  id_token?: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
};

const getToken = async (code: string): Promise<TokenResponse> => {
  const body = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_REST_API_KEY ?? "",
    redirect_uri: process.env.KAKAO_REDIRECT_URI ?? "",
    code: code,
  };

  const res = await axios.post(KAKAO_GET_TOKEN_URL, new URLSearchParams(body));
  return res.data;
};

export const onLoginWithKakao = functions
  .region("asia-northeast3")
  .https.onRequest((req, res) => {
    return cors(corsOptions)(req, res, async () => {
      const { code } = req.body;

      try {
        const response = await getToken(code);
        const token = response.access_token;

        return res.status(200).json({
          kakaoToken: token,
        });
      } catch (error: any) {
        console.error(error.response);

        const err = error.response;
        return res.status(err.status).json({
          code: err.status,
          message: err.statusText,
        });
      }
    });
  });
