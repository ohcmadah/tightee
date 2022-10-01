import * as functions from "firebase-functions";
import * as cors from "cors";
import axios from "axios";
import { config } from "dotenv";
import { KAKAO_GET_TOKEN_URL, SEOUL_CODE } from "./constants";

const corsOptions: cors.CorsOptions = { origin: true };
config();

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
  .region(SEOUL_CODE)
  .https.onRequest(
    (req: functions.https.Request, res: functions.Response<any>) => {
      return cors(corsOptions)(req, res, async () => {
        switch (req.method) {
          case "POST":
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

          default:
            return res.json({});
        }
      });
    }
  );
