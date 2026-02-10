import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAgents, subscribeToAgents, DEPARTMENTS } from './supabase';
import type { Agent } from '../types';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => null),
}));

describe('Supabase Utilities', () => {
  beforeEach(() => {
    // Clear any cached agents between tests
    vi.clearAllMocks();
  });

  describe('DEPARTMENTS constant', () => {
    it('should export 10 departments', () => {
      expect(DEPARTMENTS).toHaveLength(10);
    });

    it('should contain expected department names', () => {
      expect(DEPARTMENTS).toContain('Nexus Labs');
      expect(DEPARTMENTS).toContain('Kinetic Edge');
      expect(DEPARTMENTS).toContain('Hybrid Living');
      expect(DEPARTMENTS).toContain('ZenFlow');
      expect(DEPARTMENTS).toContain('Quantum Forge');
    });

    it('should be readonly tuple', () => {
      expect(Array.isArray(DEPARTMENTS)).toBe(true);
    });
  });

  describe('fetchAgents', () => {
    it('should return 400 mock agents when Supabase is not configured', async () => {
      const agents = await fetchAgents();

      expect(agents).toHaveLength(400);
      expect(agents[0]).toHaveProperty('id');
      expect(agents[0]).toHaveProperty('name');
      expect(agents[0]).toHaveProperty('department');
      expect(agents[0]).toHaveProperty('role');
      expect(agents[0]).toHaveProperty('status');
      expect(agents[0]).toHaveProperty('avatar');
      expect(agents[0]).toHaveProperty('specialty');
    });

    it('should return cached agents on subsequent calls', async () => {
      const firstCall = await fetchAgents();
      const secondCall = await fetchAgents();

      // Should return the same reference (cached)
      expect(firstCall).toBe(secondCall);
    });

    it('should generate agents with valid status values', async () => {
      const agents = await fetchAgents();
      const validStatuses = ['online', 'busy', 'offline'];

      agents.forEach(agent => {
        expect(validStatuses).toContain(agent.status);
      });
    });

    it('should generate agents across all departments', async () => {
      const agents = await fetchAgents();
      const departmentsInAgents = new Set(agents.map(a => a.department));

      DEPARTMENTS.forEach(dept => {
        expect(departmentsInAgents.has(dept)).toBe(true);
      });
    });

    it('should generate agents with valid avatar URLs', async () => {
      const agents = await fetchAgents();

      agents.forEach(agent => {
        expect(agent.avatar).toMatch(/^https:\/\/api\.dicebear\.com/);
        expect(agent.avatar).toContain('seed=agent');
      });
    });

    it('should generate unique agent IDs', async () => {
      const agents = await fetchAgents();
      const ids = agents.map(a => a.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(400);
    });

    it('should distribute agents evenly across departments', async () => {
      const agents = await fetchAgents();
      const agentsPerDept = 400 / DEPARTMENTS.length;

      DEPARTMENTS.forEach(dept => {
        const count = agents.filter(a => a.department === dept).length;
        expect(count).toBe(agentsPerDept);
      });
    });

    it('should generate agents with non-empty names', async () => {
      const agents = await fetchAgents();

      agents.forEach(agent => {
        expect(agent.name).toBeTruthy();
        expect(agent.name.length).toBeGreaterThan(0);
      });
    });

    it('should generate agents with non-empty roles', async () => {
      const agents = await fetchAgents();

      agents.forEach(agent => {
        expect(agent.role).toBeTruthy();
        expect(agent.role.length).toBeGreaterThan(0);
      });
    });

    it('should generate agents with non-empty specialties', async () => {
      const agents = await fetchAgents();

      agents.forEach(agent => {
        expect(agent.specialty).toBeTruthy();
        expect(agent.specialty.length).toBeGreaterThan(0);
      });
    });
  });

  describe('subscribeToAgents', () => {
    it('should return unsubscribe function when Supabase is not configured', () => {
      const callback = vi.fn();
      const unsubscribe = subscribeToAgents(callback);

      expect(typeof unsubscribe).toBe('function');
      expect(() => unsubscribe()).not.toThrow();
    });

    it('should accept callback function without throwing', () => {
      const callback = vi.fn((agent: Agent) => {
        expect(agent).toBeDefined();
      });

      expect(() => subscribeToAgents(callback)).not.toThrow();
    });
  });

  describe('Mock Data Generation', () => {
    it('should generate consistent agent names with suffixes', async () => {
      const agents = await fetchAgents();

      // First agent should have no suffix
      expect(agents[0].name).not.toMatch(/-\d+$/);

      // Agents beyond the first set should have suffixes
      const laterAgent = agents.find(a => a.name.match(/-\d+$/));
      expect(laterAgent).toBeDefined();
    });

    it('should generate status distribution correctly', async () => {
      const agents = await fetchAgents();

      const onlineCount = agents.filter(a => a.status === 'online').length;
      const busyCount = agents.filter(a => a.status === 'busy').length;
      const offlineCount = agents.filter(a => a.status === 'offline').length;

      // Based on the generation logic:
      // offline: i % 5 === 0 (every 5th) = 400/5 = 80
      // busy: i % 3 === 0 && i % 5 !== 0 (every 3rd that's not every 5th)
      //   - i % 3 === 0 gives 134 agents (including index 0)
      //   - i % 15 === 0 gives 27 agents (overlaps with offline)
      //   - busy = 134 - 27 = 107
      // online: rest = 400 - 80 - 107 = 213

      expect(offlineCount).toBe(80); // 400 / 5
      expect(busyCount).toBe(107); // Fixed: (400 / 3 rounded up) - (400 / 15 rounded up)
      expect(onlineCount).toBe(213); // Fixed: rest
      expect(onlineCount + busyCount + offlineCount).toBe(400);
    });

    it('should generate agents with all required Agent interface properties', async () => {
      const agents = await fetchAgents();
      const requiredProps: (keyof Agent)[] = ['id', 'name', 'department', 'role', 'status', 'avatar', 'specialty'];

      agents.forEach(agent => {
        requiredProps.forEach(prop => {
          expect(agent).toHaveProperty(prop);
          expect(agent[prop]).toBeDefined();
        });
      });
    });

    it('should generate agents with valid department from DEPARTMENTS constant', async () => {
      const agents = await fetchAgents();

      agents.forEach(agent => {
        expect(DEPARTMENTS).toContain(agent.department as typeof DEPARTMENTS[number]);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should maintain referential integrity across fetches', async () => {
      const firstFetch = await fetchAgents();
      const secondFetch = await fetchAgents();

      // Same length
      expect(firstFetch.length).toBe(secondFetch.length);

      // Same agents
      firstFetch.forEach((agent, index) => {
        expect(agent.id).toBe(secondFetch[index].id);
        expect(agent.name).toBe(secondFetch[index].name);
      });
    });

    it('should return valid Agent types', async () => {
      const agents = await fetchAgents();

      agents.forEach(agent => {
        // Type checks
        expect(typeof agent.id).toBe('string');
        expect(typeof agent.name).toBe('string');
        expect(typeof agent.department).toBe('string');
        expect(typeof agent.role).toBe('string');
        expect(['online', 'busy', 'offline']).toContain(agent.status);
        expect(typeof agent.avatar).toBe('string');
        expect(typeof agent.specialty).toBe('string');
      });
    });
  });
});
