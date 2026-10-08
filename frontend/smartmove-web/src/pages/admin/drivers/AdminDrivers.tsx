import { motion } from 'framer-motion';
import { Plus, Edit2, Eye, Star } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminDrivers() {
  
  const mockDrivers = [
    { id: 'DRV-771', name: 'Dipak Palve', contact: '+94 77 123 4567', status: 'On Duty', assigned: 'T-1042', rating: 4.8 },
    { id: 'DRV-772', name: 'Saman Silva', contact: '+94 71 987 6543', status: 'Off Duty', assigned: 'None', rating: 4.5 },
    { id: 'DRV-773', name: 'Kamal Perera', contact: '+94 75 456 7890', status: 'On Duty', assigned: 'T-1045', rating: 4.9 },
  ];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Driver Management</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage driver profiles, assignments, and ratings.</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Driver
        </button>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0a0b10]/50 border-b border-white/5 text-xs uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-5 pl-8">Driver ID</th>
                <th className="p-5">Name & Contact</th>
                <th className="p-5">Assigned Trip</th>
                <th className="p-5">Rating</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockDrivers.map((d) => (
                <motion.tr variants={fadeUp} key={d.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 pl-8 font-semibold text-white">{d.id}</td>
                  <td className="p-5">
                    <p className="text-sm text-gray-200 font-medium">{d.name}</p>
                    <p className="text-xs text-gray-500">{d.contact}</p>
                  </td>
                  <td className="p-5 text-sm text-gray-400 font-medium">
                    {d.assigned !== 'None' ? <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg">{d.assigned}</span> : <span className="text-gray-600">None</span>}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 w-fit px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" />
                      <span className="text-sm font-bold">{d.rating}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${d.status === 'On Duty' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-5 pr-8 flex items-center justify-end gap-2">
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
