export interface Question {
  createdAt: number;
  options: [{ id: string }];
  title: string;
}
