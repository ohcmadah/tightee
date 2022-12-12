import { Option } from "./Option";
import { User } from "./User";

export interface Answer {
  id: string;
  user: User;
  question: {
    id: string;
    createdAt: string;
    options: [Option];
    title: string;
  };
  option: Option;
}
