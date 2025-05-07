import type React from "react"
import "@/app/globals.css"
import { Montserrat } from "next/font/google"
import type { Metadata } from "next"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Reserva de Turnos - Servicio por km/mantenimiento",
  description: "Sistema de reserva de turnos para servicio por km/mantenimiento",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}
