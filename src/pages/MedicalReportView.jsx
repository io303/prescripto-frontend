import React, { useEffect, useState, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MedicalReportView = () => {
  const { reportId } = useParams()
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const printRef = useRef()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/report/appointment/${reportId}`)
      if (data.success) setReport(data.report)
      else toast.error(data.message)
    } catch (error) {
      toast.error('Report not found')
    }
    setLoading(false)
  }

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <html>
        <head>
          <title>Medical Report - ${report?.reportNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #1f2937; font-size: 13px; }
            .no-print { display: none !important; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  )

  if (!report) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">📄</p>
      <p className="text-gray-500">Report not found</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">← Go back</button>
    </div>
  )

  const totalAmount = Number(report.consultationFee || 0) + Number(report.medicineCharges || 0) + Number(report.otherCharges || 0)

  return (
    <div className="py-6 max-w-4xl mx-auto">
      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6 no-print">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
          ← Back
        </button>
        <div className="flex gap-3">
          <button onClick={handlePrint}
            className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition flex items-center gap-2">
            🖨️ Print / Download PDF
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={printRef} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

        {/* Header */}
        <div style={{background: 'linear-gradient(135deg, #3B82F6, #1d4ed8)'}} className="p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Rx</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Prescripto</h1>
                  <p className="text-blue-200 text-sm">Healthcare Services</p>
                </div>
              </div>
              <h2 className="text-xl font-semibold mt-2">Medical Report</h2>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                <p className="text-blue-200 text-xs">Report No.</p>
                <p className="text-white font-bold text-lg">{report.reportNumber}</p>
              </div>
              <p className="text-blue-200 text-xs mt-2">
                Generated: {new Date(report.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">

          {/* Patient & Doctor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Patient */}
            <div className="bg-blue-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                👤 Patient Information
              </h3>
              <div className="space-y-2 text-sm">
                <InfoRow label="Name" value={report.patientName} />
                <InfoRow label="Gender" value={report.patientGender || '—'} />
                <InfoRow label="Date of Birth" value={report.patientAge || '—'} />
                <InfoRow label="Phone" value={report.patientPhone || '—'} />
                <InfoRow label="Address" value={report.patientAddress || '—'} />
              </div>
            </div>

            {/* Doctor */}
            <div className="bg-green-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                👨‍⚕️ Treating Doctor
              </h3>
              <div className="space-y-2 text-sm">
                <InfoRow label="Name" value={`Dr. ${report.doctorName}`} />
                <InfoRow label="Speciality" value={report.doctorSpeciality} />
                <InfoRow label="Degree" value={report.doctorDegree || '—'} />
                <InfoRow label="Appointment" value={`${report.slotDate?.replace(/_/g, '/')} at ${report.slotTime}`} />
              </div>
            </div>
          </div>

          {/* Admission Details */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-700 mb-3">🏥 Admission Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <InfoRow label="Admit Date" value={report.admitDate?.replace(/_/g, '/') || '—'} />
              <InfoRow label="Discharge Date" value={report.dischargeDate?.replace(/_/g, '/') || '—'} />
            </div>
          </div>

          {/* Vitals */}
          {(report.bloodPressure || report.temperature || report.pulse || report.weight) && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-3">💊 Patient Vitals</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Blood Pressure', value: report.bloodPressure, icon: '🩺' },
                  { label: 'Temperature', value: report.temperature, icon: '🌡️' },
                  { label: 'Pulse', value: report.pulse, icon: '❤️' },
                  { label: 'Weight', value: report.weight, icon: '⚖️' },
                ].filter(v => v.value).map(v => (
                  <div key={v.label} className="border border-gray-100 rounded-xl p-3 text-center">
                    <p className="text-xl mb-1">{v.icon}</p>
                    <p className="text-xs text-gray-400">{v.label}</p>
                    <p className="font-bold text-gray-800 text-sm">{v.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Details */}
          <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-700">🔬 Medical Details</h3>
            </div>
            <div className="p-5 space-y-4">
              <MedRow label="Chief Complaint" value={report.chiefComplaint} />
              <MedRow label="Diagnosis" value={report.diagnosis} highlight />
              {report.symptoms && <MedRow label="Symptoms" value={report.symptoms} />}
              {report.treatment && <MedRow label="Treatment Given" value={report.treatment} />}
              {report.notes && <MedRow label="Doctor's Notes" value={report.notes} />}
            </div>
          </div>

          {/* Medicines */}
          {report.medicines && report.medicines.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-3">💊 Prescribed Medicines</h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-primary text-white">
                    <tr>
                      {['#', 'Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-medium text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.medicines.map((med, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{med.name}</td>
                        <td className="px-4 py-3 text-gray-600">{med.dosage}</td>
                        <td className="px-4 py-3 text-gray-600">{med.frequency}</td>
                        <td className="px-4 py-3 text-gray-600">{med.duration}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{med.instructions || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bill Summary */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-700 mb-4">💰 Bill Summary</h3>
            <div className="space-y-2 max-w-xs ml-auto">
              <BillRow label="Consultation Fee" amount={report.consultationFee} />
              {report.medicineCharges > 0 && <BillRow label="Medicine Charges" amount={report.medicineCharges} />}
              {report.otherCharges > 0 && <BillRow label="Other Charges" amount={report.otherCharges} />}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <BillRow label="Total Amount" amount={totalAmount} bold />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Payment Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {report.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 pt-6 flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400">This is a computer generated medical report.</p>
              <p className="text-xs text-gray-400">For queries contact: support@prescripto.com</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-gray-400 mb-1"></div>
              <p className="text-xs text-gray-500">Dr. {report.doctorName}</p>
              <p className="text-xs text-gray-400">{report.doctorSpeciality}</p>
              <p className="text-xs text-gray-400">{report.doctorDegree}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoRow = ({ label, value }) => (
  <div className="flex gap-2">
    <span className="text-gray-400 min-w-[80px]">{label}:</span>
    <span className="text-gray-700 font-medium">{value}</span>
  </div>
)

const MedRow = ({ label, value, highlight }) => (
  <div>
    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
    <p className={`text-sm ${highlight ? 'text-primary font-semibold text-base' : 'text-gray-700'}`}>{value}</p>
  </div>
)

const BillRow = ({ label, amount, bold }) => (
  <div className="flex items-center justify-between">
    <span className={`text-sm ${bold ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{label}</span>
    <span className={`text-sm ${bold ? 'font-bold text-primary text-base' : 'text-gray-700'}`}>₹{amount}</span>
  </div>
)

export default MedicalReportView
