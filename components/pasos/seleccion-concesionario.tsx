"use client"

import { Input } from "@/components/ui/input"

import { useEffect, useState } from "react"
import type { FormData } from "../reserva-turno"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPin, Map } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SeleccionConcesionarioProps {
  formData: FormData
  actualizarFormData: (data: Partial<FormData>) => void
}

interface Concesionario {
  id: string
  nombre: string
  direccion: string
  cupo: number
}

// Datos de ejemplo para concesionarios
const concesionarios: Concesionario[] = [
  { id: "1", nombre: "Concesionaria Central", direccion: "Av. Corrientes 1234, CABA", cupo: 5 },
  { id: "2", nombre: "Concesionaria Norte", direccion: "Av. Maipú 2345, Vicente López", cupo: 3 },
  { id: "3", nombre: "Concesionaria Sur", direccion: "Av. Hipólito Yrigoyen 8765, Lanús", cupo: 4 },
  { id: "4", nombre: "Concesionaria Este", direccion: "Av. Mitre 111, Avellaneda", cupo: 2 },
  { id: "5", nombre: "Concesionaria Oeste", direccion: "Av. Rivadavia 2222, Morón", cupo: 3 },
  { id: "6", nombre: "Concesionaria Centro", direccion: "Calle Lavalle 333, Lomas de Zamora", cupo: 4 },
  { id: "7", nombre: "Concesionaria Playa", direccion: "Av. Costanera 444, Mar del Plata", cupo: 2 },
  { id: "8", nombre: "Concesionaria Montaña", direccion: "Ruta 7 Km 123, Mendoza", cupo: 1 },
]

// Fechas no disponibles (días completos)
const fechasNoDisponibles = [new Date(2025, 3, 20), new Date(2025, 3, 21), new Date(2025, 3, 25)]

// Horarios disponibles
const horariosDisponibles = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

