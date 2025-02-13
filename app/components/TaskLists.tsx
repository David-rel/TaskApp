import React, { useState } from "react";
import TaskSection from "./TaskSection";
import { Task } from "@/app/types/task";

interface TaskListsProps {
  tasks: Task[]; // Changed from Record<string, Task[]> to Task[]
  statuses: { id: number; name: string; color: string }[];
}

export default function TaskLists({ tasks, statuses }: TaskListsProps) {
  // Initialize expanded sections based on status names
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(
    statuses.reduce((acc, status) => {
      acc[status.name] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Group tasks by status
  const sections = statuses.map((status) => ({
    id: status.name,
    title: `${status.name} Tasks`,
    color: status.color,
    tasks: tasks
      .filter((task) => task.status?.name === status.name)
      .map((task) => ({
        ...task,
        daysLeft: task.dueDate
          ? Math.ceil(
              (new Date(task.dueDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null,
      })),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 p-2">
      {sections.map((section) => (
        <TaskSection
          key={section.id}
          title={section.title}
          tasks={section.tasks}
          isExpanded={expandedSections[section.id] ?? true}
          onToggle={() => toggleSection(section.id)}
          color={section.color}
        />
      ))}
    </div>
  );
}
