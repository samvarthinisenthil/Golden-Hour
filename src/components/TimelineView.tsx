import React, { useState } from 'react';
import { Clock, Plus, Edit2, Check, AlertCircle } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  onUpdateTimeline?: (events: TimelineEvent[]) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  onUpdateTimeline
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>(timeline);
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Sync if prop changes
  React.useEffect(() => {
    setEvents(timeline);
  }, [timeline]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvt: TimelineEvent = {
      id: `evt-custom-${Date.now()}`,
      time: newTime.trim() || 'Just now',
      title: newTitle.trim(),
      description: newDesc.trim() || 'User documented event milestone.',
      category: 'action'
    };

    const updated = [...events, newEvt];
    setEvents(updated);
    if (onUpdateTimeline) onUpdateTimeline(updated);

    setNewTime('');
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  const handleSaveEdit = (id: string) => {
    const updated = events.map(ev => ev.id === id ? { ...ev, title: editTitle } : ev);
    setEvents(updated);
    if (onUpdateTimeline) onUpdateTimeline(updated);
    setEditingId(null);
  };

  return (
    <div className="bg-[#080d17] border border-slate-800 rounded-xl p-5 md:p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            INCIDENT CHRONOLOGICAL TIMELINE
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatic chronological reconstruction required for NCRP cybercrime filing and RBI bank dispute verification.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 px-3 py-1.5 rounded transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAddEvent} className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-5 text-xs font-mono space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="Timestamp (e.g. 14:15)"
              className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded"
            />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Milestone title (e.g. Received call from fake police)"
              className="sm:col-span-2 bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded"
              required
            />
          </div>
          <textarea
            rows={2}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Details of what happened..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-3 py-1 rounded"
            >
              Add to Timeline
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-slate-800 text-slate-400 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Timeline Event Feed */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((evt, idx) => (
          <div key={evt.id || idx} className="relative group">
            {/* Timeline bullet dot */}
            <div className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
              evt.category === 'transaction'
                ? 'bg-red-500 border-red-950 animate-pulse'
                : evt.category === 'threat'
                ? 'bg-amber-500 border-amber-950'
                : evt.category === 'contact'
                ? 'bg-blue-500 border-blue-950'
                : 'bg-emerald-500 border-emerald-950'
            }`} />

            <div className="p-3.5 rounded-lg bg-[#060a12] border border-slate-850 hover:border-slate-700 transition">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/40">
                    {evt.time}
                  </span>
                  {editingId === evt.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-xs px-2 py-0.5 rounded text-white"
                      />
                      <button
                        onClick={() => handleSaveEdit(evt.id)}
                        className="text-emerald-400 hover:text-emerald-300 p-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <h4 className="text-sm font-bold text-slate-100">{evt.title}</h4>
                  )}
                </div>

                <button
                  onClick={() => {
                    setEditingId(evt.id);
                    setEditTitle(evt.title);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition p-1"
                  title="Edit timeline milestone"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {evt.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
