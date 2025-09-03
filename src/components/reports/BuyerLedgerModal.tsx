import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ReportModal } from "./ReportModal";
import { BuyerLedgerReport } from "./BuyerLedgerReport";
import { GetAllBuyers } from "@/Api/Api";

interface BuyerLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Buyer {
  id: number;
  name: string;
  address: string;
  notes: string;
}

export function BuyerLedgerModal({ isOpen, onClose }: BuyerLedgerModalProps) {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const data = await GetAllBuyers();
        if (data) setBuyers(data);
      } catch (error) {
        console.error("Failed to fetch buyers", error);
      }
    };
    fetchBuyers();
  }, []);

  const handleGenerate = () => {
    if (selectedBuyer) setShowReport(true);
  };

  const dateRange = {
    from: format(fromDate, "yyyy-MM-dd"),
    to: format(toDate, "yyyy-MM-dd"),
  };

  return (
    <ReportModal isOpen={isOpen} onClose={onClose} title="Buyer Ledger Report">
      <div className="space-y-6">
        {!showReport ? (
          <>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Buyer Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Buyer</Label>
                <Select value={selectedBuyer} onValueChange={setSelectedBuyer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    {buyers.length > 0 ? (
                      buyers.map((buyer) => (
                        <SelectItem key={buyer.id} value={String(buyer.id)}>
                          {buyer.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="none">Loading...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* From Date */}
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left", !fromDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left", !toDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleGenerate} disabled={!selectedBuyer}>Generate Report</Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowReport(false)}>← Back</Button>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
              <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" /> Print</Button>
            </div>

            {/* Report */}
            <BuyerLedgerReport buyerId={selectedBuyer} dateRange={dateRange} />
          </div>
        )}
      </div>
    </ReportModal>
  );
}