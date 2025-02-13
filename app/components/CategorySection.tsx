import React from "react";

interface Task {
  title: string;
  dueDate: string;
  daysLeft: number | null;
  category: { name: string; color: string };
  priority: string;
  status: { name: string; color: string };
}

interface CategorySectionProps {
  title: string;
  tasks: Task[];
  isExpanded: boolean;
  onToggle: () => void;
  color: string;
}

export default function CategorySection({
  title,
  tasks,
  isExpanded,
  onToggle,
  color,
}: CategorySectionProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm transition-all duration-200 ${
        isExpanded ? "h-auto" : "h-[44px]"
      } overflow-hidden`}
    >
      <div
        style={{ backgroundColor: color }}
        className="p-2 cursor-pointer flex justify-between items-center"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold text-white text-center">
          {title}
        </h3>
        <svg
          className={`h-5 w-5 text-white transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      <div className="p-4 m-4 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-2">Task</th>
              <th className="text-left pb-2">Status</th>
              <th className="text-left pb-2">Priority</th>
              <th className="text-left pb-2">Due Date</th>
              <th className="text-left pb-2">Days Left</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasks.map((task, index) => (
              <tr key={index}>
                <td className="py-2">{task.title}</td>
                <td className="py-2">
                  <span
                    className="px-2 py-1 rounded-sm"
                    style={{ backgroundColor: task.status.color }}
                  >
                    {task.status.name}
                  </span>
                </td>
                <td className="py-2">{task.priority}</td>
                <td className="py-2">{task.dueDate}</td>
                <td className="py-2">{task.daysLeft}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
