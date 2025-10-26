"use client"

import type React from "react"

import { useState } from "react"
import type { IProduct } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  product: IProduct
  onSave: (data: Partial<IProduct>) => void
}

export function EditModal({ isOpen, onClose, product, onSave }: EditModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    purchasePrice: product.purchasePrice,
    status: product.status,
    quantity: product.quantity || "",
  })

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
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: formData.name,
      price: formData.price as number,
      purchasePrice: formData.purchasePrice as number,
      status: formData.status as IProduct["status"],
      quantity: formData.quantity ? (formData.quantity as number) : undefined,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg border border-border bg-card p-6 shadow-[0_10px_50px_rgba(0,0,0,0.1)] max-w-sm mx-4">
        <h2 className="mb-4 text-lg font-semibold">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Purchase Price</label>
            <Input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              step="0.01"
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
              step="0.01"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full" />
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

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
