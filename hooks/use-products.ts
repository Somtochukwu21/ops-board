"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface IProduct {
  id: string
  name: string
  price: number
  purchasePrice: number
  status: "delivered" | "pending" | "returned" | "failed"
  quantity?: number
  category?: string
  createdAt: string
  updatedAt?: string
}

export function useProducts() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (fetchError) throw fetchError

        const mappedProducts = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number.parseFloat(p.selling_price),
          purchasePrice: Number.parseFloat(p.purchase_price),
          status: p.status,
          quantity: p.quantity,
          category: p.category,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }))

        setProducts(mappedProducts)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addProduct = async (data: {
    name: string
    price: number
    purchasePrice: number
    status: IProduct["status"]
    quantity?: number
    category?: string
    updateId?: string
  }) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      if (data.updateId) {
        const { error: updateError } = await supabase
          .from("products")
          .update({
            status: data.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.updateId)
          .eq("user_id", user.id)

        if (updateError) throw updateError

        setProducts((prev) =>
          prev.map((p) =>
            p.id === data.updateId ? { ...p, status: data.status, updatedAt: new Date().toISOString() } : p,
          ),
        )
      } else {
        const { data: newProduct, error: insertError } = await supabase
          .from("products")
          .insert({
            user_id: user.id,
            name: data.name,
            selling_price: data.price,
            purchase_price: data.purchasePrice,
            status: data.status,
            quantity: data.quantity || 1,
            category: data.category,
          })
          .select()
          .single()

        if (insertError) throw insertError

        const mappedProduct: IProduct = {
          id: newProduct.id,
          name: newProduct.name,
          price: Number.parseFloat(newProduct.selling_price),
          purchasePrice: Number.parseFloat(newProduct.purchase_price),
          status: newProduct.status,
          quantity: newProduct.quantity,
          category: newProduct.category,
          createdAt: newProduct.created_at,
          updatedAt: newProduct.updated_at,
        }

        setProducts((prev) => [mappedProduct, ...prev])
      }
    } catch (err) {
      console.error("Failed to add product:", err)
      setError(err instanceof Error ? err.message : "Failed to add product")
    }
  }

  const updateProduct = async (id: string, data: Partial<IProduct>) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      if (data.name) updateData.name = data.name
      if (data.price) updateData.selling_price = data.price
      if (data.purchasePrice) updateData.purchase_price = data.purchasePrice
      if (data.status) updateData.status = data.status
      if (data.quantity !== undefined) updateData.quantity = data.quantity

      const { error: updateError } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)

      if (updateError) throw updateError

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      )
    } catch (err) {
      console.error("Failed to update product:", err)
      setError(err instanceof Error ? err.message : "Failed to update product")
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const { error: deleteError } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id)

      if (deleteError) throw deleteError

      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Failed to delete product:", err)
      setError(err instanceof Error ? err.message : "Failed to delete product")
    }
  }

  const markAsSold = (id: string) => {
    updateProduct(id, { status: "delivered" })
  }

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    markAsSold,
  }
}
