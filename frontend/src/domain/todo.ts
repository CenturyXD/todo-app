export type TodoId = number;

export type TodoPriority = "Low" | "Medium" | "High";

export interface Todo {
  id: TodoId;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  priority?: TodoPriority;
}

export interface TodoRepository {
  getAll(): Promise<Todo[]>;
  create(input: CreateTodoInput): Promise<Todo>;
  toggle(id: TodoId): Promise<Todo>;
  remove(id: TodoId): Promise<void>;
}