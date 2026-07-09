import { describe, expect, it } from "vitest";
import type { Group } from "./types";
import {
  computeBalances,
  computeSettlements,
  formatCurrency,
  getCurrencySymbol,
  getMemberById,
  getTotalExpenses,
} from "./utils";

const group: Group = {
  id: "group-1",
  name: "Trip",
  adminId: "alice",
  createdAt: "2026-01-01T00:00:00.000Z",
  currency: "PHP",
  members: [
    { id: "alice", uid: "alice", name: "Alice", color: "#111111" },
    { id: "bob", uid: "bob", name: "Bob", color: "#222222" },
    { id: "carol", uid: "carol", name: "Carol", color: "#333333" },
  ],
  expenses: [
    {
      id: "expense-1",
      description: "Dinner",
      amount: 90,
      paidBy: "alice",
      createdBy: "alice",
      splitType: "equal",
      category: "food",
      date: "2026-01-02T00:00:00.000Z",
      splits: [
        { memberId: "alice", amount: 30 },
        { memberId: "bob", amount: 30 },
        { memberId: "carol", amount: 30 },
      ],
    },
    {
      id: "expense-2",
      description: "Taxi",
      amount: 60,
      paidBy: "bob",
      createdBy: "bob",
      splitType: "equal",
      category: "transport",
      date: "2026-01-03T00:00:00.000Z",
      splits: [
        { memberId: "alice", amount: 20, paymentStatus: "confirmed" },
        { memberId: "bob", amount: 20 },
        { memberId: "carol", amount: 20, paymentStatus: "pending" },
      ],
    },
  ],
};

describe("expense business logic", () => {
  it("computes balances and excludes confirmed repayments from outstanding debt", () => {
    expect(computeBalances(group)).toEqual([
      { memberId: "alice", memberName: "Alice", net: 60 },
      { memberId: "bob", memberName: "Bob", net: -10 },
      { memberId: "carol", memberName: "Carol", net: -50 },
    ]);
  });

  it("computes settlements from debtor and creditor balances", () => {
    expect(
      computeSettlements([
        { memberId: "alice", memberName: "Alice", net: 60 },
        { memberId: "bob", memberName: "Bob", net: -10 },
        { memberId: "carol", memberName: "Carol", net: -50 },
      ]),
    ).toEqual([
      {
        from: "bob",
        fromName: "Bob",
        to: "alice",
        toName: "Alice",
        amount: 10,
      },
      {
        from: "carol",
        fromName: "Carol",
        to: "alice",
        toName: "Alice",
        amount: 50,
      },
    ]);
  });

  it("rounds settlement amounts to currency precision", () => {
    expect(
      computeSettlements([
        { memberId: "alice", memberName: "Alice", net: 10.005 },
        { memberId: "bob", memberName: "Bob", net: -10.005 },
      ]),
    ).toEqual([
      {
        from: "bob",
        fromName: "Bob",
        to: "alice",
        toName: "Alice",
        amount: 10.01,
      },
    ]);
  });

  it("formats currency and falls back to the currency code when Intl rejects it", () => {
    expect(formatCurrency(1234.5, "USD")).toBe("$1,234.50");
    expect(getCurrencySymbol("INVALID")).toBe("INVALID");
  });

  it("finds members and totals expenses", () => {
    expect(getMemberById(group, "bob")?.name).toBe("Bob");
    expect(getMemberById(group, "missing")).toBeUndefined();
    expect(getTotalExpenses(group)).toBe(150);
  });
});
