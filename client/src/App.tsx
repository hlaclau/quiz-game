import { Header } from '@/components/Header'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">Hello World</h1>
        </div>
      </main>
    </div>
  )
}

export default App
