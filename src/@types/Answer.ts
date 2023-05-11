import { User } from "./user";

export interface Answer {
  id: string;
  user: User;
  question: string;
  option: string;
}
