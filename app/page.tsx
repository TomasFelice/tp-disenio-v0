import LoginForm from "@/components/login-form"

export default function Home() {
  // In a real app, we would check if the user is authenticated
  // For demo purposes, we'll just redirect to the login page
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container max-w-md mx-auto py-8 px-4">
        <LoginForm />
      </div>
    </main>
  )
}
