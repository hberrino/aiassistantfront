import { useState, useEffect } from 'react'

function App() {
  const [cvText, setCvText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [showHowToUse, setShowHowToUse] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Cerrar modal con tecla Escape y prevenir scroll del body
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (analysis) {
          setAnalysis(null)
        }
        if (showHowToUse) {
          setShowHowToUse(false)
        }
      }
    }
    
    if (analysis || showHowToUse) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [analysis, showHowToUse])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setIsDark(shouldUseDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch('https://asistenteai-rayq.onrender.com/api/recruiter/analyze', {
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
      // El modal se mostrará automáticamente cuando analysis tenga datos
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const scrollToAnalyzer = () => {
    const analyzerSection = document.getElementById('analysis-form')
    if (analyzerSection) {
      analyzerSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero / Landing */}
        <section className="mb-12 sm:mb-16 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 sm:px-10 flex items-center justify-between gap-4">
            <p className="text-sm sm:text-base font-medium tracking-wide text-slate-200">
              IA aplicada a reclutamiento y evaluación de perfiles
            </p>
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-100 hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? 'Modo claro' : 'Modo oscuro'}
            </button>
          </div>
          <div className="grid lg:grid-cols-5 gap-8 px-6 py-8 sm:px-10 sm:py-12">
            <div className="lg:col-span-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
                Evaluacion profesional de CV con IA
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                Copias el texto de tu CV, detallas el puesto y recibis un analisis preciso para tomar decisiones mas rapidas, con foco en seniority, fortalezas y brechas del perfil.
              </p>

              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">+50</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">CVs analizados</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">3 pasos</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Proceso simple</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">IA</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Analisis estructurado</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={scrollToAnalyzer}
                  className="inline-flex items-center justify-center bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md border border-slate-900 hover:bg-slate-800 transition-all duration-200 cursor-pointer dark:bg-white dark:text-slate-900 dark:border-white dark:hover:bg-slate-200"
                >
                  Empezar analisis
                </button>
                <button
                  onClick={() => setShowHowToUse(true)}
                  className="inline-flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-300 hover:border-slate-500 hover:text-slate-900 transition-colors duration-200 cursor-pointer dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:border-slate-500"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Como funciona
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Que resultado esperar</h2>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-900"></span>
                  <span>Porcentaje de coincidencia entre CV y puesto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-900"></span>
                  <span>Estimacion de seniority y resumen profesional.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-900"></span>
                  <span>Habilidades detectadas, fortalezas y areas de mejora.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-900"></span>
                  <span>Recomendaciones accionables para mejorar el match.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="mb-10 grid md:grid-cols-3 gap-4">
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Paso 1</p>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Pegas tu CV</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Copia y pega el texto completo de tu currículum en el primer campo.</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Paso 2</p>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Detallas el puesto</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Especifica responsabilidades, stack y requisitos clave de la posicion.</p>
          </article>
          <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Paso 3</p>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Recibis analisis IA</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Obtene un diagnostico claro para validar fit, seniority y mejoras.</p>
          </article>
        </section>

        {/* Form Card */}
        <form
          id="analysis-form"
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 lg:p-10 mb-8 transition-shadow hover:shadow-xl dark:bg-slate-900 dark:border-slate-700"
        >
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Iniciar analisis</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Completá los campos y obtene una evaluacion precisa del perfil contra el puesto.
            </p>
          </div>
          <div className="space-y-8">
            <div>
              <label htmlFor="cvText" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-wide">
                Texto del CV
              </label>
              <textarea
                id="cvText"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none transition-all text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:bg-slate-800"
                placeholder="Ingrese el contenido completo del curriculum vitae..."
                required
              />
            </div>

            <div>
              <label htmlFor="jobDescription" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-wide">
                Descripción del Puesto
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none transition-all text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:bg-slate-800"
                placeholder="Ingrese la descripción detallada del puesto de trabajo..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg hover:bg-slate-800 active:scale-95 active:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-300 transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:focus:ring-indigo-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando...
                </span>
              ) : (
                'Analizar CV'
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 sm:p-6 rounded-lg mb-8 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-semibold">Error</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        {analysis && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setAnalysis(null)}
          >
            {/* Modal Content */}
            <div 
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 sm:px-8 lg:px-10 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Resultados del Análisis</h2>
                <button
                  onClick={() => setAnalysis(null)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 p-2 rounded-lg hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Cerrar"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 sm:p-8 lg:p-10 space-y-8">
                {/* Header with Match Percentage */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">Coincidencia</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {analysis.matchPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3 shadow-sm"
                        style={{ width: `${analysis.matchPercentage}%` }}
                      >
                        {analysis.matchPercentage > 20 && (
                          <span className="text-xs text-white font-bold">
                            {analysis.matchPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

            {/* Professional Summary and Seniority */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                  Resumen Profesional
                </h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  {analysis.professionalSummary}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-purple-600 rounded-full"></div>
                  Seniority Estimado
                </h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {analysis.estimatedSeniority}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-1 w-8 bg-indigo-600 rounded-full"></div>
                Habilidades Detectadas
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {analysis.detectedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-white border-2 border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths and Gaps */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-green-600 rounded-full"></div>
                  Fortalezas
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-3 border border-green-100">
                      <svg className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="flex-1">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-amber-600 rounded-full"></div>
                  Áreas de Mejora
                </h3>
                <ul className="space-y-3">
                  {analysis.gaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 bg-white/60 rounded-lg p-3 border border-amber-100">
                      <svg className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="flex-1">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-1 w-8 bg-indigo-600 rounded-full"></div>
                Recomendaciones
              </h3>
              <ul className="space-y-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700 bg-white rounded-lg p-4 border border-indigo-100 hover:border-indigo-200 transition-colors">
                    <svg className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="flex-1 font-medium">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Instrucciones */}
        {showHowToUse && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowHowToUse(false)}
          >
            {/* Modal Content */}
            <div 
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 sm:px-8 lg:px-10 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Instrucciones</h2>
                <button
                  onClick={() => setShowHowToUse(false)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 p-2 rounded-lg hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Cerrar"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                  <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                    <p>
                      Copia la información de un archivo tipo CV, o similar. Pégala dentro del apartado <strong className="text-indigo-700">Texto del CV</strong>.
                    </p>
                    <p>
                      Luego en <strong className="text-indigo-700">Descripción del puesto</strong>, indica incluyendo los detalles que consideres importantes, ej: <em className="text-gray-600">Backend Java Developer Spring Boot + AI integration</em>.
                    </p>
                    <p>
                      <strong className="text-indigo-700">Analiza</strong> y descubre si hay buen match.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-slate-300">© Derechos reservados 2026</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Desarrollado por Hernan Berrino</p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/hernanberrino/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 hover:scale-110 active:scale-95"
                aria-label="LinkedIn"
              >
                <img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/hberrino"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 hover:scale-110 active:scale-95"
                aria-label="GitHub"
              >
                <img src="/github.svg" alt="GitHub" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
