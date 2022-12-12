import { Option } from "./Option";

export interface Question {
  id: string;
  createdAt: string;
  options: Option["id"][];
  title: string;
}
