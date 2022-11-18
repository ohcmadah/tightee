import { DocumentReference } from "firebase/firestore";
import { Option } from "./Option";

export interface Question {
  createdAt: number;
  options: [DocumentReference<Option>];
  title: string;
}
