"use client"

import type { FormData } from "../reserva-turno"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Check } from "lucide-react"

interface ConfirmacionProps {
  formData: FormData
}

export default function Confirmacion({ formData }: ConfirmacionProps) {
  // Función para obtener el nombre del concesionario según su ID
  const getNombreConcesionario = (id: string) => {
    const concesionarios = [
      { id: "1", nombre: "Concesionaria Central" },
      { id: "2", nombre: "Concesionaria Norte" },
      { id: "3", nombre: "Concesionaria Sur" },
    ]
    return concesionarios.find((c) => c.id === id)?.nombre || id
  }

  // Función para obtener el nombre del vehículo según su ID
  const getNombreVehiculo = (id: string) => {
    const vehiculos = [
      { id: "1", nombre: "Toyota Hilux (AB123CD)" },
      { id: "2", nombre: "Ford Ranger (XY987ZW)" },
      { id: "3", nombre: "Volkswagen Amarok (LM456NO)" },
    ]
    return vehiculos.find((v) => v.id === id)?.nombre || "Vehículo nuevo"
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#f8fafc] p-5 rounded-lg border">
        <h3 className="font-bold text-lg text-[#004aad] mb-4">Resumen de la reserva</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-[#38b6ff]">Datos del cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-sm text-gray-500">Razón Social</p>
                <p className="font-medium">{formData.razonSocial || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CUIT</p>
                <p className="font-medium">{formData.cuit || formData.numeroDocumento || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{formData.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{formData.telefono || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Domicilio</p>
                <p className="font-medium">{formData.domicilio || "N/A"}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#38b6ff]">Datos del vehículo</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {formData.vehiculoExistente ? (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Vehículo seleccionado</p>
                  <p className="font-medium">{getNombreVehiculo(formData.vehiculoSeleccionado || "")}</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Patente</p>
                    <p className="font-medium">{formData.patente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Modelo</p>
                    <p className="font-medium">{formData.modelo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Año</p>
                    <p className="font-medium">{formData.anio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">N° de motor</p>
                    <p className="font-medium">{formData.numeroMotor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">N° de chasis</p>
                    <p className="font-medium">{formData.numeroChasis}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#38b6ff]">Datos del servicio</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-sm text-gray-500">Tipo de servicio</p>
                <p className="font-medium">{formData.tipoServicio}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kilometraje</p>
                <p className="font-medium">{formData.kilometraje} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Precio del servicio</p>
                <p className="font-medium text-[#004aad]">${Number(formData.precioServicio).toLocaleString("es-AR")}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#38b6ff]">Datos del turno</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-sm text-gray-500">Concesionario</p>
                <p className="font-medium">{getNombreConcesionario(formData.concesionario)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha y hora</p>
                <p className="font-medium">
                  {formData.fecha ? format(formData.fecha, "PPP", { locale: es }) : ""} - {formData.hora} hs
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#38b6ff]">Datos de retiro</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {formData.duenioRetira ? (
                <div className="md:col-span-2">
                  <p className="font-medium flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    El dueño retirará el vehículo
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Nombre y apellido</p>
                    <p className="font-medium">
                      {formData.nombreRetiro} {formData.apellidoRetiro}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">DNI</p>
                    <p className="font-medium">{formData.dniRetiro}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#38b6ff]">Medio de pago</h4>
            <div className="mt-2">
              <p className="font-medium">{formData.medioPago}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
