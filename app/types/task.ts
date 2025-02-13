export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  valueAdded: string | null;
  category: { name: string; color: string };
  status: { name: string; color: string };
  daysLeft?: number; // Made optional since it's calculated
}
