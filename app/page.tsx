"use client";
import { useState } from "react";

const EXPENSE_TYPES = ["Airfare", "Hotel / Lodging", "Ground Transportation", "Meals & Entertainment", "Client Dinner", "Office Supplies", "Software / Subscriptions", "Training / Conference", "mileage", "Other"];
const CATEGORIES = ["Travel", "Meals", "Lodging", "Supplies", "Software", "Professional Development", "Client Entertainment", "Other"];
const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Operations", "Finance", "HR", "Executive", "Other"];

interface ExpenseItem {
  type: string;
  amount: string;
  date: string;
  category: string;
  merchant: string;
  notes: string;
}

export default function ExpenseReportPage() {
  const [submitterName, setSubmitterName] = useState("");
  const [department, setDepartment] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [manager, setManager] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [expenses, setExpenses] = useState<ExpenseItem[]>([{ type: "", amount: "", date: "", category: "Travel", merchant: "", notes: "" }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const addExpense = () => {
    setExpenses([...expenses, { type: "", amount: "", date: "", category: "Travel", merchant: "", notes: "" }]);
  };

  const removeExpense = (idx: number) => {
    setExpenses(expenses.filter((_, i) => i !== idx));
  };

  const updateExpense = (idx: number, field: keyof ExpenseItem, value: string) => {
    const updated = [...expenses];
    updated[idx] = { ...updated[idx], [field]: value };
    setExpenses(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses: JSON.stringify(expenses), submitterName, department, projectCode, manager, additionalNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="border-b border-orange-500/20 bg-black/20">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-xl">🧾</div>
            <h1 className="text-3xl font-bold tracking-tight">AI Expense Report Generator</h1>
          </div>
          <p className="text-gray-400 text-sm">Create itemized expense reports, categorize spending, and get approval routing notes.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Submitter Name</label>
              <input type="text" value={submitterName} onChange={(e) => setSubmitterName(e.target.value)} placeholder="Jane Smith" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Project Code</label>
              <input type="text" value={projectCode} onChange={(e) => setProjectCode(e.target.value)} placeholder="PROJ-2024-001" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Manager</label>
              <input type="text" value={manager} onChange={(e) => setManager(e.target.value)} placeholder="John Doe" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300">Expense Items</h3>
              <button type="button" onClick={addExpense} className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1 rounded-lg transition">+ Add Item</button>
            </div>
            <div className="space-y-3">
              {expenses.map((exp, idx) => (
                <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Type</label>
                      <select value={exp.type} onChange={(e) => updateExpense(idx, "type", e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="">Select type</option>
                        {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Amount ($)</label>
                      <input type="number" value={exp.amount} onChange={(e) => updateExpense(idx, "amount", e.target.value)} placeholder="0.00" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Date</label>
                      <input type="date" value={exp.date} onChange={(e) => updateExpense(idx, "date", e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Category</label>
                      <select value={exp.category} onChange={(e) => updateExpense(idx, "category", e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Merchant</label>
                      <input type="text" value={exp.merchant} onChange={(e) => updateExpense(idx, "merchant", e.target.value)} placeholder="Vendor name" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="text" value={exp.notes} onChange={(e) => updateExpense(idx, "notes", e.target.value)} placeholder="Notes / purpose" className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    {expenses.length > 1 && (
                      <button type="button" onClick={() => removeExpense(idx)} className="text-red-400 hover:text-red-300 text-xs px-2">✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Additional Notes</label>
            <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows={2} placeholder="Any additional context for the finance team..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin">⚙️</span>Generating Report...</> : "🧾 Generate Expense Report"}
          </button>
        </form>

        {loading && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-400 mt-6">
            <div className="text-5xl mb-4 animate-pulse">🧾</div>
            <p className="text-lg font-medium">Generating your expense report...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 text-red-300 text-sm mt-6"><strong>Error:</strong> {error}</div>
        )}
        {result && !loading && (
          <div className="bg-gray-900/60 border border-orange-500/30 rounded-2xl p-6 lg:p-8 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-orange-300">🧾 Expense Report</h2>
              <span className="text-xs text-gray-500">{submitterName} · {department}</span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">{result}</div>
          </div>
        )}
      </div>
    </main>
  );
}
