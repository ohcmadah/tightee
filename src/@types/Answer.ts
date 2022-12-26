import { User } from "./User";

export interface Answer {
  id: string;
  user: User;
  question: string;
  option: string;
}
