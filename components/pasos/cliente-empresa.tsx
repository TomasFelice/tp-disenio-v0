"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { FormData } from "../reserva-turno"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ClienteEmpresaProps {
  formData: FormData
  actualizarFormData: (data: Partial<FormData>) => void
}

// Datos de muestra del cliente
const clienteMuestra = {
  tipoDocumento: "CUIT",
  numeroDocumento: "30-71234567-9",
  razonSocial: "Empresa de Transportes S.A.",
  nombreCompleto: "Juan Carlos Pérez",
  email: "contacto@transportes.com.ar",
  telefono: "11-4567-8901",
  domicilio: "Av. Corrientes 1234, CABA, Buenos Aires",
}

export default function ClienteEmpresa({ formData, actualizarFormData }: ClienteEmpresaProps) {
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([clienteMuestra.telefono])

  useEffect(() => {
    // Inicializar los datos del formulario con los datos de muestra
    actualizarFormData({
      tipoDocumento: clienteMuestra.tipoDocumento,
      numeroDocumento: clienteMuestra.numeroDocumento,
      razonSocial: clienteMuestra.razonSocial,
      nombreCompleto: clienteMuestra.nombreCompleto,
      email: clienteMuestra.email,
      telefono: phoneNumbers.join(","),
      domicilio: clienteMuestra.domicilio,
      ubicacionActual: clienteMuestra.domicilio,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Array de dependencias vacío para que solo se ejecute una vez al montar

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""])
    actualizarFormData({ telefono: [...phoneNumbers, ""].join(",") })
  }

  const removePhoneNumber = (index: number) => {
    if (index === 0) return // No permitir eliminar el teléfono principal

    const updated = [...phoneNumbers]
    updated.splice(index, 1)
    setPhoneNumbers(updated)
    actualizarFormData({ telefono: updated.join(",") })
  }

  const updatePhoneNumber = (index: number, value: string) => {
    if (index === 0) return // No permitir modificar el teléfono principal

    const updated = [...phoneNumbers]
    updated[index] = value
    setPhoneNumbers(updated)
    actualizarFormData({ telefono: updated.join(",") })
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Los datos mostrados a continuación corresponden a su cuenta registrada y no pueden ser modificados en este
          módulo.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipoDocumento">Tipo de documento</Label>
          <Input id="tipoDocumento" value={formData.tipoDocumento} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numeroDocumento">Número de {formData.tipoDocumento}</Label>
          <Input id="numeroDocumento" value={formData.numeroDocumento} disabled className="bg-gray-50" />
        </div>

        {formData.tipoDocumento === "CUIT" ? (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="razonSocial">Razón Social</Label>
            <Input id="razonSocial" value={formData.razonSocial} disabled className="bg-gray-50" />
          </div>
        ) : (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nombreCompleto">Nombre Completo</Label>
            <Input id="nombreCompleto" value={formData.nombreCompleto} disabled className="bg-gray-50" />
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" value={formData.email} disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="block text-sm font-medium mb-1">Teléfono de contacto</Label>
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="flex items-center mb-2 gap-2">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => updatePhoneNumber(index, e.target.value)}
                placeholder="Ingrese su teléfono"
                disabled={index === 0} // Solo el primer teléfono está deshabilitado
                className={index === 0 ? "bg-gray-50" : ""}
              />
              {index > 0 && (
                <Button
                  type="button"
                  onClick={() => removePhoneNumber(index)}
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  aria-label="Eliminar número de teléfono"
                >
                  <Trash2 size={18} />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={addPhoneNumber}
            variant="outline"
            size="sm"
            className="flex items-center text-blue-700 hover:text-blue-900 text-sm mt-1"
          >
            <Plus size={16} className="mr-1" />
            Agregar otro teléfono
          </Button>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="domicilio">Domicilio</Label>
          <Textarea id="domicilio" rows={3} value={formData.domicilio} disabled className="bg-gray-50 resize-none" />
        </div>
      </div>
    </div>
  )
}
