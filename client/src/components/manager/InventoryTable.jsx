import { Plus, Minus, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { getSport } from "../../constants/sports";

export default function InventoryTable({ items, onAdd, onRestock, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#f0ede6]">
        <h3 className="font-bold text-[#08060d] m-0">Equipment Inventory</h3>
        <Button size="sm" onClick={onAdd}><Plus size={16} /> Add Item</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-[#f0ede6]">
              <th className="p-3 font-semibold">Item</th>
              <th className="p-3 font-semibold">Sport</th>
              <th className="p-3 font-semibold">₹/hr</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold">Condition</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const sport = getSport(item.sportId);
              return (
                <tr key={item.id} className="border-b border-[#f0ede6] hover:bg-[#faf9f6] transition-colors">
                  <td className="p-3 font-semibold text-[#08060d]"><span className="mr-1">{item.icon}</span>{item.name}</td>
                  <td className="p-3"><Badge color={sport?.color} bg={sport?.bg}>{sport?.name}</Badge></td>
                  <td className="p-3 text-gray-600">₹{item.pricePerHour}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onRestock?.(item.id, -1)} className="w-7 h-7 rounded-lg border border-[#e5e4e7] flex items-center justify-center hover:bg-[#f0ede6] transition-colors"><Minus size={14} /></button>
                      <span className="font-bold min-w-[30px] text-center">{item.stock}</span>
                      <button onClick={() => onRestock?.(item.id, 1)} className="w-7 h-7 rounded-lg border border-[#1D9E75] bg-[#1D9E75] text-white flex items-center justify-center hover:opacity-80 transition-opacity"><Plus size={14} /></button>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600">{item.condition}</td>
                  <td className="p-3">
                    <button onClick={() => onDelete?.(item.id)} className="text-[#A32D2D] hover:bg-[#FCEBEB] p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
