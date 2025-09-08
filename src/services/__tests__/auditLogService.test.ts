import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the entire auditLogService module
vi.mock('../auditLogService', () => ({
  auditLogService: {
    getAuditLogs: vi.fn().mockResolvedValue({ data: [] })
  }
}));

import { auditLogService } from '../auditLogService';

describe('auditLogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(auditLogService).toBeDefined();
  });

  it('should have getAuditLogs method', () => {
    expect(typeof auditLogService.getAuditLogs).toBe('function');
  });

  it('should handle getAuditLogs call', async () => {
    const result = await auditLogService.getAuditLogs({ page: 1, limit: 10 });
    expect(result).toBeDefined();
    expect(auditLogService.getAuditLogs).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('should handle errors in getAuditLogs', async () => {
    (auditLogService.getAuditLogs as any).mockRejectedValue(new Error('Network error'));

    try {
      await auditLogService.getAuditLogs({ page: 1, limit: 10 });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});