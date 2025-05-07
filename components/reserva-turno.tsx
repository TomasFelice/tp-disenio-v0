"use client"

import { useState } from "react"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ClienteEmpresa from "./pasos/cliente-empresa"
import SeleccionVehiculo from "./pasos/seleccion-vehiculo"
import SeleccionServicio from "./pasos/seleccion-servicio"
import SeleccionConcesionario from "./pasos/seleccion-concesionario"
import DatosRetiro from "./pasos/datos-retiro"
import MedioPago from "./pasos/medio-pago"
import Confirmacion from "./pasos/confirmacion"
import { useRouter } from "next/navigation"

export type VehiculoData = {
  id: string
  patente: string
  modelo: string
  anio: string
  numeroMotor?: string
  numeroChasis?: string
  ultimoKm?: string
  kmActual?: string
  fecha?: Date
  hora?: string
  personaRetiro?: {
    nombre: string
    apellido: string
    dni: string
  }
}

export type FormData = {
  // Cliente
  tipoDocumento: string
  numeroDocumento: string
  razonSocial: string
  nombreCompleto: string
  email: string
  telefono: string
  domicilio: string

  // Vehículos
  vehiculos: VehiculoData[]

  // Concesionario
  concesionario: string
  ubicacionActual: string
  ubicacionSeleccionada: string

  // Medio de pago
  medioPago: string
  cuentaCorriente?: {
    numero: string
    limite: string
    saldo: string
  }
}

const pasos = [
  "Datos del Cliente",
  "Selección del Vehículo",
  "Selección del Servicio",
  "Selección del Concesionario",
  "Datos del Retiro",
  "Medio de Pago",
  "Confirmación",
]

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

export default function ReservaTurno() {
  const router = useRouter()
  const [pasoActual, setPasoActual] = useState(0)
  // Inicializar el estado con los datos de muestra
  const [formData, setFormData] = useState<FormData>({
    // Cliente - datos precargados
    tipoDocumento: clienteMuestra.tipoDocumento,
    numeroDocumento: clienteMuestra.numeroDocumento,
    razonSocial: clienteMuestra.razonSocial,
    nombreCompleto: clienteMuestra.nombreCompleto,
    email: clienteMuestra.email,
    telefono: clienteMuestra.telefono,
    domicilio: clienteMuestra.domicilio,

    // Resto de datos iniciales
    vehiculos: [],
    concesionario: "",
    ubicacionActual: clienteMuestra.domicilio,
    ubicacionSeleccionada: "",
    medioPago: "Cuenta Corriente",
    duenioRetira: true,
    nombreRetiro: "",
    apellidoRetiro: "",
    dniRetiro: "",
    cuentaCorriente: {
      numero: "",
      limite: "",
      saldo: "",
    },
  })

  const [completado, setCompletado] = useState(false)

  const actualizarFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const siguientePaso = () => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual((prev) => prev + 1)
    } else {
      setCompletado(true)
    }
  }

  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual((prev) => prev - 1)
    }
  }

  const renderPaso = () => {
    switch (pasoActual) {
      case 0:
        return <ClienteEmpresa formData={formData} actualizarFormData={actualizarFormData} />
      case 1:
        return <SeleccionVehiculo formData={formData} actualizarFormData={actualizarFormData} />
      case 2:
        return <SeleccionServicio formData={formData} actualizarFormData={actualizarFormData} />
      case 3:
        return <SeleccionConcesionario formData={formData} actualizarFormData={actualizarFormData} />
      case 4:
        return <DatosRetiro formData={formData} actualizarFormData={actualizarFormData} />
      case 5:
        return <MedioPago formData={formData} actualizarFormData={actualizarFormData} />
      case 6:
        return <Confirmacion formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#004aad]">Reserva de Turno</h1>
        <p className="text-gray-600 mt-2">Servicio por km/mantenimiento</p>
      </div>

      {!completado ? (
        <>
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {pasos.map((paso, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index < pasoActual
                        ? "bg-[#38b6ff] text-white"
                        : index === pasoActual
                          ? "bg-[#004aad] text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < pasoActual ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className="text-xs mt-1 hidden md:block">{paso}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-[#38b6ff]"
                style={{ width: `${(pasoActual / (pasos.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="shadow-lg border-t-4 border-t-[#004aad]">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4 text-[#004aad]">{pasos[pasoActual]}</h2>
              {renderPaso()}

              <div className="flex justify-between mt-8">
                {pasoActual === 0 ? (
                  <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex items-center">
                    <ChevronLeft className="mr-1 h-4 w-4" /> Volver al inicio
                  </Button>
                ) : (
                  <Button variant="outline" onClick={pasoAnterior} className="flex items-center">
                    <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                  </Button>
                )}
                <Button onClick={siguientePaso} className="bg-[#004aad] hover:bg-[#003a8a] flex items-center">
                  {pasoActual === pasos.length - 1 ? "Confirmar" : "Siguiente"}{" "}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="shadow-lg border-t-4 border-t-[#38b6ff] text-center p-8">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#004aad] mb-2">¡Turno Confirmado!</h2>
          <p className="text-gray-600 mb-6">
            Hemos enviado un correo electrónico a {formData.email} con todos los detalles de su reserva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="border-[#004aad] text-[#004aad] hover:bg-[#004aad] hover:text-white"
            >
              Volver al inicio
            </Button>
            <Button
              onClick={() => {
                setCompletado(false)
                setPasoActual(0)
                setFormData({
                  tipoDocumento: clienteMuestra.tipoDocumento,
                  numeroDocumento: clienteMuestra.numeroDocumento,
                  razonSocial: clienteMuestra.razonSocial,
                  nombreCompleto: clienteMuestra.nombreCompleto,
                  email: clienteMuestra.email,
                  telefono: clienteMuestra.telefono,
                  domicilio: clienteMuestra.domicilio,
                  vehiculos: [],
                  concesionario: "",
                  ubicacionActual: clienteMuestra.domicilio,
                  ubicacionSeleccionada: "",
                  medioPago: "Cuenta Corriente",
                  duenioRetira: true,
                  nombreRetiro: "",
                  apellidoRetiro: "",
                  dniRetiro: "",
                  cuentaCorriente: {
                    numero: "",
                    limite: "",
                    saldo: "",
                  },
                })
              }}
              className="bg-[#004aad] hover:bg-[#003a8a]"
            >
              Realizar nueva reserva
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
