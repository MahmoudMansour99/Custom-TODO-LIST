import React from "react";
import { Todo } from "../types";
import TodoItem from "./TodoItem";

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onRequestDelete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  getStatus: (t: Todo) => string;
}

export default function TodoList({
  todos,
  onToggle,
  onRequestDelete,
  onEdit,
  getStatus,
}: Props) {
  if (!todos.length) return <div className="empty">No tasks</div>;
  return (
    <div className="todo-wrap">
      <table className="todo-table">
        <thead>
          <tr>
            <th></th>
            <th>Category</th>
            <th>Description</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={onToggle}
              onRequestDelete={onRequestDelete}
              onEdit={onEdit}
              getStatus={getStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
