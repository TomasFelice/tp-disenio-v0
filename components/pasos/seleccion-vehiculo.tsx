"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { FormData, VehiculoData } from "../reserva-turno"

interface SeleccionVehiculoProps {
  formData: FormData
  actualizarFormData: (data: Partial<FormData>) => void
}

// Datos de ejemplo para vehículos registrados
const vehiculosRegistrados = [
  { id: "1", patente: "AB123CD", modelo: "Toyota Hilux", anio: "2024", ultimoKm: "10000" },
  { id: "2", patente: "XY987ZW", modelo: "Ford Ranger", anio: "2022", ultimoKm: "30000" },
  { id: "3", patente: "LM456NO", modelo: "Volkswagen Amarok", anio: "2025", ultimoKm: "1001" },
  { id: "4", patente: "OP789QR", modelo: "Chevrolet S10", anio: "2011", ultimoKm: "40000" },
  { id: "5", patente: "ST012UV", modelo: "Fiat Toro", anio: "2024", ultimoKm: "10000" },
]

export default function SeleccionVehiculo({ formData, actualizarFormData }: SeleccionVehiculoProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("")
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false)
  const [newVehicle, setNewVehicle] = useState<Partial<VehiculoData>>({
    patente: "",
    modelo: "",
    anio: "",
    numeroMotor: "",
    numeroChasis: "",
  })
  const [editingVehicleIndex, setEditingVehicleIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePatente = (patente: string) => {
    // Validar formato de patente argentina (viejo: ABC123 o nuevo: AB123CD)
    return /^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/.test(patente)
  }

  const handleAddVehicle = () => {
    if (selectedVehicleId) {
      const vehicleToAdd = vehiculosRegistrados.find((v) => v.id === selectedVehicleId)

      if (vehicleToAdd && !formData.vehiculos.some((v) => v.patente === vehicleToAdd.patente)) {
        const newVehiculos = [
          ...formData.vehiculos,
          {
            id: vehicleToAdd.id,
            patente: vehicleToAdd.patente,
            modelo: vehicleToAdd.modelo,
            anio: vehicleToAdd.anio,
            ultimoKm: vehicleToAdd.ultimoKm,
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

  const handleNewVehicleChange = (field: string, value: string) => {
    setNewVehicle({ ...newVehicle, [field]: value })

    // Validate patente
    if (field === "patente" && value && !validatePatente(value)) {
      setErrors({ ...errors, patente: "Ingrese una patente válida (Ej: AB123CD)" })
    } else {
      const newErrors = { ...errors }
      delete newErrors.patente
      setErrors(newErrors)
    }
  }

  const handleSaveNewVehicle = () => {
    // Validate required fields
    const newErrors: Record<string, string> = {}

    if (!newVehicle.patente) {
      newErrors.patente = "La patente es obligatoria"
    } else if (!validatePatente(newVehicle.patente)) {
      newErrors.patente = "Ingrese una patente válida (Ej: AB123CD)"
    }

    if (!newVehicle.modelo) newErrors.modelo = "El modelo es obligatorio"
    if (!newVehicle.anio) newErrors.anio = "El año es obligatorio"
    if (!newVehicle.numeroMotor) newErrors.numeroMotor = "El número de motor es obligatorio"
    if (!newVehicle.numeroChasis) newErrors.numeroChasis = "El número de chasis es obligatorio"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const newId = `new-${Date.now()}`

      if (editingVehicleIndex !== null) {
        // Update existing vehicle
        const updatedVehicles = [...formData.vehiculos]
        updatedVehicles[editingVehicleIndex] = {
          ...updatedVehicles[editingVehicleIndex],
          ...newVehicle,
          id: updatedVehicles[editingVehicleIndex].id,
        } as VehiculoData

        actualizarFormData({ vehiculos: updatedVehicles })
        setEditingVehicleIndex(null)
      } else {
        // Add new vehicle
        const newVehiculos = [
          ...formData.vehiculos,
          {
            id: newId,
            patente: newVehicle.patente || "",
            modelo: newVehicle.modelo || "",
            anio: newVehicle.anio || "",
            numeroMotor: newVehicle.numeroMotor || "",
            numeroChasis: newVehicle.numeroChasis || "",
            kmActual: "0",
          },
        ]

        actualizarFormData({ vehiculos: newVehiculos })
      }

      setNewVehicle({
        patente: "",
        modelo: "",
        anio: "",
        numeroMotor: "",
        numeroChasis: "",
      })

      setShowNewVehicleForm(false)
    }
  }

  const handleEditVehicle = (index: number) => {
    const vehicleToEdit = formData.vehiculos[index]
    setNewVehicle({
      patente: vehicleToEdit.patente,
      modelo: vehicleToEdit.modelo,
      anio: vehicleToEdit.anio,
      numeroMotor: vehicleToEdit.numeroMotor || "",
      numeroChasis: vehicleToEdit.numeroChasis || "",
    })
    setEditingVehicleIndex(index)
    setShowNewVehicleForm(true)
  }

  const handleCancelEdit = () => {
    setNewVehicle({
      patente: "",
      modelo: "",
      anio: "",
      numeroMotor: "",
      numeroChasis: "",
    })
    setEditingVehicleIndex(null)
    setShowNewVehicleForm(false)
    setErrors({})
  }

  // Filter out vehicles that are already selected
  const availableVehicles = vehiculosRegistrados.filter(
    (v) => !formData.vehiculos.some((selected) => selected.patente === v.patente),
  )

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="vehiculoSeleccionado" className="mb-2 block">
              Vehículos registrados
            </Label>
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
                      onClick={() => handleEditVehicle(index)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Edit size={16} />
                    </Button>
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

        <Dialog open={showNewVehicleForm} onOpenChange={setShowNewVehicleForm}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full mt-4 border-dashed border-2 flex items-center justify-center gap-2"
              onClick={() => {
                setEditingVehicleIndex(null)
                setNewVehicle({
                  patente: "",
                  modelo: "",
                  anio: "",
                  numeroMotor: "",
                  numeroChasis: "",
                })
                setErrors({})
              }}
            >
              <PlusCircle size={16} />
              Registrar nuevo vehículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingVehicleIndex !== null ? "Editar vehículo" : "Registrar nuevo vehículo"}</DialogTitle>
              <DialogDescription>Complete los datos del vehículo para registrarlo en el sistema.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="patente">
                  Patente <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="patente"
                  value={newVehicle.patente || ""}
                  onChange={(e) => handleNewVehicleChange("patente", e.target.value.toUpperCase())}
                  placeholder="AB123CD"
                  className="uppercase"
                />
                {errors.patente && <p className="text-sm text-red-500">{errors.patente}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo">
                  Modelo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="modelo"
                  value={newVehicle.modelo || ""}
                  onChange={(e) => handleNewVehicleChange("modelo", e.target.value)}
                  placeholder="Marca y modelo del vehículo"
                />
                {errors.modelo && <p className="text-sm text-red-500">{errors.modelo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="anio">
                  Año de patentamiento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="anio"
                  value={newVehicle.anio || ""}
                  onChange={(e) => handleNewVehicleChange("anio", e.target.value)}
                  placeholder="YYYY"
                />
                {errors.anio && <p className="text-sm text-red-500">{errors.anio}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroMotor">
                  Número de motor <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numeroMotor"
                  value={newVehicle.numeroMotor || ""}
                  onChange={(e) => handleNewVehicleChange("numeroMotor", e.target.value)}
                  placeholder="Número de motor"
                />
                {errors.numeroMotor && <p className="text-sm text-red-500">{errors.numeroMotor}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroChasis">
                  Número de chasis <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numeroChasis"
                  value={newVehicle.numeroChasis || ""}
                  onChange={(e) => handleNewVehicleChange("numeroChasis", e.target.value)}
                  placeholder="Número de chasis"
                />
                {errors.numeroChasis && <p className="text-sm text-red-500">{errors.numeroChasis}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button onClick={handleSaveNewVehicle} className="bg-[#004aad] hover:bg-[#003a8a]">
                {editingVehicleIndex !== null ? "Guardar cambios" : "Registrar vehículo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {formData.vehiculos.length === 0 && (
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-amber-800">
          <p className="text-sm">Debe seleccionar al menos un vehículo para continuar.</p>
        </div>
      )}
    </div>
  )
}
