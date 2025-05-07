"use client"

import { useState, useEffect } from "react"
import type { VehiculoData } from "@/components/reserva-turno"

// Simulación de almacenamiento local para vehículos
export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<VehiculoData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulamos la carga de vehículos desde localStorage
    const loadVehiculos = () => {
      setIsLoading(true)
      try {
        const storedVehiculos = localStorage.getItem("vehiculos")
        if (storedVehiculos) {
          setVehiculos(JSON.parse(storedVehiculos))
        }
      } catch (error) {
        console.error("Error al cargar vehículos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadVehiculos()
  }, [])

  const addVehiculo = (vehiculo: VehiculoData) => {
    const newVehiculos = [...vehiculos, vehiculo]
    setVehiculos(newVehiculos)
    try {
      localStorage.setItem("vehiculos", JSON.stringify(newVehiculos))
    } catch (error) {
      console.error("Error al guardar vehículo:", error)
    }
  }

  const removeVehiculo = (id: string) => {
    const newVehiculos = vehiculos.filter((v) => v.id !== id)
    setVehiculos(newVehiculos)
    try {
      localStorage.setItem("vehiculos", JSON.stringify(newVehiculos))
    } catch (error) {
      console.error("Error al eliminar vehículo:", error)
    }
  }

  const updateVehiculo = (id: string, updatedVehiculo: Partial<VehiculoData>) => {
    const newVehiculos = vehiculos.map((v) => (v.id === id ? { ...v, ...updatedVehiculo } : v))
    setVehiculos(newVehiculos)
    try {
      localStorage.setItem("vehiculos", JSON.stringify(newVehiculos))
    } catch (error) {
      console.error("Error al actualizar vehículo:", error)
    }
  }

  return {
    vehiculos,
    isLoading,
    addVehiculo,
    removeVehiculo,
    updateVehiculo,
  }
}
