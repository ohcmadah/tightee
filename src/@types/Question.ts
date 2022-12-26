export interface Question {
  id: string;
  createdAt: string;
  options: { [id: string]: string };
  title: string;
}
