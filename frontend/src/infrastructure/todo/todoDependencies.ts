import { TodoUseCases } from "@/application/todo/usecases";
import { TodoApiRepository } from "@/infrastructure/todo/todoApiRepository";

export function createTodoUseCases() {
    return new TodoUseCases(new TodoApiRepository());
}
