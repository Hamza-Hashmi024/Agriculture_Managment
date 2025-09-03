import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GetBuyersledger, GetAllBuyers } from "@/Api/Api";

interface BuyerLedgerReportProps {
  buyerId: string;
  dateRange: { from: string; to: string };
}

interface Transaction {
  id: string;
  date: string;
  type: string;
  ref: string;
  debit?: number;
  credit?: number;
  balance?: number;
  notes?: string;
}

interface Buyer {
  id: string;
  name: string;
}

export function BuyerLedgerReport({ buyerId, dateRange }: BuyerLedgerReportProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [buyerName, setBuyerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      setLoading(true);
      try {
        const res: Transaction[] = await GetBuyersledger(buyerId, dateRange.from, dateRange.to);
        setTransactions(res);

        const buyers: Buyer[] = await GetAllBuyers();
        const buyer = buyers.find((b) => String(b.id) === String(buyerId));
        if (buyer) setBuyerName(buyer.name);
      } catch (error) {
        console.error("Error fetching ledger:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, [buyerId, dateRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Buyer Ledger Report {buyerName && `- ${buyerName}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Ref</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length ? (
                  transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                      <TableCell>{t.type}</TableCell>
                      <TableCell>{t.ref}</TableCell>
                      <TableCell className="text-right">{t.debit ?? "—"}</TableCell>
                      <TableCell className="text-right">{t.credit ?? "—"}</TableCell>
                      <TableCell className="text-right">{t.balance ?? "—"}</TableCell>
                      <TableCell>{t.notes || "—"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No transactions found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}