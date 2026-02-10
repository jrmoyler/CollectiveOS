import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Bot, Circle } from 'lucide-react';
import { fetchAgents, subscribeToAgents, DEPARTMENTS } from '../../../lib/supabase';
import { useOSStore } from '../../../store/useOSStore';
import type { Agent, ChatMessage } from '../../../types';

export function AgentHive() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const setActiveDepartment = useOSStore(s => s.setActiveDepartment);

  useEffect(() => {
    fetchAgents().then(data => {
      setAgents(data);
      setFilteredAgents(data);
      setLoading(false);
    });

    // Subscribe to real-time agent updates from Supabase.
    // When any agent row changes in the database, this callback fires
    // and updates our local state, which triggers a re-render of the agent list.
    const unsubscribe = subscribeToAgents((updatedAgent) => {
      setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
    });

    return () => { unsubscribe(); };
  }, []);

  useEffect(() => {
    let result = agents;
    if (selectedDept !== 'All') {
      result = result.filter(a => a.department === selectedDept);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.specialty.toLowerCase().includes(q)
      );
    }
    setFilteredAgents(result);
  }, [agents, selectedDept, searchQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setActiveDepartment(agent.department);
    setMessages([{
      id: '1',
      agentId: agent.id,
      agentName: agent.name,
      content: `Hello! I'm ${agent.name} from ${agent.department}. I specialize in ${agent.specialty}. How can I assist you today?`,
      timestamp: new Date(),
      isUser: false,
    }]);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !selectedAgent) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      agentId: selectedAgent.id,
      agentName: 'You',
      content: inputMessage,
      timestamp: new Date(),
      isUser: true,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulated AI response
    setTimeout(() => {
      const responses = [
        `Based on my analysis in ${selectedAgent.specialty}, I'd recommend focusing on the key metrics first.`,
        `That's a great question. Let me cross-reference our ${selectedAgent.department} data to give you the most accurate answer.`,
        `I've processed your request through our ${selectedAgent.specialty} pipeline. Here's what I found...`,
        `From my experience in ${selectedAgent.role}, the optimal approach would involve three key steps.`,
        `I've consulted with the ${selectedAgent.department} team. We suggest a phased approach.`,
      ];
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isUser: false,
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 800 + Math.random() * 1200);
  };

  const statusColor = (s: Agent['status']) =>
    s === 'online' ? '#34d399' : s === 'busy' ? '#f59e0b' : '#64748b';

  return (
    <div className="flex h-full">
      {/* Agent sidebar */}
      <div
        className="w-72 flex flex-col border-r shrink-0"
        style={{ borderColor: 'rgba(52, 211, 153, 0.08)' }}
      >
        {/* Search */}
        <div className="p-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search 400 agents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30"
            />
          </div>

          {/* Department filter */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedDept('All')}
              className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${
                selectedDept === 'All'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              All ({agents.length})
            </button>
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${
                  selectedDept === dept
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                {dept.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Agent list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence>
              {filteredAgents.slice(0, 50).map((agent) => (
                <motion.button
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => selectAgent(agent)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-800/50 transition-colors ${
                    selectedAgent?.id === agent.id ? 'bg-emerald-500/10 border-r-2 border-emerald-400' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-emerald-400" />
                    </div>
                    <Circle
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5"
                      fill={statusColor(agent.status)}
                      stroke="none"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-300 truncate">{agent.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{agent.role}</div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
          {filteredAgents.length > 50 && (
            <div className="text-center py-2 text-[10px] text-slate-600">
              Showing 50 of {filteredAgents.length} agents
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedAgent ? (
          <>
            {/* Chat header */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 border-b shrink-0"
              style={{ borderColor: 'rgba(52, 211, 153, 0.08)' }}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">{selectedAgent.name}</div>
                <div className="text-[10px] text-emerald-400/70">
                  {selectedAgent.department} • {selectedAgent.specialty}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      msg.isUser
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700/30'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: 'rgba(52, 211, 153, 0.08)' }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={`Message ${selectedAgent.name}...`}
                  className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/30"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Bot className="w-12 h-12 text-emerald-400/20" />
            <span className="text-sm">Select an agent to begin</span>
            <span className="text-[10px] text-slate-600">400 AI agents across {DEPARTMENTS.length} departments</span>
          </div>
        )}
      </div>
    </div>
  );
}
