import { DocumentReference } from "firebase/firestore";
import { User } from "../../../src/@types/user";
import { Question } from "./Question";

export interface Answer {
  user: User;
  question: DocumentReference<Question>;
  option: string;
  createdAt: number;
}
