"use client"
import type { FormData } from "../reserva-turno"
import { InfoIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SeleccionServicioProps {
  formData: FormData
  actualizarFormData: (data: Partial<FormData>) => void
}

// Datos de ejemplo para precios de servicios según kilometraje
const preciosServicios = [
  { min: 1001, max: 10000, precio: 35000 },
  { min: 10001, max: 20000, precio: 40000 },
  { min: 20001, max: 30000, precio: 45000 },
  { min: 30001, max: 40000, precio: 50000 },
  { min: 40001, max: 50000, precio: 55000 },
  { min: 50001, max: 60000, precio: 60000 },
  { min: 60001, max: 70000, precio: 65000 },
  { min: 70001, max: 80000, precio: 70000 },
  { min: 80001, max: 90000, precio: 75000 },
  { min: 90001, max: 100000, precio: 80000 },
  { min: 100001, max: 110000, precio: 85000 },
  { min: 110001, max: 120000, precio: 90000 },
  { min: 120001, max: 130000, precio: 95000 },
  { min: 130001, max: 140000, precio: 100000 },
  { min: 140001, max: 150000, precio: 105000 },
]

// Opciones de kilometraje para el select
const opcionesKilometraje = [
  { value: "1000", label: "< 1.000 km" },
  { value: "10000", label: "< 10.000 km" },
  { value: "20000", label: "< 20.000 km" },
  { value: "30000", label: "< 30.000 km" },
  { value: "40000", label: "< 40.000 km" },
  { value: "50000", label: "< 50.000 km" },
  { value: "60000", label: "< 60.000 km" },
  { value: "70000", label: "< 70.000 km" },
  { value: "80000", label: "< 80.000 km" },
  { value: "90000", label: "< 90.000 km" },
  { value: "100000", label: "< 100.000 km" },
  { value: "110000", label: "< 110.000 km" },
  { value: "120000", label: "< 120.000 km" },
  { value: "130000", label: "< 130.000 km" },
  { value: "140000", label: "< 140.000 km" },
  { value: "150000", label: "< 150.000 km" },
]

export default function SeleccionServicio({ formData, actualizarFormData }: SeleccionServicioProps) {
  const calcularPrecioServicio = (km: number) => {
    if (km <= 1000) {
      return 0
    }
    if (km > 150000) {
      return Number.NaN
    }
    const servicio = preciosServicios.find((s) => km >= s.min && km <= s.max)
    return servicio ? servicio.precio : 0
  }

  const handleKilometrajeChange = (index: number, value: string) => {
    const updatedVehiculos = [...formData.vehiculos]
    updatedVehiculos[index].kmActual = value
    actualizarFormData({ vehiculos: updatedVehiculos })
  }

  const calcularPrecioTotal = () => {
    let total = 0
    formData.vehiculos.forEach((vehiculo) => {
      const km = Number(vehiculo.kmActual)
      if (!isNaN(km)) {
        const precio = calcularPrecioServicio(km)
        if (!isNaN(precio)) {
          total += precio
        }
      }
    })
    return total
  }

  const precioTotal = calcularPrecioTotal()

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex items-start">
        <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-800">Tipo de servicio</h3>
          <p className="text-blue-700">Servicio por km/mantenimiento</p>
        </div>
      </div>

      {formData.vehiculos.length > 0 ? (
        <>
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#004aad]">Selección de kilometraje</h3>
            <p className="text-gray-600 mb-4">
              Seleccione el kilometraje actual de cada vehículo utilizando las opciones disponibles.
            </p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patente</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Último km registrado</TableHead>
                  <TableHead>Km actual</TableHead>
                  <TableHead>Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.vehiculos.map((vehiculo, index) => {
                  const kmActual = Number(vehiculo.kmActual) || 10000
                  const ultimoKm = Number(vehiculo.ultimoKm || 0)
                  const kmMenorAlUltimo = kmActual < ultimoKm
                  const precio = calcularPrecioServicio(kmActual)

                  return (
                    <TableRow key={index}>
                      <TableCell>{vehiculo.patente}</TableCell>
                      <TableCell>{vehiculo.modelo}</TableCell>
                      <TableCell>{vehiculo.ultimoKm || "N/A"}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Select
                            value={vehiculo.kmActual || "10000"}
                            onValueChange={(value) => handleKilometrajeChange(index, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Seleccione kilometraje" />
                            </SelectTrigger>
                            <SelectContent>
                              {opcionesKilometraje.map((opcion) => (
                                <SelectItem
                                  key={opcion.value}
                                  value={opcion.value}
                                  disabled={Number(opcion.value) < ultimoKm}
                                >
                                  {opcion.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {kmMenorAlUltimo && (
                            <p className="text-xs text-red-500">
                              El km actual no puede ser menor al último registrado ({ultimoKm} km)
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[#004aad]">
                          {!isNaN(precio) ? `$${precio.toLocaleString("es-AR")}` : "No disponible"}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h3 className="font-semibold text-[#004aad] mb-2">Precio total del servicio</h3>
            <p className="text-2xl font-bold text-[#004aad]">
              $
              {precioTotal.toLocaleString("es-AR", {
                minimumFractionDigits: 0,
              })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Precio calculado según el kilometraje seleccionado para todos los vehículos
            </p>
          </div>
        </>
      ) : (
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-amber-800">
          <p>No hay vehículos seleccionados. Por favor, vuelva al paso anterior y seleccione al menos un vehículo.</p>
        </div>
      )}
    </div>
  )
}
