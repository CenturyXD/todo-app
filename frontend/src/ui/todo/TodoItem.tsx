"use client";

import type { Todo } from "@/domain/todo";

type Props = {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
};

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={todo.completed} onChange={onToggle} />
        <span
          className={
            todo.completed
              ? "text-zinc-400 line-through"
              : "text-zinc-900 dark:text-zinc-50"
          }
        >
          {todo.title}
        </span>
      </label>
      <button
        onClick={onDelete}
        className="text-xs text-red-500 hover:text-red-600"
      >
        ลบ
      </button>
    </li>
  );
}