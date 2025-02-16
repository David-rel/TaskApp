"use client";

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import StatusLists from "./components/StatusLists";
import CategoryLists from "./components/CategoryLists";
import CreateCategoryModal from "./components/CreateCategoryModal";
import CreateStatusModal from "./components/CreateStatusModal";
import CreateTaskModal from "./components/CreateTaskModal";
import CreatePriorityModal from "./components/CreatePriorityModal";
import { Task } from "./types/task";
import PriorityLists from "./components/PriorityLists";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface Category {
  id: number;
  name: string;
  color: string;
}

interface Status {
  id: number;
  name: string;
  color: string;
}

interface Priority {
  id: number;
  name: string;
  color: string;
}

function hexToRGBA(hex: string, alpha: number = 1): string {
  // Remove the hash if it exists
  hex = hex.replace("#", "");

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksByPriority, setTasksByPriority] = useState<
    Record<string, number>
  >({});
  const [tasksByCategory, setTasksByCategory] = useState<
    Record<string, number>
  >({});
  const [groupedTasks, setGroupedTasks] = useState<Record<string, any[]>>({});
  const [currentView, setCurrentView] = useState<
    "priority" | "category" | "status"
  >("priority");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [priorities, setPriorities] = useState<Priority[]>([]);

  async function fetchData() {
    try {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      console.log(data);
      setTasks(data.tasks);
      setPriorities(data.priorities);
      setCategories(data.categories);
      setStatuses(data.statuses);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate derived state when tasks change
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Calculate tasks by status instead of priority
      const byStatus = tasks.reduce((acc, task) => {
        const status = task.status?.name || "No Status";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      setTasksByPriority(byStatus);

      // Calculate tasks by category
      const byCategory = tasks.reduce((acc, task) => {
        const categoryName = task.category?.name || "Uncategorized";
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      setTasksByCategory(byCategory);

      // Group tasks by status
      const grouped = tasks.reduce((acc, task) => {
        const status = task.status?.name || "No Status";
        if (!acc[status]) acc[status] = [];
        acc[status].push({
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
          category: task.category?.name || "Uncategorized",
          status: task.status?.name || "No status",
        });
        return acc;
      }, {} as Record<string, any[]>);
      setGroupedTasks(grouped);
    } else {
      // Initialize empty states when no tasks
      setTasksByPriority({});
      setTasksByCategory({});
      setGroupedTasks({});
    }
  }, [tasks]);

  const handleCreateCategory = async (data: {
    name: string;
    color: string;
  }) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        // Refresh the dashboard data
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleCreateStatus = async (data: { name: string; color: string }) => {
    try {
      const response = await fetch("/api/statuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        // Refresh the dashboard data
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create status:", error);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        // Refresh the dashboard data
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleCreatePriority = async (data: {
    name: string;
    color: string;
  }) => {
    try {
      const response = await fetch("/api/priorities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create priority:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-yellow-50 p-6">Loading...</div>;
  }

  // Chart data using actual status colors with RGBA conversion
  const priorityData = {
    labels: Object.keys(tasksByPriority),
    datasets: [
      {
        label: "Tasks by Status",
        data: Object.values(tasksByPriority),
        backgroundColor: Object.keys(tasksByPriority).map((statusName) => {
          const status = statuses.find((s) => s.name === statusName);
          return status ? hexToRGBA(status.color) : "rgba(209, 213, 219, 0.7)";
        }),
        borderWidth: 0,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(tasksByCategory),
    datasets: [
      {
        label: "Tasks by Category",
        data: Object.values(tasksByCategory),
        backgroundColor: Object.keys(tasksByCategory).map((categoryName) => {
          const category = categories?.find((c) => c.name === categoryName);
          return category
            ? hexToRGBA(category.color)
            : "rgba(209, 213, 219, 0.7)";
        }),
        borderWidth: 0,
      },
    ],
  };

  // Flatten tasks for category view
  const allTasks =
    tasks?.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      valueAdded: task.valueAdded,
      category: {
        name: task.category.name,
        color: task.category.color,
      },
      status: {
        name: task.status.name,
        color: task.status.color,
      },
      priority: {
        name: task.priority.name,
        color: task.priority.color,
      },
      daysLeft: task.dueDate
        ? Math.ceil(
            (new Date(task.dueDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null,
    })) || [];

  return (
    <main className="min-h-screen bg-yellow-50 p-6 space-y-6">
      {/* Add buttons at the top */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Category
        </button>
        <button
          onClick={() => setIsStatusModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          New Status
        </button>
        <button
          onClick={() => setIsPriorityModalOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          New Priority
        </button>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={!categories.length || !statuses.length}
          title={
            !categories.length || !statuses.length
              ? "Please create at least one category and status first"
              : ""
          }
        >
          New Task
        </button>
      </div>

      {/* Add modals */}
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
      <CreateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmit={handleCreateStatus}
      />
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        categories={categories}
        statuses={statuses}
        priorities={priorities}
      />
      <CreatePriorityModal
        isOpen={isPriorityModalOpen}
        onClose={() => setIsPriorityModalOpen(false)}
        onSubmit={handleCreatePriority}
      />

      {/* Dashboard Grid */}
      <div className="bg-yellow-50 rounded-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* 1. Status Overview */}
          <div className="p-4 bg-yellow-50">
            <h2 className="text-lg font-semibold mb-4 text-center bg-teal-300 p-2 rounded-sm">
              Overview
            </h2>
            <ul className="text-sm space-y-3">
              {Object.entries(tasksByPriority).map(([statusName, count]) => {
                const status = statuses.find((s) => s.name === statusName);
                return (
                  <li
                    key={statusName}
                    className="flex justify-between items-center"
                  >
                    <span
                      className="font-medium p-2 rounded-sm w-full text-center"
                      style={{
                        backgroundColor: status
                          ? hexToRGBA(status.color)
                          : "rgba(209, 213, 219, 0.7)",
                      }}
                    >
                      {statusName}
                    </span>
                    <span className="font-bold ml-4">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 2. Pie Chart */}
          <div className="p-6 border-gray-200">
            <div className="w-full h-[250px]">
              <Pie
                data={priorityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 5,
                        font: {
                          size: 10,
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* 3. Category Overview - Dynamic categories */}
          <div className="p-6 border-gray-200">
            <ul className="text-sm space-y-3">
              <li className="flex justify-between items-center font-medium pb-8">
                <span className="bg-red-400 p-2 rounded-sm w-full text-center">
                  Total Tasks
                </span>
                <span className="font-bold ml-4">{tasks?.length || 0}</span>
              </li>
              {Object.entries(tasksByCategory).map(([category, count]) => {
                const categoryData = categories?.find(
                  (c) => c.name === category
                );
                return (
                  <li
                    key={category}
                    className="flex justify-between items-center"
                  >
                    <span
                      className="p-2 rounded-sm w-full text-center"
                      style={{
                        backgroundColor: categoryData?.color
                          ? hexToRGBA(categoryData.color)
                          : "rgba(209, 213, 219, 0.7)",
                      }}
                    >
                      {category} Tasks
                    </span>
                    <span className="font-bold ml-4">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 4. Bar Chart */}
          <div className="p-6 border-gray-200">
            <div className="w-full h-[250px]">
              <Bar
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        font: {
                          size: 10,
                        },
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        font: {
                          size: 10,
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced View Selector */}
      <div className="flex items-center space-x-4 py-4 px-2 border-b border-gray-200 relative z-0">
        <label className="text-gray-700 font-medium">View Tasks By:</label>
        <div className="relative">
          <select
            value={currentView}
            onChange={(e) =>
              setCurrentView(
                e.target.value as "priority" | "category" | "status"
              )
            }
            className="appearance-none bg-yellow-50 border border-gray-300 rounded-md px-4 py-2 pr-8 
                       hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black 
                       focus:border-black text-gray-700 font-medium cursor-pointer relative z-0"
          >
            <option value="status">Status Overview</option>
            <option value="category">Category Overview</option>
            <option value="priority">Priority Overview</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-500"
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
        </div>
      </div>

      {/* Task Lists */}
      {currentView === "priority" ? (
        <PriorityLists tasks={allTasks} priorities={priorities} />
      ) : currentView === "category" ? (
        <CategoryLists tasks={allTasks} categories={categories} />
      ) : (
        <StatusLists tasks={tasks} statuses={statuses} />
      )}
    </main>
  );
}
