import React, { useEffect, useState } from "react";
import { Todo } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Todo>) => void;
  initial?: Todo | null;
}

export default function TodoModal({ isOpen, onClose, onSave, initial }: Props) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");

  useEffect(() => {
    if (initial) {
      setCategory(initial.category || "");
      setDescription(initial.description || "");
      setDueDate(initial.dueDate || undefined);
      setPriority(initial.priority || "Medium");
    } else {
      setCategory("");
      setDescription("");
      setDueDate(undefined);
      setPriority("Medium");
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    onSave({
      category: category.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      priority,
    });
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{initial ? "Edit Task" : "Create Task"}</h3>
        <form onSubmit={submit} className="modal-form">
          <label>
            Category
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </label>
          <label>
            Time
            <input
              type="datetime-local"
              value={dueDate ?? ""}
              onChange={(e) => setDueDate(e.target.value || undefined)}
            />
          </label>
          <label>
            Priority
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{initial ? "Save" : "Add to List"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
