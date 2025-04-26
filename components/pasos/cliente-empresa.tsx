"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { FormData } from "../reserva-turno"

interface ClienteEmpresaProps {
  formData: FormData
  actualizarFormData: (data: Partial<FormData>) => void
}

export default function ClienteEmpresa({ formData, actualizarFormData }: ClienteEmpresaProps) {
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""])

  useEffect(() => {
    // Initialize phone numbers from formData if available
    if (formData.telefono) {
      setPhoneNumbers(formData.telefono.split(","))
    } else {
      setPhoneNumbers([""])
    }
  }, [formData.telefono])

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""])
  }

  const removePhoneNumber = (index: number) => {
    const updated = [...phoneNumbers]
    updated.splice(index, 1)
    setPhoneNumbers(updated)
    actualizarFormData({ telefono: updated.join(",") })
  }

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = [...phoneNumbers]
    updated[index] = value
    setPhoneNumbers(updated)
    actualizarFormData({ telefono: updated.join(",") })
  }

  const handleTipoDocumentoChange = (value: string) => {
    actualizarFormData({ tipoDocumento: value })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tipoDocumento">
          Tipo de documento <span className="text-red-500">*</span>
        </Label>
        <Select value={formData.tipoDocumento} onValueChange={handleTipoDocumentoChange}>
          <SelectTrigger id="tipoDocumento">
            <SelectValue placeholder="Seleccione tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DNI">DNI</SelectItem>
            <SelectItem value="CUIL">CUIL</SelectItem>
            <SelectItem value="CUIT">CUIT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeroDocumento">
          Número de {formData.tipoDocumento} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="numeroDocumento"
          value={formData.numeroDocumento || ""}
          onChange={(e) => actualizarFormData({ numeroDocumento: e.target.value })}
          placeholder={`Ingrese su número de ${formData.tipoDocumento}`}
          required
        />
      </div>

      {formData.tipoDocumento === "CUIT" ? (
        <div className="space-y-2">
          <Label htmlFor="razonSocial">
            Razón Social <span className="text-red-500">*</span>
          </Label>
          <Input
            id="razonSocial"
            value={formData.razonSocial || ""}
            onChange={(e) => actualizarFormData({ razonSocial: e.target.value })}
            placeholder="Ingrese la razón social"
            required
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="nombreCompleto">
            Nombre Completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombreCompleto"
            value={formData.nombreCompleto || ""}
            onChange={(e) => actualizarFormData({ nombreCompleto: e.target.value })}
            placeholder="Ingrese su nombre completo"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          value={formData.email || ""}
          onChange={(e) => actualizarFormData({ email: e.target.value })}
          placeholder="Ingrese su email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="block text-sm font-medium mb-1">
          Teléfono de contacto <span className="text-red-500">*</span>
        </Label>
        {phoneNumbers.map((phone, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <Input
              type="tel"
              value={phone || ""}
              onChange={(e) => updatePhoneNumber(index, e.target.value)}
              placeholder="Ingrese su teléfono"
            />
            {phoneNumbers.length > 1 && (
              <button
                type="button"
                onClick={() => removePhoneNumber(index)}
                className="p-2 text-red-500 hover:text-red-700"
                aria-label="Eliminar número de teléfono"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addPhoneNumber}
          className="flex items-center text-blue-700 hover:text-blue-900 text-sm mt-1"
        >
          <Plus size={16} className="mr-1" />
          Agregar otro teléfono
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="domicilio">
          Domicilio <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="domicilio"
          rows={3}
          value={formData.domicilio || ""}
          onChange={(e) => actualizarFormData({ domicilio: e.target.value, ubicacionActual: e.target.value })}
          placeholder="Ingrese su domicilio completo"
          required
        />
      </div>
    </div>
  )
}
