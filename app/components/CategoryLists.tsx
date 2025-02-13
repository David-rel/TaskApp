import React, { useState } from "react";
import CategorySection from "./CategorySection";

interface Task {
  title: string;
  dueDate: string;
  daysLeft: number | null;
  category: { name: string; color: string };
  priority: string;
  status: { name: string; color: string };
}

interface CategoryListsProps {
  tasks: Task[];
  categories: { id: number; name: string; color: string }[];
}

export default function CategoryLists({
  tasks,
  categories,
}: CategoryListsProps) {
  // Initialize expanded sections based on category names
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(
    categories.reduce((acc, category) => {
      acc[category.name] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Create sections dynamically from categories
  const sections = categories.map((category) => ({
    id: category.name,
    title: `${category.name} Tasks`,
    color: category.color,
    tasks: tasks
      .filter((task) => task.category.name === category.name)
      .map((task) => ({
        title: task.title,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "No due date",
        daysLeft: task.dueDate
          ? Math.ceil(
              (new Date(task.dueDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null,
        category: task.category,
        priority: task.priority,
        status: task.status,
      })),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 p-2">
      {sections.map((section) => (
        <CategorySection
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
