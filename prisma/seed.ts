const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Helper function to get random item from array
const getRandomItem = (array: string | any[]) =>
  array[Math.floor(Math.random() * array.length)];

// Helper function to get random date in the next 30 days
const getRandomFutureDate = () => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
  return futureDate;
};

interface TaskTemplate {
  title: string;
  description: string;
}

interface TaskTemplates {
  [key: string]: TaskTemplate[];
}

async function main() {
  // First, delete all existing data
  await prisma.task.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.status.deleteMany({});
  await prisma.priority.deleteMany({});

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Work",
        color: "#FF4444",
      },
    }),
    prisma.category.create({
      data: {
        name: "Personal",
        color: "#4CAF50",
      },
    }),
    prisma.category.create({
      data: {
        name: "Shopping",
        color: "#2196F3",
      },
    }),
  ]);

  // Create Statuses
  const statuses = await Promise.all([
    prisma.status.create({
      data: {
        name: "To Do",
        color: "#FFA726",
      },
    }),
    prisma.status.create({
      data: {
        name: "In Progress",
        color: "#42A5F5",
      },
    }),
    prisma.status.create({
      data: {
        name: "Done",
        color: "#66BB6A",
      },
    }),
  ]);

  // Create Priorities
  const priorities = await Promise.all([
    prisma.priority.create({
      data: {
        name: "High",
        color: "#FF4444",
      },
    }),
    prisma.priority.create({
      data: {
        name: "Medium",
        color: "#FFA726",
      },
    }),
    prisma.priority.create({
      data: {
        name: "Low",
        color: "#66BB6A",
      },
    }),
  ]);

  // Task templates for each category
  const taskTemplates: TaskTemplates = {
    Work: [
      {
        title: "Weekly Team Meeting",
        description: "Regular sync with the development team",
      },
      {
        title: "Project Review",
        description: "Review progress and deliverables",
      },
      {
        title: "Client Presentation",
        description: "Prepare and deliver client presentation",
      },
      {
        title: "Code Review",
        description: "Review pull requests and provide feedback",
      },
      {
        title: "Documentation Update",
        description: "Update technical documentation",
      },
      {
        title: "Sprint Planning",
        description: "Plan next sprint tasks and objectives",
      },
      {
        title: "Performance Review",
        description: "Quarterly performance evaluation",
      },
      {
        title: "Budget Analysis",
        description: "Review and analyze department budget",
      },
      {
        title: "Training Session",
        description: "Conduct team training on new technologies",
      },
      {
        title: "Stakeholder Meeting",
        description: "Update stakeholders on project progress",
      },
    ],
    Personal: [
      { title: "Gym Workout", description: "Regular fitness routine" },
      { title: "Doctor Appointment", description: "Annual health checkup" },
      { title: "Read Book", description: "Continue reading current book" },
      { title: "Family Dinner", description: "Weekly family dinner" },
      { title: "House Cleaning", description: "Deep clean house" },
      { title: "Pay Bills", description: "Monthly bill payments" },
      { title: "Car Maintenance", description: "Regular car service" },
      { title: "Meditation", description: "Daily meditation practice" },
      {
        title: "Language Practice",
        description: "Practice new language skills",
      },
      { title: "Garden Maintenance", description: "Weekly garden care" },
    ],
    Shopping: [
      { title: "Grocery Shopping", description: "Weekly grocery run" },
      { title: "Office Supplies", description: "Restock office supplies" },
      { title: "Gift Shopping", description: "Buy birthday gifts" },
      { title: "Electronics", description: "Research and buy new laptop" },
      { title: "Clothing", description: "Season wardrobe update" },
      { title: "Home Decor", description: "Buy new home decorations" },
      { title: "Kitchen Supplies", description: "Restock kitchen essentials" },
      { title: "Pet Supplies", description: "Buy pet food and supplies" },
      { title: "Books", description: "Purchase books from reading list" },
      {
        title: "Household Items",
        description: "Stock up on household essentials",
      },
    ],
  };

  const valueAddedOptions = [
    "Critical for business operations",
    "Improves team productivity",
    "Enhances customer satisfaction",
    "Cost saving initiative",
    "Quality improvement",
    null,
  ];

  // Create 50 random tasks
  const taskPromises = Array.from({ length: 50 }, async () => {
    const category = getRandomItem(categories);
    const templates = taskTemplates[category.name];
    const template = getRandomItem(templates);

    return prisma.task.create({
      data: {
        title: template.title,
        description: template.description,
        dueDate: getRandomFutureDate(),
        priorityId: getRandomItem(priorities).id,
        statusId: getRandomItem(statuses).id,
        valueAdded: getRandomItem(valueAddedOptions),
        categoryId: category.id,
      },
    });
  });

  await Promise.all(taskPromises);

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