export default function SeleccionConcesionario({ formData, actualizarFormData }: SeleccionConcesionarioProps) {
  const [concesionariosCercanos, setConcesionariosCercanos] = useState<Concesionario[]>([])
  const [concesionariosOtros, setConcesionariosOtros] = useState<Concesionario[]>([])
  const [showMapDialog, setShowMapDialog] = useState(false)
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState<number | null>(null)

  // Calcular cercanos y otros al cambiar domicilio
  useEffect(() => {
    let cercanos: Concesionario[] = []
    cercanos = concesionarios.slice(0, 3)
    const otros = concesionarios.filter((c) => !cercanos.some((cc) => cc.id === c.id))
    setConcesionariosCercanos(cercanos)
    setConcesionariosOtros(otros)
  }, [formData.ubicacionActual])

  const esFechaDisponible = (date: Date) => {
    return !fechasNoDisponibles.some(
      (nd) =>
        nd.getDate() === date.getDate() && nd.getMonth() === date.getMonth() && nd.getFullYear() === date.getFullYear(),
    )
  }

  const handleFechaChange = (index: number, date: Date | undefined) => {
    const updatedVehiculos = [...formData.vehiculos]
    updatedVehiculos[index].fecha = date
    actualizarFormData({ vehiculos: updatedVehiculos })
  }

  const handleHoraChange = (index: number, hora: string) => {
    const updatedVehiculos = [...formData.vehiculos]
    updatedVehiculos[index].hora = hora
    actualizarFormData({ vehiculos: updatedVehiculos })
  }

  const handleUbicacionChange = (nuevaUbicacion: string) => {
    actualizarFormData({ ubicacionSeleccionada: nuevaUbicacion })
    setShowMapDialog(false)
  }

  // Función para determinar si una fecha está deshabilitada
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Deshabilitar días pasados, fines de semana y días sin disponibilidad
    return date < today || date.getDay() === 0 || date.getDay() === 6 || !esFechaDisponible(date)
  }

  // Función para aplicar clases CSS personalizadas a los días del calendario
  const modifiersStyles = {
    available: { backgroundColor: "#dcfce7", color: "#166534" }, // Verde para días disponibles
    unavailable: { backgroundColor: "#fee2e2", color: "#991b1b" }, // Rojo para días sin disponibilidad
    disabled: { color: "#d1d5db" }, // Gris para días deshabilitados
  }

  // Función para determinar el modificador de cada día
  const dayModifier = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date < today || date.getDay() === 0 || date.getDay() === 6) {
      return "disabled"
    }

    if (!esFechaDisponible(date)) {
      return "unavailable"
    }

    return "available"
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-start">
        <MapPin className="h-5 w-5 text-[#38b6ff] mr-2 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-700">Su ubicación actual</h3>
          <p className="text-gray-600">{formData.domicilio || ""}</p>
          <Button variant="link" className="p-0 h-auto text-[#004aad]" onClick={() => setShowMapDialog(true)}>
            Cambiar ubicación
          </Button>
        </div>
      </div>

      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Seleccionar ubicación</DialogTitle>
            <DialogDescription>
              Seleccione su ubicación en el mapa para encontrar concesionarios cercanos.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-md h-[300px] flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Mapa no disponible en la versión de demostración</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="nuevaUbicacion">Dirección seleccionada</Label>
              <Input
                id="nuevaUbicacion"
                value={formData.ubicacionSeleccionada || formData.domicilio || ""}
                onChange={(e) => actualizarFormData({ ubicacionSeleccionada: e.target.value })}
                placeholder="Ingrese una dirección"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMapDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => handleUbicacionChange(formData.ubicacionSeleccionada || formData.domicilio)}
              className="bg-[#004aad] hover:bg-[#003a8a]"
            >
              Confirmar ubicación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        <Label htmlFor="concesionario">
          Concesionario <span className="text-red-500">*</span>
        </Label>
        <Select value={formData.concesionario} onValueChange={(value) => actualizarFormData({ concesionario: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un concesionario" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cercanos a vos</SelectLabel>
              {concesionariosCercanos.length > 0 ? (
                concesionariosCercanos.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="nada" disabled>
                  Ingrese su domicilio para ver concesionarios cercanos
                </SelectItem>
              )}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Otros</SelectLabel>
              {concesionariosOtros.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nombre}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {formData.concesionario && (
          <div className="mt-2 flex items-start text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1 mt-0.5 text-[#38b6ff]" />
            <span>{concesionarios.find((c) => c.id === formData.concesionario)?.direccion}</span>
          </div>
        )}
      </div>

      {formData.concesionario && formData.vehiculos.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-green-100"></div>
              <span className="text-sm text-green-800">Días con disponibilidad</span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-red-100"></div>
              <span className="text-sm text-red-800">Días sin disponibilidad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-200"></div>
              <span className="text-sm text-gray-500">Días pasados o fin de semana</span>
            </div>
          </div>

          <Label className="mb-2 block">Seleccione fecha y hora para cada vehículo</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patente</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.vehiculos.map((vehiculo, index) => (
                <TableRow key={index}>
                  <TableCell>{vehiculo.patente}</TableCell>
                  <TableCell>{vehiculo.modelo}</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {vehiculo.fecha ? format(vehiculo.fecha, "PPP", { locale: es }) : "Seleccione una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <style jsx global>{`
                          .rdp-day_available {
                            background-color: #dcfce7 !important;
                            color: #166534 !important;
                          }
                          .rdp-day_unavailable {
                            background-color: #fee2e2 !important;
                            color: #991b1b !important;
                          }
                          .rdp-day_disabled {
                            color: #d1d5db !important;
                          }
                        `}</style>
                        <Calendar
                          mode="single"
                          selected={vehiculo.fecha}
                          onSelect={(date) => handleFechaChange(index, date)}
                          disabled={isDateDisabled}
                          className="rounded-md border"
                          locale={es}
                          modifiers={{
                            available: (date) => !isDateDisabled(date),
                            unavailable: (date) => !esFechaDisponible(date) && !isDateDisabled(date),
                            disabled: isDateDisabled,
                          }}
                          modifiersStyles={modifiersStyles}
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Select value={vehiculo.hora} onValueChange={(hora) => handleHoraChange(index, hora)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccione una hora" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Horarios disponibles</SelectLabel>
                          {horariosDisponibles.map((hora) => (
                            <SelectItem key={hora} value={hora}>
                              {hora}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
