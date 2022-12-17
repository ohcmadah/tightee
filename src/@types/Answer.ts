import { Option } from "./Option";
import { Question } from "./Question";
import { User } from "./User";

export interface Answer {
  id: string;
  user: User;
  question: Question;
  option: Option;
}
