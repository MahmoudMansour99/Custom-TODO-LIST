import React from "react";
import { Todo } from "../types";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onRequestDelete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  getStatus: (t: Todo) => string;
}

export default function TodoItem({
  todo,
  onToggle,
  onRequestDelete,
  onEdit,
  getStatus,
}: Props) {
  const dueLabel = todo.dueDate ? new Date(todo.dueDate).toLocaleString() : "—";
  const status = getStatus(todo);
  const canEdit = !todo.completed && status === "Upcoming";

  return (
    <tr className={todo.completed ? "completed" : ""}>
      <td>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </td>
      <td>{todo.category || "—"}</td>
      <td>{todo.description}</td>
      <td>{dueLabel}</td>
      <td>
        <span className={`status ${status === "Missed" ? "missed" : ""}`}>
          {status}
        </span>
      </td>
      <td>
        <button
          className="edit"
          disabled={!canEdit}
          onClick={() => onEdit(todo)}
        >
          Edit
        </button>
        <button className="delete" onClick={() => onRequestDelete(todo)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
