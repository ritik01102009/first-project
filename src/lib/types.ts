export type ThemeMode = "light" | "dark" | "system";

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
}

export interface BillPerson {
  id: string;
  name: string;
  color: string;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[];
}

export interface BillSplitSettlement {
  person: BillPerson;
  items: { item: BillItem; sharePrice: number }[];
  subtotal: number;
  tax: number;
  tip: number;
  totalOwed: number;
}
