import type { TodoRepository, Todo } from "@/domain/todo";

type TodoDto = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

function mapDtoToTodo(dto: TodoDto): Todo {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
  };
}

export class TodoApiRepository implements TodoRepository {
  private baseUrl = "http://localhost:8000/api/todos";

  async getAll(): Promise<Todo[]> {
    const res = await fetch(this.baseUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load todos");
    const data: TodoDto[] = await res.json();
    return data.map(mapDtoToTodo);
  }

  async create(title: string): Promise<Todo> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to create todo");
    const data: TodoDto = await res.json();
    return mapDtoToTodo(data);
  }

  async toggle(id: string): Promise<Todo> {
    const res = await fetch(`${this.baseUrl}/${id}/toggle`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to toggle todo");
    const data: TodoDto = await res.json();
    return mapDtoToTodo(data);
  }

  async remove(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete todo");
  }
}