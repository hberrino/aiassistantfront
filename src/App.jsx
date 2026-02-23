import { useState } from 'react'

function App() {
  const [cvText, setCvText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch('http://localhost:8080/api/recruiter/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvText: cvText.trim(),
          jobDescription: jobDescription.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Error al analizar el CV')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Asistente IA Reclutador
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="cvText" className="block text-sm font-medium text-gray-700 mb-2">
                Texto del CV
              </label>
              <textarea
                id="cvText"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Pega aquí el contenido del CV..."
                required
              />
            </div>

            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Puesto
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Pega aquí la descripción del puesto de trabajo..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Analizando...' : 'Analizar CV'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {analysis && (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados del Análisis</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Porcentaje de Coincidencia</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-indigo-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${analysis.matchPercentage}%` }}
                    >
                      <span className="text-xs text-white font-semibold">
                        {analysis.matchPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Resumen Profesional</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {analysis.professionalSummary}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Seniority Estimado</h3>
                <p className="text-indigo-600 font-semibold text-xl bg-indigo-50 p-4 rounded-lg">
                  {analysis.estimatedSeniority}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Habilidades Detectadas</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.detectedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-3">Fortalezas</h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-700 mb-3">Áreas de Mejora</h3>
                <ul className="space-y-2">
                  {analysis.gaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-500 mt-1">⚠</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-indigo-700 mb-3">Recomendaciones</h3>
              <ul className="space-y-2 bg-indigo-50 p-4 rounded-lg">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-indigo-500 mt-1">→</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
