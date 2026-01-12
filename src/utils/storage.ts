import { Todo } from "../types";

const KEY = "todos-v1";

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Todo[];
  } catch (e) {
    console.error("Failed to load todos", e);
    return [];
  }
}

export function saveTodos(todos: Todo[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(todos));
  } catch (e) {
    console.error("Failed to save todos", e);
  }
}
