"use client"

import { useState } from "react"
import type { FormData } from "../reserva-turno"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DatosRetiroProps {
  formData: FormData
  actualizarFormData: (data: Partial<FormData>) => void
}

interface PersonaRetiro {
  nombre: string
  apellido: string
  dni: string
}

export default function DatosRetiro({ formData, actualizarFormData }: DatosRetiroProps) {
  const [personaActual, setPersonaActual] = useState<PersonaRetiro>({
    nombre: "",
    apellido: "",
    dni: "",
  })
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<number | null>(null)
  const [aplicado, setAplicado] = useState(false)

  const handlePersonaChange = (field: keyof PersonaRetiro, value: string) => {
    setPersonaActual((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGuardarPersona = (index: number) => {
    if (!personaActual.nombre || !personaActual.apellido || !personaActual.dni) {
      return
    }

    const updatedVehiculos = [...formData.vehiculos]
    updatedVehiculos[index] = {
      ...updatedVehiculos[index],
      personaRetiro: { ...personaActual },
    }

    actualizarFormData({ vehiculos: updatedVehiculos })
    setVehiculoSeleccionado(null)
    setAplicado(false)
  }

  const handleAplicarATodos = () => {
    if (!personaActual.nombre || !personaActual.apellido || !personaActual.dni) {
      return
    }

    const updatedVehiculos = formData.vehiculos.map((vehiculo) => ({
      ...vehiculo,
      personaRetiro: { ...personaActual },
    }))

    actualizarFormData({ vehiculos: updatedVehiculos })
    setVehiculoSeleccionado(null)
    setAplicado(true)
  }

  const handleEditarPersona = (index: number) => {
    const vehiculo = formData.vehiculos[index]
    if (vehiculo.personaRetiro) {
      setPersonaActual({
        nombre: vehiculo.personaRetiro.nombre,
        apellido: vehiculo.personaRetiro.apellido,
        dni: vehiculo.personaRetiro.dni,
      })
    } else {
      setPersonaActual({
        nombre: "",
        apellido: "",
        dni: "",
      })
    }
    setVehiculoSeleccionado(index)
    setAplicado(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">Información importante</h3>
        <p className="text-blue-700 text-sm">
          Debe indicar quién retirará cada vehículo. La persona designada deberá presentar su DNI al momento de retirar
          el vehículo.
        </p>
      </div>

      {formData.vehiculos.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patente</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Persona que retira</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.vehiculos.map((vehiculo, index) => (
                <TableRow key={index}>
                  <TableCell>{vehiculo.patente}</TableCell>
                  <TableCell>{vehiculo.modelo}</TableCell>
                  <TableCell>
                    {vehiculo.personaRetiro ? (
                      <div>
                        <div className="font-medium">
                          {vehiculo.personaRetiro.nombre} {vehiculo.personaRetiro.apellido}
                        </div>
                        <div className="text-sm text-gray-500">DNI: {vehiculo.personaRetiro.dni}</div>
                      </div>
                    ) : (
                      <span className="text-amber-500">No asignado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditarPersona(index)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      {vehiculo.personaRetiro ? "Editar" : "Asignar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {vehiculoSeleccionado !== null && (
            <Card className="mt-4 border-l-4 border-l-[#38b6ff]">
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-4">
                  {formData.vehiculos[vehiculoSeleccionado].patente} - {formData.vehiculos[vehiculoSeleccionado].modelo}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      value={personaActual.nombre}
                      onChange={(e) => handlePersonaChange("nombre", e.target.value)}
                      placeholder="Nombre de quien retira"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellido">
                      Apellido <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="apellido"
                      value={personaActual.apellido}
                      onChange={(e) => handlePersonaChange("apellido", e.target.value)}
                      placeholder="Apellido de quien retira"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="dni">
                      DNI <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dni"
                      value={personaActual.dni}
                      onChange={(e) => handlePersonaChange("dni", e.target.value)}
                      placeholder="DNI de quien retira"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button
                    onClick={() => handleGuardarPersona(vehiculoSeleccionado)}
                    className="bg-[#004aad] hover:bg-[#003a8a]"
                    disabled={!personaActual.nombre || !personaActual.apellido || !personaActual.dni}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAplicarATodos}
                    className="flex items-center gap-2"
                    disabled={!personaActual.nombre || !personaActual.apellido || !personaActual.dni}
                  >
                    <Copy size={16} /> Aplicar a todos los vehículos
                  </Button>
                  <Button variant="ghost" onClick={() => setVehiculoSeleccionado(null)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {aplicado && (
            <div className="bg-green-50 p-4 rounded-md border border-green-100 flex items-center mt-4">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700">La misma persona ha sido asignada a todos los vehículos.</p>
            </div>
          )}

          {formData.vehiculos.some((v) => !v.personaRetiro) && (
            <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mt-4">
              <p className="text-amber-700 text-sm">
                Debe asignar una persona para retirar cada vehículo antes de continuar.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-amber-800">
          <p>No hay vehículos seleccionados. Por favor, vuelva al paso de selección de vehículos.</p>
        </div>
      )}
    </div>
  )
}
