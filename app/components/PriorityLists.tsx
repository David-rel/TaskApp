import React, { useState } from "react";
import PrioritySection from "./PrioritySection";

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  valueAdded?: string | null;
  category: {
    name: string;
    color: string;
  };
  status: {
    name: string;
    color: string;
  };
  priority: {
    name: string;
    color: string;
  };
  daysLeft?: number | null;
}

interface PriorityListsProps {
  tasks: Task[];
  priorities: { id: number; name: string; color: string }[];
}

export default function PriorityLists({
  tasks,
  priorities,
}: PriorityListsProps) {
  // Initialize expanded sections based on priority names
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(
    priorities.reduce((acc, priority) => {
      acc[priority.name] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Create sections dynamically from priorities
  const sections = priorities.map((priority) => ({
    id: priority.name,
    title: `${priority.name} Priority`,
    color: priority.color,
    tasks: tasks
      .filter((task) => task.priority.name === priority.name)
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
        <PrioritySection
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
