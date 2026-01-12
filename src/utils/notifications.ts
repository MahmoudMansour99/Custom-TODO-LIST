import { Todo } from "../types";

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const p = await Notification.requestPermission();
  return p === "granted";
}

export function notify(
  title: string,
  options?: NotificationOptions
): Notification | undefined {
  if (!("Notification" in window)) return undefined;
  if (Notification.permission === "granted") {
    try {
      return new Notification(title, options);
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
}

export function getDueSoonTodos(todos: Todo[], withinMinutes = 60) {
  const now = Date.now();
  const cutoff = now + withinMinutes * 60_000;
  return todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const due = Date.parse(t.dueDate);
    return due >= now && due <= cutoff;
  });
}

export function getOverdueTodos(todos: Todo[]) {
  const now = Date.now();
  return todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const due = Date.parse(t.dueDate);
    return due < now;
  });
}
