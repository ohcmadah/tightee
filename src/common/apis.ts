import axios from "axios";
import { AuthResponse } from "../@types";

export const authKakao = (code: string): Promise<AuthResponse> => {
  return axios.post("/api/auth/kakao", { code });
};
