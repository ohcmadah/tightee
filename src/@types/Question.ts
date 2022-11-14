import { Option } from "./Option";

export interface Question {
  createdAt: number;
  options: [Option];
  title: string;
}
