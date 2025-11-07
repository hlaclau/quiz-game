import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto py-8 flex-1">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">Hello World</h1>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
