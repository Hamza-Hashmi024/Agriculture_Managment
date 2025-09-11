import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  GetAllTaxRules,
  CreateTaxRule,
  UpdateTaxRule,
  DeleteTaxRule,
} from "@/Api/Api";

type TaxRule = {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  notes?: string;
};

export const TaxSettings = () => {
  const [taxes, setTaxes] = useState<TaxRule[]>([]);
  const [form, setForm] = useState<Omit<TaxRule, "id">>({
    name: "",
    type: "percentage",
    value: 0,
    notes: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch all tax rules from API
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const data = await GetAllTaxRules();
        setTaxes(data);
      } catch (error) {
        console.error("Failed to fetch tax rules:", error);
      }
    };
    fetchTaxes();
  }, []);

  // ✅ Add or Update Tax
  const handleSaveTax = async () => {
    try {
      if (editingId) {
        const updated = await UpdateTaxRule(editingId, form);
        setTaxes((prev) =>
          prev.map((tax) => (tax.id === editingId ? updated : tax))
        );
        setEditingId(null);
      } else {
        const newTax = await CreateTaxRule(form);
        setTaxes((prev) => [...prev, newTax]);
      }
      setForm({ name: "", type: "percentage", value: 0, notes: "" });
      setOpen(false); // ✅ close dialog after save
    } catch (error) {
      console.error("Failed to save tax rule:", error);
    }
  };

  // ✅ Delete Tax
  const handleDelete = async (id: string) => {
    try {
      await DeleteTaxRule(id);
      setTaxes((prev) => prev.filter((tax) => tax.id !== id));
    } catch (error) {
      console.error("Failed to delete tax rule:", error);
    }
  };

  // ✅ Edit Tax (prefill form + open dialog)
  const handleEdit = (id: string) => {
    const taxToEdit = taxes.find((t) => t.id === id);
    if (!taxToEdit) return;
    setForm({
      name: taxToEdit.name,
      type: taxToEdit.type,
      value: taxToEdit.value,
      notes: taxToEdit.notes || "",
    });
    setEditingId(id);
    setOpen(true); // ✅ open dialog directly
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Setting
          </Button>

          <h2 className="text-2xl font-semibold">Tax Settings</h2>
          <p className="text-sm">Below is a list of all salary tax rules.</p>
        </div>

        {/* Add / Edit Tax Dialog */}
        <Button onClick={() => setOpen(true)}>Add Tax</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Tax Rule" : "Add New Tax Rule"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Professional Tax"
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="w-full border rounded-md p-2"
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as "percentage" | "fixed",
                  })
                }
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) =>
                  setForm({ ...form, value: Number(e.target.value) })
                }
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional notes"
              />
            </div>
            <Button className="w-full" onClick={handleSaveTax}>
              {editingId ? "Update Tax Rule" : "Save Tax Rule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tax Table */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxes.map((tax) => (
              <TableRow key={tax.id}>
                <TableCell>{tax.id}</TableCell>
                <TableCell>{tax.name}</TableCell>
                <TableCell className="capitalize">{tax.type}</TableCell>
                <TableCell>
                  {tax.type === "percentage" ? `${tax.value}%` : tax.value}
                </TableCell>
                <TableCell>{tax.notes || "—"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(tax.id)} 
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(tax.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
