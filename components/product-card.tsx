"use client";

import type { IProduct } from "@/hooks/use-products";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { EditModal } from "./edit-modal";

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  delivered:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  returned: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function ProductCard({ product }: { product: IProduct }) {
  const { deleteProduct, updateProduct, markAsSold } = useProducts();
  const [showEdit, setShowEdit] = useState(false);

  const createdDate = new Date(product.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const profit = product.price - product.purchasePrice;

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_10px_50px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{createdDate}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[product.status]}`}
          >
            {product.status}
          </span>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Purchase Price
            </span>
            <span className="font-semibold">
              ${product.purchasePrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Selling Price</span>
            <span className="font-semibold">${product.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Profit</span>
            <span
              className={`font-semibold ${profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              ${profit.toFixed(2)}
            </span>
          </div>
          {product.quantity && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <span className="font-semibold">{product.quantity}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEdit(true)}
            className="flex-1"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteProduct(product.id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          {(product.status === "failed" || product.status === "returned") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAsSold(product.id)}
              className="flex-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              Sold
            </Button>
          )}
        </div>
      </div>

      <EditModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        product={product}
        onSave={(updatedData) => {
          updateProduct(product.id, updatedData);
          setShowEdit(false);
        }}
      />
    </>
  );
}
