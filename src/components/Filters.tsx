import React from "react";

interface Props {
  search: string;
  setSearch: (s: string) => void;
  categories: string[];
  categoryFilter: string;
  setCategoryFilter: (t: string) => void;
  showCompleted: boolean;
  setShowCompleted: (b: boolean) => void;
}

export default function Filters({
  search,
  setSearch,
  categories,
  categoryFilter,
  setCategoryFilter,
  showCompleted,
  setShowCompleted,
}: Props) {
  return (
    <div className="filters">
      <input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <label>
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(e) => setShowCompleted(e.target.checked)}
        />{" "}
        Show completed
      </label>
    </div>
  );
}
