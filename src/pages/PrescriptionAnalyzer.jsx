import React, { useState, useContext, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const PrescriptionAnalyzer = () => {
  const { backendUrl } = useContext(AppContext)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleAnalyze = async () => {
    if (!image) return toast.warning('Please upload a prescription image')
    setLoading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('prescription', image)
      const { data } = await axios.post(`${backendUrl}/api/ai/analyze-prescription`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (data.success) {
        setResult(data.result)
        toast.success('Prescription analyzed successfully!')
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  const readabilityColor = {
    Good: 'bg-green-50 text-green-700',
    Fair: 'bg-yellow-50 text-yellow-700',
    Poor: 'bg-red-50 text-red-700',
  }

  return (
    <div className="py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
          <span>📸</span> OCR + AI Analysis
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Prescription Analyzer</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Upload your prescription photo and AI will extract medicines, explain dosages, and highlight important information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — Upload */}
        <div className="flex flex-col gap-4">

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-primary bg-blue-50'
                : preview
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-primary hover:bg-blue-50'
            }`}
          >
            <input ref={fileRef} type="file" accept="image/*" hidden
              onChange={e => handleFile(e.target.files[0])} />

            {preview ? (
              <div>
                <img src={preview} alt="prescription"
                  className="max-h-64 mx-auto rounded-xl object-contain mb-3 shadow-sm" />
                <p className="text-green-600 font-medium text-sm">✓ Image uploaded</p>
                <p className="text-gray-400 text-xs mt-1">Click to change</p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">📋</div>
                <p className="font-semibold text-gray-700 mb-1">Drop prescription here</p>
                <p className="text-gray-400 text-sm mb-3">or click to browse</p>
                <p className="text-xs text-gray-300">Supports JPG, PNG, HEIC</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <h4 className="font-bold text-gray-700 mb-3 text-sm">📸 Tips for best results:</h4>
            <ul className="flex flex-col gap-1.5">
              {[
                'Take photo in good lighting',
                'Keep prescription flat and unwrinkled',
                'Ensure all text is clearly visible',
                'Avoid shadows on the prescription',
                'Take close-up shot of the medicine list',
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-primary">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Analyze Button */}
          <button onClick={handleAnalyze} disabled={loading || !image}
            className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <><span className="animate-spin">⟳</span> Analyzing Prescription...</>
            ) : (
              <><span>🔬</span> Analyze Prescription</>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            🔒 Your prescription is processed securely and not stored.
          </p>
        </div>

        {/* RIGHT — Results */}
        <div className="flex flex-col gap-4">
          {!result && !loading && (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full min-h-64">
              <div className="text-5xl mb-4">🔬</div>
              <p className="font-semibold text-gray-600">Upload a prescription to analyze</p>
              <p className="text-gray-400 text-sm mt-1">AI will extract and explain all medicines</p>
            </div>
          )}

          {loading && (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 min-h-64">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Reading prescription...</p>
              <p className="text-gray-400 text-sm">Extracting medicine details</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[800px] pr-1">

              {/* Patient & Doctor Info */}
              {(result.patientInfo?.name || result.patientInfo?.doctorName) && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    👤 Prescription Info
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Patient', result.patientInfo?.name],
                      ['Doctor', result.patientInfo?.doctorName],
                      ['Date', result.patientInfo?.date],
                      ['Hospital', result.patientInfo?.hospitalClinic],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                  {result.diagnosis && (
                    <div className="mt-3 bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Diagnosis</p>
                      <p className="text-sm font-bold text-primary">{result.diagnosis}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Summary + Readability */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-700">📊 Summary</h3>
                  {result.readabilityScore && (
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${readabilityColor[result.readabilityScore] || 'bg-gray-100 text-gray-600'}`}>
                      {result.readabilityScore} Readability
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{result.summary}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">{result.totalMedicines || result.medicines?.length || 0}</span>
                  <span className="text-sm text-gray-500">Medicines prescribed</span>
                </div>
              </div>

              {/* Medicines */}
              {result.medicines?.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <h3 className="font-bold text-gray-700 mb-4">💊 Medicines</h3>
                  <div className="flex flex-col gap-4">
                    {result.medicines.map((med, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-800">{med.name}</h4>
                            {med.genericName && (
                              <p className="text-xs text-gray-400">{med.genericName}</p>
                            )}
                          </div>
                          <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
                            #{i + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {[
                            ['💊', 'Dosage', med.dosage],
                            ['⏰', 'Frequency', med.frequency],
                            ['📅', 'Duration', med.duration],
                          ].map(([icon, label, value]) => value && (
                            <div key={label} className="bg-gray-50 rounded-lg p-2 text-center">
                              <p className="text-base">{icon}</p>
                              <p className="text-xs text-gray-400">{label}</p>
                              <p className="text-xs font-semibold text-gray-700">{value}</p>
                            </div>
                          ))}
                        </div>

                        {med.purpose && (
                          <div className="bg-blue-50 rounded-lg px-3 py-2 mb-2">
                            <p className="text-xs text-gray-500 mb-0.5">Purpose</p>
                            <p className="text-xs text-gray-700">{med.purpose}</p>
                          </div>
                        )}

                        {med.instructions && (
                          <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg mb-2">
                            <span>⚠️</span> {med.instructions}
                          </div>
                        )}

                        {med.sideEffects?.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Common side effects:</p>
                            <div className="flex flex-wrap gap-1">
                              {med.sideEffects.map(s => (
                                <span key={s} className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.warnings?.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <h3 className="font-bold text-red-700 mb-3">⚠️ Drug Warnings</h3>
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-sm text-red-600 flex items-start gap-2">
                      <span>•</span> {w}
                    </p>
                  ))}
                </div>
              )}

              {/* Tests + Follow up */}
              <div className="grid grid-cols-2 gap-3">
                {result.tests?.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <h4 className="font-bold text-gray-700 mb-2 text-sm">🔬 Tests Ordered</h4>
                    {result.tests.map((t, i) => (
                      <p key={i} className="text-xs text-gray-600">• {t}</p>
                    ))}
                  </div>
                )}
                {result.followUpDate && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <h4 className="font-bold text-green-700 mb-2 text-sm">📅 Follow Up</h4>
                    <p className="text-sm font-bold text-green-800">{result.followUpDate}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrescriptionAnalyzer
