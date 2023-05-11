import { Answer } from "./answer";
import { Auth } from "./auth";
import { Question } from "./question";
import { User } from "./user";

export type GetAnswersResponce = Answer[];
export type GetAnswerGroupsResponse = {
  [key: string]: { [id: string]: string[] };
};
export type GetAnswerResponse = Answer;

export type GetQuestionsResponse = Question[];
export type GetQuestionResponse = Question;

export type AuthenticateResponse = Auth;
export type CreateUserResponse = {};
export type GetUserResponse = User;
export type UpdateUserResponse = {};
export type DeleteUserResponse = {};
export type GetUsersResponse<K extends keyof User> = Pick<User, K>[];
