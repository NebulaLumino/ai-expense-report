'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const SYSTEM_PROMPT = `You are an expert expense reporting analyst. Generate a comprehensive expense report and reimbursement request based on the provided expense data. Include: categorized expense breakdown, total amounts per category, per-diem calculations, mileage reimbursement, receipt summary, policy compliance check, and a professional markdown report.`;

export default function ExpenseReportPage() {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [expenseType, setExpenseType] = useState('Business Travel');
  const [tripDestination, setTripDestination] = useState('');
  const [tripStart, setTripStart] = useState('');
  const [tripEnd, setTripEnd] = useState('');
  const [mileage, setMileage] = useState('');
  const [airfare, setAirfare] = useState('');
  const [hotelNights, setHotelNights] = useState('');
  const [hotelRate, setHotelRate] = useState('');
  const [meals, setMeals] = useState('');
  const [carRental, setCarRental] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [{
            role: 'user',
            content: `Generate an expense report and reimbursement summary:\n\nEmployee: ${employeeName || 'Jane Smith'}\nEmployee ID: ${employeeId || 'EMP-042'}\nDepartment: ${department || 'Sales'}\nExpense Type: ${expenseType}\nTrip Destination: ${tripDestination || 'New York, NY'}\nTrip Dates: ${tripStart || '2024-03-01'} to ${tripEnd || '2024-03-05'}\n\nExpenses:\n- Airfare: $${airfare || '0'}\n- Hotel: ${hotelNights || '3'} nights × $${hotelRate || '180'}/night = $${(Number(hotelNights||0) * Number(hotelRate||0)).toFixed(2)}\n- Meals & Entertainment: $${meals || '0'}\n- Car Rental: $${carRental || '0'}\n- Mileage: ${mileage || '0'} miles × $0.67/mile = $${((Number(mileage)||0) * 0.67).toFixed(2)}\n- Other Expenses: $${otherExpenses || '0'}\n\nProvide a full expense report with: expense categorization, daily breakdown, per-diem policy check, total reimbursement request, receipt checklist, and approval routing recommendation.`
          }]
        })
      });
      const data = await res.json();
      setResult(data.result || data.error || 'No response.');
    } catch { setError('Failed to generate expense report.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-400 mb-2">AI Expense Report Generator</h1>
          <p className="text-gray-400">Create professional expense reports and reimbursement requests in seconds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-5 bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-red-300">Employee &amp; Trip Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Employee Name</label>
                <input value={employeeName} onChange={e => setEmployeeName(e.target.value)} placeholder="Jane Smith" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Employee ID</label>
                <input value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="EMP-042" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Department</label>
                <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Sales" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Expense Type</label>
                <select value={expenseType} onChange={e => setExpenseType(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none">
                  <option>Business Travel</option><option>Client Entertainment</option><option>Conference</option><option>Office Supplies</option><option>Professional Development</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Trip Destination</label>
              <input value={tripDestination} onChange={e => setTripDestination(e.target.value)} placeholder="New York, NY" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                <input type="date" value={tripStart} onChange={e => setTripStart(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                <input type="date" value={tripEnd} onChange={e => setTripEnd(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-red-300 pt-2">Expense Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Airfare ($)</label>
                <input type="number" value={airfare} onChange={e => setAirfare(e.target.value)} placeholder="0.00" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Car Rental ($)</label>
                <input type="number" value={carRental} onChange={e => setCarRental(e.target.value)} placeholder="0.00" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hotel Nights</label>
                <input type="number" value={hotelNights} onChange={e => setHotelNights(e.target.value)} placeholder="3" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hotel Rate/Night ($)</label>
                <input type="number" value={hotelRate} onChange={e => setHotelRate(e.target.value)} placeholder="180.00" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Meals &amp; Entertainment ($)</label>
                <input type="number" value={meals} onChange={e => setMeals(e.target.value)} placeholder="0.00" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mileage (miles)</label>
                <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="0" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Other Expenses Description</label>
              <input value={otherExpenses} onChange={e => setOtherExpenses(e.target.value)} placeholder="Conference registration, Wi-Fi, tips, etc." className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none" />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white font-semibold py-3 rounded-xl transition-colors">
              {loading ? '⚙️ Generating Expense Report...' : '📄 Generate Expense Report'}
            </button>
          </form>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-red-300 mb-4">Expense Report Output</h2>
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none text-gray-200 overflow-y-auto max-h-[700px]">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Your expense report will appear here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
