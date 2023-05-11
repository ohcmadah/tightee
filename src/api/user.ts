import instance from "./instance";
import {
  KAKAO_SCOPE_BIRTHDAY,
  KAKAO_SCOPE_EMAIL,
  KAKAO_SCOPE_GENDER,
  KAKAO_SCOPE_NICKNAME,
} from "../common/constants";
import { auth } from "../config";
import {
  AuthenticateResponse,
  CreateUserResponse,
  DeleteUserResponse,
  GetUserResponse,
  UpdateUserResponse,
  GetUsersResponse,
} from "../@types/response";
import { User } from "../@types/user";

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
  return instance.post<AuthenticateResponse>("/api/auth/kakao", { code });
};

export const createUser = (user: User) => {
  return instance.post<CreateUserResponse>("/api/users/" + user.id, {
    ...user,
  });
};

export const getUser = async (id: User["id"]) => {
  const token = await auth.currentUser?.getIdToken();
  const res = await instance.get<GetUserResponse>("/api/users/" + id, {
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
  return await instance.patch<UpdateUserResponse>(
    "/api/users/" + id,
    { ...data },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteUser = (token: string) => {
  const userId = auth.currentUser?.uid;
  return instance.delete<DeleteUserResponse>("/api/users/" + userId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getNicknames = async () => {
  const users = await instance.get<GetUsersResponse<"nickname">>("/api/users", {
    params: { fields: ["nickname"] },
  });
  if (users.status === 204) {
    return [];
  }
  return users.data.map(({ nickname }) => nickname);
};
