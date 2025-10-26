"use client"

import type React from "react"

import { useState } from "react"
import { useProducts } from "@/hooks/use-products"
import { ConfirmModal } from "./confirm-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

export function ProductForm() {
  const { addProduct, products } = useProducts()
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    purchasePrice: "",
    status: "pending" as const,
    quantity: "",
  })
  const [error, setError] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingProduct, setPendingProduct] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "purchasePrice"
          ? value
            ? Number.parseFloat(value)
            : ""
          : value,
    }))
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim() || !formData.price || !formData.purchasePrice) {
      setError("Name, selling price, and purchase price are required")
      return
    }

    // Check for existing product with same name
    const existingProduct = products.find((p) => p.name.toLowerCase() === formData.name.toLowerCase())

    if (existingProduct && (existingProduct.status === "returned" || existingProduct.status === "failed")) {
      setPendingProduct({ ...formData, existingId: existingProduct.id })
      setShowConfirm(true)
      return
    }

    if (existingProduct) {
      setError("A product with this name already exists")
      return
    }

    addProduct({
      name: formData.name,
      price: formData.price as number,
      purchasePrice: formData.purchasePrice as number,
      status: formData.status,
      quantity: formData.quantity ? (formData.quantity as number) : undefined,
    })

    setFormData({ name: "", price: "", purchasePrice: "", status: "pending", quantity: "" })
  }

  const handleConfirm = (action: "mark-sold" | "create-new") => {
    if (action === "mark-sold") {
      addProduct({
        name: pendingProduct.name,
        price: pendingProduct.price,
        purchasePrice: pendingProduct.purchasePrice,
        status: "delivered",
        quantity: pendingProduct.quantity,
        updateId: pendingProduct.existingId,
      })
    } else {
      addProduct({
        name: `${pendingProduct.name} #2`,
        price: pendingProduct.price,
        purchasePrice: pendingProduct.purchasePrice,
        status: pendingProduct.status,
        quantity: pendingProduct.quantity,
      })
    }

    setFormData({ name: "", price: "", purchasePrice: "", status: "pending", quantity: "" })
    setShowConfirm(false)
    setPendingProduct(null)
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-6 shadow-[0_10px_50px_rgba(0,0,0,0.1)]">
        <h2 className="mb-6 text-lg font-semibold">Add Product</h2>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Selling Price</label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Purchase Price</label>
            <Input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="returned">Returned</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Add Product
          </Button>
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        productName={pendingProduct?.name}
      />
    </>
  )
}
