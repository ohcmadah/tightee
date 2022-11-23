import { DocumentReference } from "firebase/firestore";
import { User } from "../../../src/@types";
import { Option } from "./Option";
import { Question } from "./Question";

export interface Answer {
  user: DocumentReference<User>;
  question: DocumentReference<Question>;
  option: DocumentReference<Option>;
}