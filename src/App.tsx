import React, { useEffect, useMemo, useRef, useState } from "react";
import { Todo } from "./types";
import { loadTodos, saveTodos } from "./utils/storage";
import {
  requestNotificationPermission,
  notify,
  getDueSoonTodos,
  getOverdueTodos,
} from "./utils/notifications";
import TodoList from "./components/TodoList";
import Filters from "./components/Filters";
import TodoModal from "./components/TodoModal";
import ConfirmModal from "./components/ConfirmModal";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    loadTodos().map((t: any) => ({
      ...t,
      description: t.description ?? t.title ?? "",
      category: t.category ?? t.tags?.[0] ?? "",
      title: t.title ?? (t.description ? t.description.slice(0, 30) : ""),
    }))
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  // keep completed items visible by default so checking marks them as done (faded + line-through)
  const [showCompleted, setShowCompleted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null);
  // track last-notified times (ms since epoch) so we can repeat overdue alerts each minute
  const notifiedRef = useRef<Record<string, number>>({});

  // notification UI + toasts + sound
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [toasts, setToasts] = useState<
    Array<{ id: string; title: string; body?: string }>
  >([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [appVisible, setAppVisible] = useState(false);

  function addToast(title: string, body?: string) {
    const id = crypto?.randomUUID?.() ?? String(Date.now());
    setToasts((s) => [...s, { id, title, body }]);
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 10000);
  }

  async function askPermission() {
    const granted = await requestNotificationPermission();
    setNotificationPermission(
      typeof Notification !== "undefined" ? Notification.permission : "default"
    );
    addToast(granted ? "Notifications enabled" : "Notifications blocked");
  }

  useEffect(() => saveTodos(todos), [todos]);

  useEffect(() => {
    // initialize permission state (do not force a browser prompt on load)
    setNotificationPermission(
      typeof Notification !== "undefined" ? Notification.permission : "default"
    );
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowWelcome(false);
      setAppVisible(true);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function checkNotifications() {
      const dueSoon = getDueSoonTodos(todos, 60);
      const overdue = getOverdueTodos(todos);
      const now = Date.now();

      // notify due-soon once (first time only)
      dueSoon.forEach((t) => {
        if (!notifiedRef.current[t.id]) {
          const title = `Due soon: ${t.description}`;
          const body = `Due at ${new Date(t.dueDate!).toLocaleString()}`;
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            const n = notify(title, { body });
            if (n) setTimeout(() => n.close(), 10000);
          }
          addToast(title, body);
          notifiedRef.current[t.id] = now;
        }
      });

      // notify overdue every minute until completed
      overdue.forEach((t) => {
        const last = notifiedRef.current[t.id] ?? 0;
        if (now - last >= 60_000) {
          const title = `Overdue: ${t.description}`;
          const body = `Was due at ${new Date(t.dueDate!).toLocaleString()}`;
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            const n = notify(title, { body });
            if (n) setTimeout(() => n.close(), 10000);
          }
          addToast(title, body);
          notifiedRef.current[t.id] = now;
        }
      });
    }

    // run immediately and then every minute
    checkNotifications();
    const id = setInterval(checkNotifications, 60_000);
    return () => clearInterval(id);
  }, [todos]);

  function addTodo(todoPartial: Partial<Todo>) {
    const todo: Todo = {
      id: crypto.randomUUID(),
      description: todoPartial.description ?? "",
      category: todoPartial.category ?? "",
      completed: false,
      dueDate: todoPartial.dueDate || undefined,
      priority: (todoPartial.priority as Todo["priority"]) || "Medium",
      createdAt: new Date().toISOString(),
    };
    setTodos((s: Todo[]) => [todo, ...s]);
  }

  function updateTodo(updated: Todo) {
    setTodos((s: Todo[]) =>
      s.map((t: Todo) => (t.id === updated.id ? updated : t))
    );
  }

  function toggleTodo(id: string) {
    setTodos((s: Todo[]) =>
      s.map((t: Todo) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }
  function deleteTodo(id: string) {
    setTodos((s: Todo[]) => s.filter((t: Todo) => t.id !== id));
  }

  const categories = useMemo(() => {
    const set = new Set<string>();
    todos.forEach((t: Todo) => {
      if (t.category) set.add(t.category);
    });
    return [...set].sort();
  }, [todos]);

  function getStatus(t: Todo) {
    if (t.completed) return "Done";
    if (!t.dueDate) return "Upcoming";
    return Date.parse(t.dueDate) < Date.now() ? "Missed" : "Upcoming";
  }

  const filtered = useMemo(() => {
    return todos.filter((t: Todo) => {
      if (!showCompleted && t.completed) return false;
      if (categoryFilter && t.category !== categoryFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !t.description.toLowerCase().includes(s) &&
          !t.category.toLowerCase().includes(s) &&
          !(t.dueDate || "").toLowerCase().includes(s) &&
          !(t.title || "").toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [todos, search, categoryFilter, showCompleted]);

  function openCreate() {
    setEditing(null);
    setIsModalOpen(true);
  }
  function openEdit(todo: Todo) {
    // only allow editing for upcoming and not completed
    if (todo.completed) return;
    if (todo.dueDate && Date.parse(todo.dueDate) < Date.now()) return;
    setEditing(todo);
    setIsModalOpen(true);
  }

  // Confirm delete modal
  const [confirmTarget, setConfirmTarget] = useState<Todo | null>(null);
  function openDeleteConfirm(todo: Todo) {
    setConfirmTarget(todo);
  }
  function handleConfirmDelete() {
    if (!confirmTarget) return;
    deleteTodo(confirmTarget.id);
    setConfirmTarget(null);
  }

  function handleSave(payload: Partial<Todo>) {
    if (editing) {
      updateTodo({ ...editing, ...payload });
    } else {
      addTodo(payload);
    }
    setIsModalOpen(false);
    setEditing(null);
  }

  if (!appVisible) {
    return (
      <div className="initial-load">
        <div
          className="welcome-overlay"
          onClick={() => {
            setShowWelcome(false);
            setAppVisible(true);
          }}
        >
          <div className="welcome-card big">
            <h2>
              Welcome Ms. Omnia <span className="emoji">😊</span>
            </h2>
            <p>How are you Today</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <main>
        <div className="top-row">
          <div className="filters-wrap">
            <Filters
              search={search}
              setSearch={setSearch}
              categories={categories}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              showCompleted={showCompleted}
              setShowCompleted={setShowCompleted}
            />
          </div>
          <div className="top-controls">
            <button className="create-btn pulse" onClick={openCreate}>
              Create Task
            </button>
          </div>
        </div>

        <TodoList
          todos={filtered}
          onToggle={toggleTodo}
          onRequestDelete={openDeleteConfirm}
          onEdit={openEdit}
          getStatus={getStatus}
        />

        <TodoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
          initial={editing}
        />

        <ConfirmModal
          isOpen={!!confirmTarget}
          title="Delete task"
          message={
            confirmTarget
              ? `Delete "${confirmTarget.description}" permanently? This cannot be undone.`
              : ""
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />

        <div className="toasts">
          {toasts.map((t) => (
            <div key={t.id} className="toast">
              <strong>{t.title}</strong>
              {t.body && <div className="toast-body">{t.body}</div>}
            </div>
          ))}
        </div>
      </main>
      <footer>
        <div className="footer-actions">
          <div className="notif-footer">
            {notificationPermission !== "granted" && (
              <button className="notif-btn" onClick={askPermission}>
                Enable Notifications
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
