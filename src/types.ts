export type Priority = "Low" | "Medium" | "High";

export interface Todo {
  id: string;
  title?: string;
  description: string;
  category: string;
  completed: boolean;
  dueDate?: string; // ISO string
  priority: Priority;
  createdAt: string;
}
