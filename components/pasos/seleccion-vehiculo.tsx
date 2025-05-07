"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "../reserva-turno"
import { useVehiculos } from "@/hooks/use-vehiculos"

interface SeleccionVehiculoProps {
  formData: FormData
  actualizarFormData: (data: Partial<FormData>) => void
}

export default function SeleccionVehiculo({ formData, actualizarFormData }: SeleccionVehiculoProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("")
  const { vehiculos } = useVehiculos()

  const handleAddVehicle = () => {
    if (selectedVehicleId) {
      const vehicleToAdd = vehiculos.find((v) => v.id === selectedVehicleId)

      if (vehicleToAdd && !formData.vehiculos.some((v) => v.patente === vehicleToAdd.patente)) {
        const newVehiculos = [
          ...formData.vehiculos,
          {
            id: vehicleToAdd.id,
            patente: vehicleToAdd.patente,
            modelo: vehicleToAdd.modelo,
            anio: vehicleToAdd.anio,
            ultimoKm: vehicleToAdd.ultimoKm || "0",
            kmActual: "",
          },
        ]

        actualizarFormData({ vehiculos: newVehiculos })
        setSelectedVehicleId("")
      }
    }
  }

  const handleRemoveVehicle = (index: number) => {
    const newVehiculos = [...formData.vehiculos]
    newVehiculos.splice(index, 1)
    actualizarFormData({ vehiculos: newVehiculos })
  }

  // Filter out vehicles that are already selected
  const availableVehicles = vehiculos.filter(
    (v) => !formData.vehiculos.some((selected) => selected.patente === v.patente),
  )

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="vehiculoSeleccionado" className="mb-2 block text-sm font-medium">
              Vehículos registrados
            </label>
            <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
              <SelectTrigger id="vehiculoSeleccionado">
                <SelectValue placeholder="Seleccione un vehículo" />
              </SelectTrigger>
              <SelectContent>
                {availableVehicles.length > 0 ? (
                  availableVehicles.map((vehiculo) => (
                    <SelectItem key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.patente} - {vehiculo.modelo} ({vehiculo.anio})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-available" disabled>
                    No hay más vehículos disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddVehicle} disabled={!selectedVehicleId} className="bg-[#004aad] hover:bg-[#003a8a]">
            Agregar vehículo
          </Button>
        </div>

        {formData.vehiculos.length > 0 && (
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium text-lg">Vehículos seleccionados</h3>
            <div className="space-y-3">
              {formData.vehiculos.map((vehiculo, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div>
                    <div className="font-medium">
                      {vehiculo.patente} - {vehiculo.modelo}
                    </div>
                    <div className="text-sm text-gray-500">Año: {vehiculo.anio}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVehicle(index)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.vehiculos.length === 0 && (
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-amber-800">
            <p className="text-sm">Debe seleccionar al menos un vehículo para continuar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
