"use client";

import { useEffect, useState } from "react";
import type { Todo } from "@/domain/todo";
import { TodoService } from "@/application/todo/usecases";
import { TodoApiRepository } from "@/infrastructure/todo/todoApiRepository";

const service = new TodoService(new TodoApiRepository());

export function useTodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // โหลดครั้งแรก
  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);
        setError(null);
        const data = await service.listTodos();
        setTodos(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  // เพิ่ม todo ใหม่
  // แก้ไข: รับ parameter (payload) เข้ามา
  const handleAdd = async (payload?: { title: string; label?: string; priority?: string }) => {
    // ถ้ามี payload ให้ใช้ title จาก payload, ถ้าไม่มีให้ใช้จาก state title เดิม
    const textToSave = payload?.title ?? title;
    const trimmed = textToSave.trim();

    if (!trimmed) {
      return; 
    }

    try {
      setLoading(true);
      setError(null);
      
      // ส่งค่าไปที่ Service
      // หมายเหตุ: ตรงนี้ต้องตรวจสอบว่า service.addTodo ของคุณรองรับ Label/Priority หรือยัง
      // ถ้า service ยังรับแค่ string ก็ส่งแค่ trimmed ไปก่อนเพื่อให้บันทึกได้
      const newTodo = await service.addTodo(trimmed);
      
      // ถ้า service รองรับ object แล้ว ให้เปลี่ยนเป็น:
      // const newTodo = await service.addTodo({ 
      //    title: trimmed, 
      //    label: payload?.label, 
      //    priority: payload?.priority 
      // });

      setTodos((prev) => [newTodo, ...prev]);
      setTitle(""); // ล้างค่า state เผื่อไว้
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // toggle completed
  const handleToggle = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await service.toggleTodo(id);
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ลบ todo
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await service.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    todos,
    title,
    setTitle,
    loading,
    initialLoading,
    error,
    handleAdd,
    handleToggle,
    handleDelete,
  };
}