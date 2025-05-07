"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Car } from "lucide-react"
import { useRouter } from "next/navigation"

interface NoVehiculosModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NoVehiculosModal({ open, onOpenChange }: NoVehiculosModalProps) {
  const router = useRouter()

  const handleRegistrarVehiculo = () => {
    onOpenChange(false)
    router.push("/registrar-vehiculo")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-blue-50 p-3 rounded-full mb-4">
            <Car className="h-10 w-10 text-[#004aad]" />
          </div>
          <DialogTitle className="text-center text-xl">No tienes vehículos registrados</DialogTitle>
          <DialogDescription className="text-center">
            Para acceder al servicio de mantenimiento, primero debes registrar al menos un vehículo en tu cuenta.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleRegistrarVehiculo} className="bg-[#004aad] hover:bg-[#003a8a]">
            Registrar vehículo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
