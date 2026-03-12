"use client";

import { useEffect, useState } from "react";
import type { CreateTodoInput, Todo, TodoId } from "@/domain/todo";
import { createTodoUseCases } from "@/infrastructure/todo/todoDependencies";

const useCases = createTodoUseCases();

export function useTodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);
        setError(null);
        const data = await useCases.listTodos();
        setTodos(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (input: CreateTodoInput) => {
    if (!input.title.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newTodo = await useCases.addTodo(input);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: TodoId) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await useCases.toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: TodoId) => {
    try {
      setLoading(true);
      setError(null);
      await useCases.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    todos,
    loading,
    initialLoading,
    error,
    handleAdd,
    handleToggle,
    handleDelete,
  };
}