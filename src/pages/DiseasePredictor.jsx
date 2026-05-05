import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const COMMON_SYMPTOMS = [
  'Fever', 'Headache', 'Cough', 'Cold', 'Fatigue', 'Body Pain',
  'Sore Throat', 'Nausea', 'Vomiting', 'Diarrhea', 'Chest Pain',
  'Shortness of Breath', 'Dizziness', 'Skin Rash', 'Itching',
  'Joint Pain', 'Back Pain', 'Stomach Pain', 'Loss of Appetite',
  'Swelling', 'Runny Nose', 'Eye Irritation', 'Ear Pain', 'Anxiety',
]

const urgencyColors = {
  Emergency: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-600', icon: '🚨' },
  High: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-600', icon: '⚠️' },
  Medium: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-600', icon: '⚡' },
  Low: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-600', icon: '✅' },
}

const probColors = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
}

const DiseasePredictor = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [customSymptom, setCustomSymptom] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [duration, setDuration] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const addCustom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()])
      setCustomSymptom('')
    }
  }

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0)
      return toast.warning('Please select at least one symptom')
    setLoading(true)
    setResult(null)
    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/predict-disease`, {
        symptoms: selectedSymptoms, age, gender, duration,
      })
      if (data.success) setResult(data.result)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  const urgency = result ? urgencyColors[result.urgencyLevel] || urgencyColors.Low : null

  return (
    <div className="py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-3">
          <span>🤖</span> AI-Powered
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Disease Predictor</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Select your symptoms and get AI-powered health insights with doctor recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — Input */}
        <div className="lg:col-span-1 flex flex-col gap-5">

          {/* Patient Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-700 mb-4">Patient Info</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Age</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Duration of symptoms</label>
                <select value={duration} onChange={e => setDuration(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  <option value="">Select</option>
                  <option>Less than 1 day</option>
                  <option>1-3 days</option>
                  <option>3-7 days</option>
                  <option>1-2 weeks</option>
                  <option>More than 2 weeks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <h3 className="font-bold text-gray-700 mb-3 text-sm">
                Selected ({selectedSymptoms.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(s => (
                  <span key={s}
                    className="flex items-center gap-1 bg-primary text-white text-xs px-3 py-1.5 rounded-full">
                    {s}
                    <button onClick={() => toggleSymptom(s)} className="ml-1 hover:opacity-70">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Predict Button */}
          <button onClick={handlePredict} disabled={loading || selectedSymptoms.length === 0}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <><span className="animate-spin">⟳</span> Analyzing...</>
            ) : (
              <><span>🔍</span> Predict Disease</>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            ⚠️ This is for informational purposes only. Always consult a doctor.
          </p>
        </div>

        {/* RIGHT — Symptoms + Results */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Symptom Selector */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-700 mb-4">Select Symptoms</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_SYMPTOMS.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    selectedSymptoms.includes(s)
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
            {/* Custom symptom */}
            <div className="flex gap-2">
              <input value={customSymptom} onChange={e => setCustomSymptom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                placeholder="Add custom symptom..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
              <button onClick={addCustom}
                className="bg-blue-50 text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary hover:text-white transition">
                + Add
              </button>
            </div>
          </div>

          {/* Results */}
          {loading && (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">AI is analyzing your symptoms...</p>
              <p className="text-gray-400 text-sm">This may take a few seconds</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex flex-col gap-4">

              {/* Urgency Alert */}
              <div className={`border rounded-2xl p-4 ${urgency.bg} ${urgency.border}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{urgency.icon}</span>
                  <div>
                    <p className={`font-bold ${urgency.text}`}>
                      {result.urgencyLevel} Priority
                    </p>
                    <p className="text-sm text-gray-600">{result.urgencyMessage}</p>
                  </div>
                </div>
              </div>

              {/* Possible Conditions */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🩺 Possible Conditions
                </h3>
                <div className="flex flex-col gap-3">
                  {result.possibleConditions?.map((c, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-800">{c.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${probColors[c.probability] || probColors.Low}`}>
                          {c.probability} Match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{c.description}</p>
                      {c.symptoms_match?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {c.symptoms_match.map(s => (
                            <span key={s} className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Doctors */}
              {result.recommendedDoctors?.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                    👨‍⚕️ Recommended Doctors
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    See a <strong>{result.recommendedSpeciality}</strong> for your condition
                  </p>
                  <div className="flex flex-col gap-3">
                    {result.recommendedDoctors.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                        <div>
                          <p className="font-semibold text-gray-800">{doc.name}</p>
                          <p className="text-sm text-primary">{doc.speciality}</p>
                          <p className="text-xs text-gray-400">Fee: Rs.{doc.fee}</p>
                        </div>
                        <button
                          onClick={() => doc.id && navigate(`/appointment/${doc.id}`)}
                          className="bg-primary text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-primary-dark transition">
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Home Remedies */}
              {result.homeRemedies?.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-800 mb-3">🌿 Home Remedies</h3>
                  <ul className="flex flex-col gap-2">
                    {result.homeRemedies.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warning Signs */}
              {result.warningSymptoms?.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <h3 className="font-bold text-red-700 mb-3">🚨 Seek Immediate Help If</h3>
                  <ul className="flex flex-col gap-2">
                    {result.warningSymptoms.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                        <span className="mt-0.5">⚠️</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-400 text-center">
                {result.disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiseasePredictor
