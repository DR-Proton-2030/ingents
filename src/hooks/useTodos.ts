"use client";
import { useCallback, useState } from "react";
import { api } from "@/utils/api";
import { Todo } from "@/utils/api/todo/todo.api";

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const response = await api.todo.getTodos(date);
      setTodos(response.data || []);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateTodo = useCallback(async (text: string, date: string) => {
    try {
      const response = await api.todo.createTodo({ text, date });
      setTodos((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Failed to create todo:", error);
      throw error;
    }
  }, []);

  const handleToggleTodo = useCallback(async (todoId: string, completed: boolean) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t._id === todoId ? { ...t, completed } : t))
    );
    try {
      await api.todo.updateTodo({ todoId, completed });
    } catch (error) {
      // Revert on failure
      setTodos((prev) =>
        prev.map((t) => (t._id === todoId ? { ...t, completed: !completed } : t))
      );
      console.error("Failed to toggle todo:", error);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: string) => {
    const prev = todos;
    setTodos((t) => t.filter((item) => item._id !== todoId));
    try {
      await api.todo.deleteTodo(todoId);
    } catch (error) {
      setTodos(prev);
      console.error("Failed to delete todo:", error);
    }
  }, [todos]);

  return { todos, loading, fetchTodos, handleCreateTodo, handleToggleTodo, handleDeleteTodo };
};

export default useTodos;
