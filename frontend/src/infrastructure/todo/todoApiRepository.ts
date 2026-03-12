import type {
  CreateTodoInput,
  Todo,
  TodoPriority,
  TodoRepository,
} from "@/domain/todo";

type TodoDto = {
  id: number;
  title: string;
  completed: boolean;
  priority?: TodoPriority;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
};

type ErrorDto = {
  message?: string;
  error?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function parseDate(value?: string): Date {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function extractErrorMessage(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as ErrorDto;
    return body.message ?? body.error ?? fallback;
  } catch {
    return fallback;
  }
}

function mapDtoToTodo(dto: TodoDto): Todo {
  const createdAt = dto.createdAt ?? dto.created_at;
  const updatedAt = dto.updatedAt ?? dto.updated_at;

  return {
    id: dto.id,
    title: dto.title,
    completed: dto.completed,
    priority: dto.priority ?? "Medium",
    createdAt: parseDate(createdAt),
    updatedAt: parseDate(updatedAt),
  };
}

export class TodoApiRepository implements TodoRepository {
  private readonly baseUrl = `${API_BASE_URL}/api/todos`;

  async getAll(): Promise<Todo[]> {
    const res = await fetch(this.baseUrl, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(await extractErrorMessage(res, "Failed to load todos"));
    }

    const data: TodoDto[] = await res.json();
    return data.map(mapDtoToTodo);
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(await extractErrorMessage(res, "Failed to create todo"));
    }

    const data: TodoDto = await res.json();
    return mapDtoToTodo(data);
  }

  async toggle(id: number): Promise<Todo> {
    const res = await fetch(`${this.baseUrl}/${id}/toggle`, {
      method: "PATCH",
    });
    if (!res.ok) {
      throw new Error(await extractErrorMessage(res, "Failed to toggle todo"));
    }

    const data: TodoDto = await res.json();
    return mapDtoToTodo(data);
  }

  async remove(id: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(await extractErrorMessage(res, "Failed to delete todo"));
    }
  }
}