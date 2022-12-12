import { DocumentReference } from "firebase/firestore";
import { Option } from "./Option";

export interface Question {
  createdAt: string;
  options: [DocumentReference<Option>];
  title: string;
}
