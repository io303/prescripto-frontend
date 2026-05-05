import React, { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import AdminNavbar from '../../components/AdminNavbar'
import DoctorSidebar from '../../components/DoctorSidebar'
import axios from 'axios'
import { toast } from 'react-toastify'

const CreateReport = () => {
  const { appointmentId } = useParams()
  const { dToken, backendUrl } = useContext(DoctorContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    chiefComplaint: '', diagnosis: '', symptoms: '',
    treatment: '', notes: '',
    admitDate: '', dischargeDate: '', visitType: 'Outpatient',
    consultationFee: '', medicineCost: '', otherCharges: '',
    followUpDate: '', followUpNotes: '',
  })

  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleMedicineChange = (idx, field, value) => {
    const updated = [...medicines]
    updated[idx][field] = value
    setMedicines(updated)
  }

  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }])
  const removeMedicine = (idx) => setMedicines(medicines.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.diagnosis) return toast.error('Diagnosis is required!')
    setLoading(true)
    try {
      const total = (Number(form.consultationFee) || 0) + (Number(form.medicineCost) || 0) + (Number(form.otherCharges) || 0)
      const { data } = await axios.post(
        `${backendUrl}/api/report/create`,
        { ...form, appointmentId, medicines: medicines.filter(m => m.name), totalAmount: total },
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

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
  const labelClass = "text-sm text-gray-600 font-medium mb-1 block"

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">←</button>
              <h1 className="text-xl font-bold text-gray-800">Create Medical Report</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Visit Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-50 text-primary rounded-full flex items-center justify-center text-xs">1</span>
                  Visit Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Visit Type</label>
                    <select name="visitType" value={form.visitType} onChange={handleChange} className={inputClass}>
                      <option>Outpatient</option>
                      <option>Inpatient</option>
                      <option>Emergency</option>
                      <option>Follow Up</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Admit / Visit Date</label>
                    <input type="text" name="admitDate" value={form.admitDate} onChange={handleChange}
                      placeholder="e.g. 05/04/2025" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Discharge Date</label>
                    <input type="text" name="dischargeDate" value={form.dischargeDate} onChange={handleChange}
                      placeholder="Leave blank if same day" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-50 text-primary rounded-full flex items-center justify-center text-xs">2</span>
                  Medical Details
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Chief Complaint</label>
                      <input name="chiefComplaint" value={form.chiefComplaint} onChange={handleChange}
                        placeholder="Main reason for visit" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Symptoms</label>
                      <input name="symptoms" value={form.symptoms} onChange={handleChange}
                        placeholder="e.g. Fever, cough, headache" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Diagnosis / Disease <span className="text-red-400">*</span></label>
                    <input name="diagnosis" value={form.diagnosis} onChange={handleChange} required
                      placeholder="e.g. Viral fever, Type 2 Diabetes" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Treatment Given</label>
                    <textarea name="treatment" value={form.treatment} onChange={handleChange} rows={3}
                      placeholder="Describe treatment provided..." className={inputClass + ' resize-none'} />
                  </div>
                  <div>
                    <label className={labelClass}>Doctor Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                      placeholder="Additional observations or instructions..." className={inputClass + ' resize-none'} />
                  </div>
                </div>
              </div>

              {/* Medicines */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-50 text-primary rounded-full flex items-center justify-center text-xs">3</span>
                    Prescribed Medicines
                  </h2>
                  <button type="button" onClick={addMedicine}
                    className="text-xs bg-blue-50 text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition">
                    + Add Medicine
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {medicines.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-3 items-center bg-gray-50 p-3 rounded-xl">
                      <input value={med.name} onChange={e => handleMedicineChange(idx, 'name', e.target.value)}
                        placeholder="Medicine name" className={inputClass} />
                      <input value={med.dosage} onChange={e => handleMedicineChange(idx, 'dosage', e.target.value)}
                        placeholder="Dosage (500mg)" className={inputClass} />
                      <input value={med.frequency} onChange={e => handleMedicineChange(idx, 'frequency', e.target.value)}
                        placeholder="Twice a day" className={inputClass} />
                      <div className="flex gap-2 items-center">
                        <input value={med.duration} onChange={e => handleMedicineChange(idx, 'duration', e.target.value)}
                          placeholder="7 days" className={inputClass} />
                        {medicines.length > 1 && (
                          <button type="button" onClick={() => removeMedicine(idx)}
                            className="text-red-400 hover:text-red-600 text-lg shrink-0">×</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-50 text-primary rounded-full flex items-center justify-center text-xs">4</span>
                  Billing
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Consultation Fee (₹)', name: 'consultationFee', ph: '500' },
                    { label: 'Medicine Cost (₹)', name: 'medicineCost', ph: '200' },
                    { label: 'Other Charges (₹)', name: 'otherCharges', ph: '0' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className={labelClass}>{f.label}</label>
                      <input type="number" name={f.name} value={form[f.name]} onChange={handleChange}
                        placeholder={f.ph} className={inputClass} />
                    </div>
                  ))}
                </div>
                {(form.consultationFee || form.medicineCost || form.otherCharges) && (
                  <div className="mt-3 bg-blue-50 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Total Amount</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{(Number(form.consultationFee) || 0) + (Number(form.medicineCost) || 0) + (Number(form.otherCharges) || 0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Follow Up */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-50 text-primary rounded-full flex items-center justify-center text-xs">5</span>
                  Follow Up (Optional)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Next Visit Date</label>
                    <input type="text" name="followUpDate" value={form.followUpDate} onChange={handleChange}
                      placeholder="e.g. 15/04/2025" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Follow Up Notes</label>
                    <input name="followUpNotes" value={form.followUpNotes} onChange={handleChange}
                      placeholder="Instructions for next visit" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pb-6">
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
          </div>
        </main>
      </div>
    </div>
  )
}

export default CreateReport
