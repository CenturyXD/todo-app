export type TodoId = string;

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority?: "Low" | "Medium" | "High";
  label?: string;
}

export interface TodoRepository {
  getAll(): Promise<Todo[]>;
  create(title: string): Promise<Todo>;
  toggle(id: TodoId): Promise<Todo>;
  remove(id: TodoId): Promise<void>;
}