"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Calendar, ClipboardList, Settings, LogOut, User, Bell } from "lucide-react"

export default function DashboardHome() {
  const router = useRouter()

  const menuItems = [
    {
      title: "Servicio por km/mantenimiento",
      description: "Reserva un turno para el mantenimiento de tu vehículo",
      icon: <Car className="h-10 w-10 text-[#004aad]" />,
      action: () => router.push("/reserva-turno"),
    },
    {
      title: "Mis turnos",
      description: "Consulta y gestiona tus turnos reservados",
      icon: <Calendar className="h-10 w-10 text-[#004aad]" />,
      action: () => {},
    },
    {
      title: "Historial de servicios",
      description: "Revisa el historial de servicios de tus vehículos",
      icon: <ClipboardList className="h-10 w-10 text-[#004aad]" />,
      action: () => {},
    },
    {
      title: "Configuración",
      description: "Administra tu cuenta y preferencias",
      icon: <Settings className="h-10 w-10 text-[#004aad]" />,
      action: () => {},
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#004aad]">Bienvenido, Juan</h1>
          <p className="text-gray-600 mt-1">¿Qué deseas hacer hoy?</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <User className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <LogOut className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-blue-50">{item.icon}</div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button onClick={item.action} className="w-full bg-[#004aad] hover:bg-[#003a8a]">
                Acceder
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
