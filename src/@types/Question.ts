import { Option } from "./Option";

export interface Question {
  id: string;
  createdAt: number;
  options: [Option];
  title: string;
}
