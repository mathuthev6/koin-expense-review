import React, { createContext, useContext, useState } from "react";

import type { Expense } from "../types/expense";

type ExpensesContextType = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
};

const initialExpenses: Expense[] = [
  {
    id: "1",
    merchant: "Cafe Kumbuk",
    date: "Today, 10:42 AM",
    category: "Food & Dining",
    items: [],
    totalCents: 2850,
    createdAt: "Today, 10:42 AM",
  },
  {
    id: "2",
    merchant: "Keells Super",
    date: "Yesterday, 6:18 PM",
    category: "Groceries",
    items: [],
    totalCents: 6420,
    createdAt: "Yesterday, 6:18 PM",
  },
  {
    id: "3",
    merchant: "Uber",
    date: "Nov 22, 2026",
    category: "Transport",
    items: [],
    totalCents: 1280,
    createdAt: "Nov 22, 2026",
  },
  {
    id: "4",
    merchant: "The Good Market",
    date: "Nov 21, 2026",
    category: "Shopping",
    items: [],
    totalCents: 3500,
    createdAt: "Nov 21, 2026",
  },
];

const ExpensesContext = createContext<ExpensesContextType | undefined>(
  undefined,
);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const addExpense = (expense: Expense) => {
    setExpenses((previous) => [expense, ...previous]);
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        addExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);

  if (!context) {
    throw new Error("useExpenses must be used inside ExpensesProvider");
  }

  return context;
}
