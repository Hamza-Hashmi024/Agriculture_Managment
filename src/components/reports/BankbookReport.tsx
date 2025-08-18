import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GetBankBooks } from "@/Api/Api"; 

interface BankbookReportProps {
  dateRange: { from: string; to: string };
}

export function BankbookReport({ dateRange }: BankbookReportProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await GetBankBooks(dateRange.from, dateRange.to);
      setData(res);
      setIsGenerated(true);
    } catch (err) {
      console.error("Error fetching bankbook report:", err);
    } finally {
      setLoading(false);
    }
  };

  // Group by bank account
  const grouped = data.reduce((acc: any, row: any) => {
    if (!acc[row.bank_account_id]) {
      acc[row.bank_account_id] = {
        account_name: row.account_name,
        transactions: [],
      };
    }
    acc[row.bank_account_id].transactions.push(row);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bankbook Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Date Range:{" "}
          {new Date(dateRange.from).toLocaleDateString()} -{" "}
          {new Date(dateRange.to).toLocaleDateString()}
        </div>

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Loading..." : "Generate Report"}
        </Button>

        {!isGenerated ? (
          <div className="text-center text-muted-foreground py-8">
            Click Generate to view the bankbook report
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([accountId, account]: any) => (
              <div key={accountId} className="border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold mb-2">
                  Bank Account: {account.account_name}
                </h3>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-right p-2">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {account.transactions.map((txn: any, idx: number) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">
                          {new Date(txn.txn_date).toLocaleDateString()}
                        </td>
                        <td className="p-2">{txn.description}</td>
                        <td className="p-2">{txn.type}</td>
                        <td className="p-2 text-right">{txn.amount}</td>
                        <td className="p-2 text-right">
                          {txn.running_balance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}