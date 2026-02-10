import { createClient } from '@supabase/supabase-js';
import type { Agent } from '../types';

// Supabase configuration - replace with your actual Supabase credentials
// For demo purposes, we use mock data when Supabase is not configured
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Collective AI Departments
export const DEPARTMENTS = [
  'Nexus Labs',
  'Kinetic Edge',
  'Hybrid Living',
  'ZenFlow',
  'Quantum Forge',
  'Signal Path',
  'Cipher Core',
  'Pulse Grid',
  'Vortex Analytics',
  'Prism Creative',
] as const;

const ROLES = [
  'Research Analyst', 'Strategy Lead', 'Operations Manager',
  'Data Scientist', 'Creative Director', 'UX Architect',
  'Growth Hacker', 'Security Specialist', 'DevOps Engineer',
  'Product Manager', 'Sales Strategist', 'Content Curator',
  'AI Trainer', 'Quality Assurance', 'Community Manager',
  'Technical Writer', 'Brand Strategist', 'Supply Chain Analyst',
  'Financial Advisor', 'Legal Compliance',
];

const SPECIALTIES = [
  'Natural Language Processing', 'Computer Vision', 'Predictive Analytics',
  'Sentiment Analysis', 'Recommendation Systems', 'Fraud Detection',
  'Supply Chain Optimization', 'Customer Segmentation', 'A/B Testing',
  'Real-time Data Processing', 'Content Generation', 'Process Automation',
  'Risk Assessment', 'Market Analysis', 'Behavioral Modeling',
  'Speech Recognition', 'Image Classification', 'Time Series Forecasting',
  'Anomaly Detection', 'Knowledge Graphs',
];

const AGENT_NAMES = [
  'Atlas', 'Nova', 'Echo', 'Sage', 'Orion', 'Luna', 'Phoenix', 'Cipher',
  'Aria', 'Zen', 'Nexus', 'Pulse', 'Vertex', 'Prism', 'Flux', 'Vector',
  'Helix', 'Onyx', 'Iris', 'Cortex', 'Titan', 'Lyra', 'Sigma', 'Delta',
  'Aura', 'Bolt', 'Crest', 'Drift', 'Ember', 'Frost', 'Glyph', 'Halo',
  'Ion', 'Jade', 'Kite', 'Loom', 'Mist', 'Noir', 'Opal', 'Pike',
];

// Generate 400 mock agents across departments
function generateMockAgents(): Agent[] {
  const agents: Agent[] = [];
  for (let i = 0; i < 400; i++) {
    const deptIndex = i % DEPARTMENTS.length;
    const nameIndex = i % AGENT_NAMES.length;
    const roleIndex = i % ROLES.length;
    const specIndex = i % SPECIALTIES.length;
    const suffix = Math.floor(i / AGENT_NAMES.length);

    agents.push({
      id: `agent-${i}`,
      name: `${AGENT_NAMES[nameIndex]}${suffix > 0 ? `-${suffix}` : ''}`,
      department: DEPARTMENTS[deptIndex],
      role: ROLES[roleIndex],
      status: i % 5 === 0 ? 'offline' : i % 3 === 0 ? 'busy' : 'online',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=agent${i}`,
      specialty: SPECIALTIES[specIndex],
    });
  }
  return agents;
}

let cachedAgents: Agent[] | null = null;

/**
 * Fetch agents from Supabase, falling back to mock data.
 * When Supabase is connected, subscribe to real-time changes:
 *
 *   const channel = supabase
 *     .channel('agents')
 *     .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' },
 *       (payload) => {
 *         // payload.new contains the updated agent row
 *         // Update local state via zustand store:
 *         //   useOSStore.getState().updateAgent(payload.new)
 *       }
 *     )
 *     .subscribe();
 *
 * This real-time subscription automatically pushes database changes
 * to all connected clients, keeping the Agent Hive UI in sync.
 */
export async function fetchAgents(): Promise<Agent[]> {
  if (cachedAgents) return cachedAgents;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .limit(400);

      if (!error && data) {
        cachedAgents = data as Agent[];
        return cachedAgents;
      }
    } catch {
      // Fall through to mock data
    }
  }

  cachedAgents = generateMockAgents();
  return cachedAgents;
}

/**
 * Subscribe to real-time agent updates from Supabase.
 * When a row in the 'agents' table is inserted, updated, or deleted,
 * the callback fires with the change payload, allowing the UI
 * to reactively update without polling.
 */
export function subscribeToAgents(onUpdate: (agent: Agent) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('agents-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'agents' },
      (payload) => {
        // The payload.new contains the updated/inserted agent record.
        // This triggers a store update which re-renders Agent Hive.
        if (payload.new) {
          onUpdate(payload.new as Agent);
        }
      }
    )
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
}
