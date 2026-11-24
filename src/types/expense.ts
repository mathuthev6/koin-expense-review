export type ExpenseItem = {
  id: string;
  name: string;
  price: string;
};

export type Expense = {
  id: string;
  merchant: string;
  date: string;
  category: string;
  items: ExpenseItem[];
  totalCents: number;
  createdAt: string;
};
