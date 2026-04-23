import './App.css'

function App() {
  const port = import.meta.env.PORT || '5000'
  return (
    <>
      <div>
        <h1>Rodando na porta: {port}</h1>
      </div>
    </>
  )
}

export default App
