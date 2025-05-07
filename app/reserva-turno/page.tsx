"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ReservaTurno from "@/components/reserva-turno"
import { useVehiculos } from "@/hooks/use-vehiculos"
import { NoVehiculosModal } from "@/components/modals/no-vehiculos-modal"

export default function ReservaTurnoPage() {
  const router = useRouter()
  const { vehiculos, isLoading } = useVehiculos()
  const [showNoVehiculosModal, setShowNoVehiculosModal] = useState(false)
  const [canAccess, setCanAccess] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (vehiculos.length === 0) {
        setShowNoVehiculosModal(true)
      } else {
        setCanAccess(true)
      }
    }
  }, [vehiculos, isLoading])

  const handleModalClose = (open: boolean) => {
    setShowNoVehiculosModal(open)
    if (!open && vehiculos.length === 0) {
      router.push("/dashboard")
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {canAccess && <ReservaTurno />}
        <NoVehiculosModal open={showNoVehiculosModal} onOpenChange={handleModalClose} />
      </div>
    </main>
  )
}
