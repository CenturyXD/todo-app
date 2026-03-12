import type {
  CreateTodoInput,
  Todo,
  TodoId,
  TodoPriority,
  TodoRepository,
} from "@/domain/todo";

const ALLOWED_PRIORITIES: TodoPriority[] = ["Low", "Medium", "High"];

export class TodoUseCases {
  constructor(private readonly repo: TodoRepository) { }

  async listTodos(): Promise<Todo[]> {
    return this.repo.getAll();
  }

  async addTodo(input: CreateTodoInput): Promise<Todo> {
    const trimmed = input.title.trim();

    if (!trimmed) {
      throw new Error("Title is required");
    }

    const priority = input.priority ?? "Medium";
    if (!ALLOWED_PRIORITIES.includes(priority)) {
      throw new Error("Priority is invalid");
    }

    return this.repo.create({
      title: trimmed,
      priority,
    });
  }

  async toggleTodo(id: TodoId): Promise<Todo> {
    return this.repo.toggle(id);
  }

  async deleteTodo(id: TodoId): Promise<void> {
    return this.repo.remove(id);
  }
}