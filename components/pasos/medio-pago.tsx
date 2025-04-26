"use client"

import { useState } from "react"
import type { FormData } from "../reserva-turno"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, CreditCard, Wallet, Building, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface MedioPagoProps {
  formData: FormData
  actualizarFormData: (data: Partial<FormData>) => void
}

// Lista de bancos para el desplegable
const bancos = [
  "Banco de la Nación Argentina",
  "Banco Santander",
  "Banco Galicia",
  "Banco BBVA",
  "Banco Macro",
  "Banco HSBC",
  "Banco Credicoop",
  "Banco Ciudad",
  "Banco Provincia",
  "Otro",
]

export default function MedioPago({ formData, actualizarFormData }: MedioPagoProps) {
  const [cuentaCorriente, setCuentaCorriente] = useState({
    titular: formData.razonSocial || formData.nombreCompleto || "",
    banco: formData.cuentaCorriente?.banco || "",
    numero: formData.cuentaCorriente?.numero || "",
    cbu: formData.cuentaCorriente?.cbu || "",
    montoPagar: calcularMontoTotal(),
    cuit: formData.tipoDocumento === "CUIT" ? formData.numeroDocumento : "",
    fechaPago: formData.cuentaCorriente?.fechaPago || new Date(),
    referencia: formData.cuentaCorriente?.referencia || "",
    comprobante: formData.cuentaCorriente?.comprobante || "",
  })

  function calcularMontoTotal() {
    let total = 0
    formData.vehiculos.forEach((vehiculo) => {
      const km = Number(vehiculo.kmActual)
      if (!isNaN(km)) {
        // Simplificado para este ejemplo
        if (km <= 20000) total += 35000
        else if (km <= 40000) total += 45000
        else if (km <= 60000) total += 55000
        else if (km <= 80000) total += 65000
        else if (km <= 100000) total += 75000
        else total += 85000
      }
    })
    return total
  }

  const handleCuentaCorrienteChange = (field: string, value: any) => {
    const updatedCuentaCorriente = { ...cuentaCorriente, [field]: value }
    setCuentaCorriente(updatedCuentaCorriente)
    actualizarFormData({ cuentaCorriente: updatedCuentaCorriente })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Medio de pago</Label>
        <RadioGroup
          value={formData.medioPago}
          onValueChange={(value) => actualizarFormData({ medioPago: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
            <RadioGroupItem value="Cuenta Corriente" id="cuenta-corriente" />
            <Label htmlFor="cuenta-corriente" className="cursor-pointer flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Cuenta Corriente (Clientes corporativos)
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
            <RadioGroupItem value="tarjeta-credito" id="tarjeta-credito" />
            <Label htmlFor="tarjeta-credito" className="cursor-pointer flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Tarjeta de crédito
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
            <RadioGroupItem value="tarjeta-debito" id="tarjeta-debito" />
            <Label htmlFor="tarjeta-debito" className="cursor-pointer flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Tarjeta de débito
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
            <RadioGroupItem value="mercado-pago" id="mercado-pago" />
            <Label htmlFor="mercado-pago" className="cursor-pointer flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-blue-600" />
              Mercado Pago
            </Label>
          </div>
        </RadioGroup>
      </div>

      {formData.medioPago === "Cuenta Corriente" && (
        <Card className="border-l-4 border-l-[#38b6ff]">
          <CardContent className="pt-6">
            <h3 className="font-medium text-lg mb-4">Datos de la cuenta corriente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titular">Titular de la cuenta</Label>
                <Input id="titular" value={cuentaCorriente.titular} readOnly disabled className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banco">
                  Banco <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={cuentaCorriente.banco}
                  onValueChange={(value) => handleCuentaCorrienteChange("banco", value)}
                >
                  <SelectTrigger id="banco">
                    <SelectValue placeholder="Seleccione un banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {bancos.map((banco) => (
                      <SelectItem key={banco} value={banco}>
                        {banco}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCuenta">
                  Número de cuenta corriente <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numeroCuenta"
                  value={cuentaCorriente.numero}
                  onChange={(e) => handleCuentaCorrienteChange("numero", e.target.value)}
                  placeholder="Ingrese el número de cuenta"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cbu">
                  CBU <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cbu"
                  value={cuentaCorriente.cbu}
                  onChange={(e) => handleCuentaCorrienteChange("cbu", e.target.value)}
                  placeholder="Ingrese el CBU"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="montoPagar">Monto a pagar</Label>
                <Input
                  id="montoPagar"
                  value={`$${cuentaCorriente.montoPagar.toLocaleString("es-AR")}`}
                  readOnly
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuit">CUIT</Label>
                <Input id="cuit" value={cuentaCorriente.cuit} readOnly disabled className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaPago">
                  Fecha de pago <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="fechaPago">
                      {cuentaCorriente.fechaPago
                        ? format(cuentaCorriente.fechaPago, "PPP", { locale: es })
                        : "Seleccione una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={cuentaCorriente.fechaPago}
                      onSelect={(date) => handleCuentaCorrienteChange("fechaPago", date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referencia">Referencia o concepto del pago</Label>
                <Input
                  id="referencia"
                  value={cuentaCorriente.referencia}
                  onChange={(e) => handleCuentaCorrienteChange("referencia", e.target.value)}
                  placeholder="Ingrese una referencia (opcional)"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comprobante">
                  Adjuntar comprobante <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="comprobante"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCuentaCorrienteChange("comprobante", e.target.files[0].name)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={() => document.getElementById("comprobante")?.click()}
                  >
                    <Upload size={16} />
                    {cuentaCorriente.comprobante ? cuentaCorriente.comprobante : "Seleccionar archivo"}
                  </Button>
                  {cuentaCorriente.comprobante && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCuentaCorrienteChange("comprobante", "")}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-amber-50 p-4 rounded-md border border-amber-200 flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-800">Importante</h3>
          <p className="text-sm text-amber-700">
            Se podrá aplicar una penalidad del 1.5% diario en caso de falta de pago según la fecha de pago acordada con
            la empresa
          </p>
        </div>
      </div>
    </div>
  )
}
