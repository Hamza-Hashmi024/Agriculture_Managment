
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ReportModal } from "./ReportModal";
import { AdvancesReport } from "./AdvancesReport";

interface AdvancesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockFarmers = [
  { id: "all", name: "All Farmers" },
  { id: "1", name: "Akbar Ali" },
  { id: "2", name: "Rafiq Ahmad" },
  { id: "3", name: "Muhammad Hassan" },
];

export function AdvancesModal({ isOpen, onClose }: AdvancesModalProps) {
  const [selectedFarmer, setSelectedFarmer] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showReport, setShowReport] = useState(false);

  const handleGenerate = () => {
    setShowReport(true);
  };

  const dateRange = {
    from: fromDate.toISOString().split('T')[0],
    to: toDate.toISOString().split('T')[0]
  };

  return (
    <ReportModal isOpen={isOpen} onClose={onClose} title="Advances Report">
      <div className="space-y-6">
        {!showReport ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Farmer</Label>
                <Select value={selectedFarmer} onValueChange={setSelectedFarmer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose farmer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFarmers.map((farmer) => (
                      <SelectItem key={farmer.id} value={farmer.id}>
                        {farmer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="outstanding">Outstanding</SelectItem>
                    <SelectItem value="settled">Settled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleGenerate}>
                Generate Report
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowReport(false)}>
                ← Back to Parameters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
            <AdvancesReport dateRange={dateRange} />
          </div>
        )}
      </div>
    </ReportModal>
  );
}
