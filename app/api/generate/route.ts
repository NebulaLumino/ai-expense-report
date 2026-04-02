import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getClient() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: "https://api.deepseek.com/v1" });
}

export async function POST(req: NextRequest) {
  try {
    const { expenses, submitterName, department, projectCode, manager, additionalNotes } = await req.json();

    const prompt = `You are an expense reporting specialist. Generate a professional expense report and reimbursement form based on the following inputs:

**Submitter:** ${submitterName || "Employee Name"}
**Department:** ${department || "Department"}
**Project Code:** ${projectCode || "N/A"}
**Manager:** ${manager || "Manager Name"}
**Additional Notes:** ${additionalNotes || "None"}

**Expense Items (JSON):** ${expenses || "[]"}

${expenses && Array.isArray(JSON.parse(expenses)) ? JSON.parse(expenses).map((e: { type: string; amount: string; date: string; category: string }, i: number) => 
  `Item ${i + 1}: [${e.date}] ${e.type} - $${e.amount} (${e.category})`
).join("\n") : "No expense items provided."}

Please generate:

1. **Expense Report Form** — A professionally formatted expense report with header info, itemized expense table, subtotals by category, grand total, and signature/approval lines
2. **Categorization Summary** — Breakdown of expenses by category (travel, meals, lodging, supplies, etc.)
3. **Reimbursement Calculation** — Total amount to be reimbursed, noting any non-reimbursable items
4. **Approval Routing Notes** — Which approvers need to sign off and in what order (manager → finance → accounting)
5. **Receipt Checklist** — Confirm receipt requirements for each expense type
6. **Policy Compliance Notes** — Flag any potential policy issues (missing receipts, over-limit items, etc.)

Format the expense report professionally. Use markdown tables. Be thorough with the categorization.`;

    const client = getClient();
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const result = completion.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ result });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
