import { Option } from "./Option";

export interface Question {
  id: string;
  createdAt: string;
  options: [Option];
  title: string;
}
