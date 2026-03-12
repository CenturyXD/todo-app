import type { TodoRepository, Todo } from "@/domain/todo";

export class TodoService {
  constructor(private readonly repo: TodoRepository) {}

  async listTodos(): Promise<Todo[]> {
    return this.repo.getAll();
  }

  async addTodo(title: string): Promise<Todo> {
    const trimmed = title.trim();
    if (!trimmed) {
      throw new Error("Title is required");
    }
    return this.repo.create(trimmed);
  }

  async toggleTodo(id: string): Promise<Todo> {
    return this.repo.toggle(id);
  }

  async deleteTodo(id: string): Promise<void> {
    return this.repo.remove(id);
  }
}