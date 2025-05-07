"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Check } from "lucide-react"
import { useVehiculos } from "@/hooks/use-vehiculos"
import type { VehiculoData } from "./reserva-turno"

export default function RegistrarVehiculo() {
  const router = useRouter()
  const { addVehiculo } = useVehiculos()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [vehiculo, setVehiculo] = useState<Partial<VehiculoData>>({
    patente: "",
    modelo: "",
    anio: "",
    numeroMotor: "",
    numeroChasis: "",
  })

  const validatePatente = (patente: string) => {
    return /^[A-Z]{2,3}\d{3}[A-Z]{0,2}$/.test(patente)
  }

  const handleChange = (field: keyof VehiculoData, value: string) => {
    setVehiculo({ ...vehiculo, [field]: field === "patente" ? value.toUpperCase() : value })

    // Validar patente
    if (field === "patente" && value && !validatePatente(value.toUpperCase())) {
      setErrors({ ...errors, patente: "Ingrese una patente válida (Ej: AB123CD)" })
    } else if (field === "patente") {
      const newErrors = { ...errors }
      delete newErrors.patente
      setErrors(newErrors)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos requeridos
    const newErrors: Record<string, string> = {}

    if (!vehiculo.patente) {
      newErrors.patente = "La patente es obligatoria"
    } else if (!validatePatente(vehiculo.patente)) {
      newErrors.patente = "Ingrese una patente válida (Ej: AB123CD)"
    }

    if (!vehiculo.modelo) newErrors.modelo = "El modelo es obligatorio"
    if (!vehiculo.anio) newErrors.anio = "El año es obligatorio"
    if (!vehiculo.numeroMotor) newErrors.numeroMotor = "El número de motor es obligatorio"
    if (!vehiculo.numeroChasis) newErrors.numeroChasis = "El número de chasis es obligatorio"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)

      // Simular tiempo de procesamiento
      setTimeout(() => {
        const newId = `new-${Date.now()}`
        const newVehiculo: VehiculoData = {
          id: newId,
          patente: vehiculo.patente || "",
          modelo: vehiculo.modelo || "",
          anio: vehiculo.anio || "",
          numeroMotor: vehiculo.numeroMotor || "",
          numeroChasis: vehiculo.numeroChasis || "",
          kmActual: "0",
        }

        addVehiculo(newVehiculo)
        setIsSubmitting(false)
        setIsSuccess(true)

        // Redirigir después de mostrar mensaje de éxito
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }, 1000)
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-lg mx-auto shadow-lg border-t-4 border-t-green-500">
        <CardContent className="pt-6 pb-6 text-center">
          <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl mb-2">¡Vehículo registrado con éxito!</CardTitle>
          <CardDescription className="mb-4">
            Tu vehículo ha sido registrado correctamente y ya puedes acceder al servicio de mantenimiento.
          </CardDescription>
          <p className="text-sm text-gray-500">Redirigiendo al dashboard...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="mb-4 flex items-center text-gray-600"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Volver al dashboard
      </Button>

      <Card className="shadow-lg border-t-4 border-t-[#004aad]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#004aad]">Registrar nuevo vehículo</CardTitle>
          <CardDescription>Complete los datos del vehículo para registrarlo en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patente">
                Patente <span className="text-red-500">*</span>
              </Label>
              <Input
                id="patente"
                value={vehiculo.patente || ""}
                onChange={(e) => handleChange("patente", e.target.value)}
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
                value={vehiculo.modelo || ""}
                onChange={(e) => handleChange("modelo", e.target.value)}
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
                value={vehiculo.anio || ""}
                onChange={(e) => handleChange("anio", e.target.value)}
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
                value={vehiculo.numeroMotor || ""}
                onChange={(e) => handleChange("numeroMotor", e.target.value)}
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
                value={vehiculo.numeroChasis || ""}
                onChange={(e) => handleChange("numeroChasis", e.target.value)}
                placeholder="Número de chasis"
              />
              {errors.numeroChasis && <p className="text-sm text-red-500">{errors.numeroChasis}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full bg-[#004aad] hover:bg-[#003a8a]" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar vehículo"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
