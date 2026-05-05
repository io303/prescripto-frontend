import React, { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import AdminNavbar from '../../components/AdminNavbar'
import DoctorSidebar from '../../components/DoctorSidebar'
import axios from 'axios'
import { toast } from 'react-toastify'

const CreateMedicalReport = () => {
  const { appointmentId } = useParams()
  const { dToken, backendUrl } = useContext(DoctorContext)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ])

  const [form, setForm] = useState({
    chiefComplaint: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: '',
    admitDate: new Date().toISOString().split('T')[0],
    dischargeDate: new Date().toISOString().split('T')[0],
    bloodPressure: '',
    temperature: '',
    pulse: '',
    weight: '',
    medicineCharges: '',
    otherCharges: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  const removeMedicine = (idx) => setMedicines(medicines.filter((_, i) => i !== idx))
  const updateMedicine = (idx, field, value) => {
    const updated = [...medicines]
    updated[idx][field] = value
    setMedicines(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const validMedicines = medicines.filter(m => m.name.trim())
      const { data } = await axios.post(
        `${backendUrl}/api/report/create`,
        { ...form, appointmentId, medicines: validMedicines },
        { headers: { dtoken: dToken } }
      )
      if (data.success) {
        toast.success('Medical report created!')
        navigate('/doctor/appointments')
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  const InputField = ({ label, name, type = 'text', placeholder, required }) => (
    <div>
      <label className="text-sm text-gray-600 font-medium mb-1 block">{label} {required && <span className="text-red-400">*</span>}</label>
      <input type={type} name={name} value={form[name]} onChange={handleChange}
        placeholder={placeholder} required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition" />
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">←</button>
            <h1 className="text-xl font-bold text-gray-800">Create Medical Report</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">

            {/* ── Section 1: Dates ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">1</span>
                Admission Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Admit Date" name="admitDate" type="date" required />
                <InputField label="Discharge Date" name="dischargeDate" type="date" />
              </div>
            </div>

            {/* ── Section 2: Vitals ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">2</span>
                Patient Vitals
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <InputField label="Blood Pressure" name="bloodPressure" placeholder="120/80 mmHg" />
                <InputField label="Temperature" name="temperature" placeholder="98.6°F" />
                <InputField label="Pulse" name="pulse" placeholder="72 bpm" />
                <InputField label="Weight" name="weight" placeholder="70 kg" />
              </div>
            </div>

            {/* ── Section 3: Diagnosis ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">3</span>
                Medical Details
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium mb-1 block">Chief Complaint <span className="text-red-400">*</span></label>
                  <input name="chiefComplaint" value={form.chiefComplaint} onChange={handleChange} required
                    placeholder="e.g. Fever and body ache for 3 days"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium mb-1 block">Diagnosis <span className="text-red-400">*</span></label>
                  <input name="diagnosis" value={form.diagnosis} onChange={handleChange} required
                    placeholder="e.g. Viral Fever, Typhoid, Dengue"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium mb-1 block">Symptoms</label>
                  <textarea name="symptoms" value={form.symptoms} onChange={handleChange} rows={2}
                    placeholder="e.g. High fever, headache, fatigue, loss of appetite"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition resize-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium mb-1 block">Treatment Given</label>
                  <textarea name="treatment" value={form.treatment} onChange={handleChange} rows={2}
                    placeholder="e.g. IV fluids, antipyretics, bed rest advised"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition resize-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium mb-1 block">Doctor's Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                    placeholder="Additional notes, follow-up instructions..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition resize-none" />
                </div>
              </div>
            </div>

            {/* ── Section 4: Medicines ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  Medicines Prescribed
                </h2>
                <button type="button" onClick={addMedicine}
                  className="text-sm bg-blue-50 text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition">
                  + Add Medicine
                </button>
              </div>
              <div className="space-y-4">
                {medicines.map((med, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500">Medicine {idx + 1}</span>
                      {medicines.length > 1 && (
                        <button type="button" onClick={() => removeMedicine(idx)}
                          className="text-red-400 hover:text-red-600 text-xs">✕ Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { field: 'name', placeholder: 'Medicine name', label: 'Name' },
                        { field: 'dosage', placeholder: '500mg', label: 'Dosage' },
                        { field: 'frequency', placeholder: '2x daily', label: 'Frequency' },
                        { field: 'duration', placeholder: '7 days', label: 'Duration' },
                        { field: 'instructions', placeholder: 'After meals', label: 'Instructions' },
                      ].map(({ field, placeholder, label }) => (
                        <div key={field}>
                          <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                          <input
                            value={med[field]} onChange={e => updateMedicine(idx, field, e.target.value)}
                            placeholder={placeholder}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary transition" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 5: Charges ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold">5</span>
                Bill Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Medicine Charges (₹)" name="medicineCharges" type="number" placeholder="0" />
                <InputField label="Other Charges (₹)" name="otherCharges" type="number" placeholder="0" />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
                {loading ? 'Creating Report...' : '📄 Create Medical Report'}
              </button>
              <button type="button" onClick={() => navigate(-1)}
                className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:border-gray-300 transition">
                Cancel
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default CreateMedicalReport
