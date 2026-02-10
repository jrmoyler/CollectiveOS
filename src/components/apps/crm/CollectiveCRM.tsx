import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Plus, GripVertical, Brain } from 'lucide-react';
import { useOSStore } from '../../../store/useOSStore';
import type { CRMDeal } from '../../../types';

const STAGE_CONFIG = {
  lead: { label: 'Lead', color: '#60a5fa', bgColor: 'rgba(96, 165, 250, 0.08)' },
  negotiation: { label: 'Negotiation', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.08)' },
  won: { label: 'Won', color: '#34d399', bgColor: 'rgba(52, 211, 153, 0.08)' },
} as const;

type Stage = keyof typeof STAGE_CONFIG;

export function CollectiveCRM() {
  const { deals, moveDeal, addDeal } = useOSStore();
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const stageDeals = (stage: Stage) => deals.filter(d => d.stage === stage);

  const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = deals.reduce((sum, d) => sum + (d.value * d.winProbability / 100), 0);

  const handleDragStart = useCallback((dealId: string) => {
    setDraggedDeal(dealId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    setDragOverStage(stage);
  }, []);

  const handleDrop = useCallback((stage: Stage) => {
    if (draggedDeal) {
      moveDeal(draggedDeal, stage);
    }
    setDraggedDeal(null);
    setDragOverStage(null);
  }, [draggedDeal, moveDeal]);

  return (
    <div className="flex flex-col h-full">
      {/* Stats bar */}
      <div
        className="flex items-center gap-6 px-4 py-2.5 border-b shrink-0"
        style={{ borderColor: 'rgba(52, 211, 153, 0.08)' }}
      >
        <div className="flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-500">Pipeline</div>
            <div className="text-xs font-semibold text-slate-200">
              ${(totalPipeline / 1000).toFixed(0)}K
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-500">Weighted</div>
            <div className="text-xs font-semibold text-emerald-400">
              ${(weightedPipeline / 1000).toFixed(0)}K
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <div>
            <div className="text-[10px] text-slate-500">Deals</div>
            <div className="text-xs font-semibold text-slate-200">{deals.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Brain className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-emerald-400/70">AI Scoring Active</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
        </motion.button>
      </div>

      {/* Add deal form */}
      {showAddForm && <AddDealForm onAdd={(deal) => { addDeal(deal); setShowAddForm(false); }} onCancel={() => setShowAddForm(false)} />}

      {/* Kanban columns */}
      <div className="flex-1 flex gap-3 p-3 overflow-x-auto">
        {(Object.keys(STAGE_CONFIG) as Stage[]).map(stage => {
          const config = STAGE_CONFIG[stage];
          const stDeals = stageDeals(stage);
          const stageValue = stDeals.reduce((s, d) => s + d.value, 0);

          return (
            <div
              key={stage}
              className="flex-1 min-w-[260px] flex flex-col rounded-xl overflow-hidden"
              style={{
                background: dragOverStage === stage ? config.bgColor : 'rgba(15, 23, 42, 0.4)',
                border: `1px solid ${dragOverStage === stage ? config.color + '33' : 'rgba(52, 211, 153, 0.06)'}`,
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={() => handleDrop(stage)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: config.color }} />
                  <span className="text-xs font-semibold text-slate-300">{config.label}</span>
                  <span className="text-[10px] text-slate-600">({stDeals.length})</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  ${(stageValue / 1000).toFixed(0)}K
                </span>
              </div>

              {/* Deal cards */}
              <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto">
                {stDeals.map(deal => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    stageColor={config.color}
                    onDragStart={handleDragStart}
                    isDragging={draggedDeal === deal.id}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DealCard({
  deal,
  stageColor,
  onDragStart,
  isDragging,
}: {
  deal: CRMDeal;
  stageColor: string;
  onDragStart: (id: string) => void;
  isDragging: boolean;
}) {
  const probColor = deal.winProbability >= 70 ? '#34d399' : deal.winProbability >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      draggable
      onDragStart={() => onDragStart(deal.id)}
      className="p-3 rounded-lg cursor-grab active:cursor-grabbing"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(52, 211, 153, 0.08)',
      }}
    >
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-200 truncate">{deal.name}</div>
          <div className="text-[10px] text-slate-500">{deal.company}</div>
        </div>
        <GripVertical className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-semibold" style={{ color: stageColor }}>
          ${(deal.value / 1000).toFixed(0)}K
        </span>
        {/* AI win probability */}
        <div className="flex items-center gap-1">
          <Brain className="w-2.5 h-2.5" style={{ color: probColor }} />
          <span className="text-[10px] font-medium" style={{ color: probColor }}>
            {deal.winProbability}%
          </span>
        </div>
      </div>

      {/* Progress bar showing win probability */}
      <div className="mt-1.5 h-1 rounded-full bg-slate-800/80 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${deal.winProbability}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: probColor }}
        />
      </div>

      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-slate-500">{deal.contact}</span>
        <span className="text-[10px] text-slate-600">{deal.lastActivity}</span>
      </div>
    </motion.div>
  );
}

function AddDealForm({
  onAdd,
  onCancel,
}: {
  onAdd: (deal: Omit<CRMDeal, 'id'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!name || !company || !value) return;
    onAdd({
      name,
      company,
      value: parseInt(value) * 1000,
      stage: 'lead',
      winProbability: Math.floor(Math.random() * 40) + 15,
      contact: 'New Contact',
      lastActivity: 'Just now',
    });
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="px-4 py-3 border-b overflow-hidden"
      style={{ borderColor: 'rgba(52, 211, 153, 0.08)' }}
    >
      <div className="flex items-center gap-2">
        <input
          placeholder="Deal name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 px-2 py-1.5 text-xs rounded bg-slate-800/50 border border-slate-700/50 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30"
        />
        <input
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="flex-1 px-2 py-1.5 text-xs rounded bg-slate-800/50 border border-slate-700/50 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30"
        />
        <input
          placeholder="Value ($K)"
          value={value}
          onChange={e => setValue(e.target.value)}
          type="number"
          className="w-24 px-2 py-1.5 text-xs rounded bg-slate-800/50 border border-slate-700/50 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30"
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleSubmit} className="px-3 py-1.5 text-xs rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
          Add
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onCancel} className="px-3 py-1.5 text-xs rounded bg-slate-700/50 text-slate-400 hover:bg-slate-700">
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
}
