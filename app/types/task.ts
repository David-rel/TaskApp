export interface Task {
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
  categoryId: number;
  statusId: number;
  priorityId: number;
  createdAt: string;
  updatedAt: string;
}
