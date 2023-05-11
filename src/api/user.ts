import instance from "./instance";
import {
  KAKAO_SCOPE_BIRTHDAY,
  KAKAO_SCOPE_EMAIL,
  KAKAO_SCOPE_GENDER,
  KAKAO_SCOPE_NICKNAME,
} from "../common/constants";
import { auth } from "../config";
import { Auth, User } from "../@types";

export const loginWithKakao = (state?: any) => {
  const redirectUri = `${location.origin}/callback/kakaotalk`;
  const scope = [
    KAKAO_SCOPE_NICKNAME,
    KAKAO_SCOPE_GENDER,
    KAKAO_SCOPE_BIRTHDAY,
    KAKAO_SCOPE_EMAIL,
  ].join(",");

  window.Kakao.Auth.authorize({
    redirectUri,
    scope,
    ...(state ? { state } : {}),
  });
};

export const authKakao = (code: string) => {
  return instance.post<Auth>("/api/auth/kakao", { code });
};

export const createUser = (user: User) => {
  return instance.post("/api/users/" + user.id, { ...user });
};

export const getUser = async (id: string): Promise<User | null> => {
  const token = await auth.currentUser?.getIdToken();
  const res = await instance.get("/api/users/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 204) {
    return null;
  }
  return res.data;
};

export const updateUser = async (
  id: string,
  original: User,
  data: Partial<User>
) => {
  if (data.nickname && original.nickname !== data.nickname) {
    const nicknames = await getNicknames();
    const set = new Set(nicknames);
    set.delete(original.nickname);
    if (set.has(data.nickname as string)) {
      throw new Error("이미 존재하는 닉네임입니다.");
    }
  }
  const token = await auth.currentUser?.getIdToken();
  return await instance.patch(
    "/api/users/" + id,
    { ...data },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteUser = (token: string) => {
  const userId = auth.currentUser?.uid;
  return instance.delete("/api/users/" + userId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getNicknames = async (): Promise<string[]> => {
  const users = await instance.get("/api/users", {
    params: { fields: ["nickname"] },
  });
  if (users.status === 204) {
    return [];
  }
  return users.data.map((user: { nickname: string }) => user.nickname);
};
