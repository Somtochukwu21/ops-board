"use client";

import type { IProduct } from "@/hooks/use-products";

export function StatsBar({ products }: { products: IProduct[] }) {
  const stats = {
    total: products.length,
    pending: products.filter((p) => p.status === "pending").length,
    delivered: products.filter((p) => p.status === "delivered").length,
    returned: products.filter((p) => p.status === "returned").length,
    failed: products.filter((p) => p.status === "failed").length,
    totalSpent: products.reduce((sum, p) => sum + p.purchasePrice, 0),
    totalRevenue: products
      .filter((p) => p.status === "delivered")
      .reduce((sum, p) => sum + p.price, 0),
  };

  return (
    <div className="grid gap-4 md:grid-cols-6">
      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_10px_50px_rgba(0,0,0,0.1)]">
        <p className="text-sm text-muted-foreground">Total Products</p>
        <p className="mt-2 text-2xl font-bold">{stats.total}</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_10px_50px_rgba(0,0,0,0.1)]">
        <p className="text-sm text-muted-foreground">Pending</p>
        <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {stats.pending}
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_10px_50px_rgba(0,0,0,0.1)]">
        <p className="text-sm text-muted-foreground">Delivered</p>
        <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
          {stats.delivered}
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_10px_50px_rgba(0,0,0,0.1)]">
        <p className="text-sm text-muted-foreground">Returned</p>
        <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
          {stats.returned}
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_10px_50px_rgba(0,0,0,0.1)]">
        <p className="text-sm text-muted-foreground">Failed</p>
        <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
          {stats.failed}
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_10px_50px_rgba(0,0,0,0.1)]">
        <p className="text-sm text-muted-foreground">Total Spent</p>
        <p className="mt-2 text-2xl font-bold">
          ${stats.totalSpent.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
