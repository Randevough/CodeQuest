import { describe, it, expect } from 'vitest';
import { TARGET_ROUTES, getMockHtml, auditHtml, runAudit } from '../../scripts/audit-lighthouse.mjs';

interface AuditDetailScore {
  score: number;
  details: Record<string, boolean>;
}

interface SingleAuditOutput {
  seo: AuditDetailScore;
  accessibility: AuditDetailScore;
  security: AuditDetailScore;
  performance: AuditDetailScore;
}

interface AuditRouteResult extends SingleAuditOutput {
  route: string;
  passed: boolean;
}

describe('Lighthouse & Accessibility Quality Gates', () => {
  it('covers all designated core application routes', () => {
    expect(TARGET_ROUTES).toEqual(['/', '/explore', '/leaderboard', '/login']);
  });

  TARGET_ROUTES.forEach((route: string) => {
    describe(`Route: ${route}`, () => {
      const mock = getMockHtml(route) as { html: string; headers: Record<string, string> };
      const audit = auditHtml(mock.html, mock.headers) as SingleAuditOutput;

      it('satisfies SEO audit threshold (>= 90%)', () => {
        expect(audit.seo.score).toBeGreaterThanOrEqual(90);
        expect(audit.seo.details.hasTitle).toBe(true);
        expect(audit.seo.details.hasDescription).toBe(true);
      });

      it('satisfies Accessibility audit threshold (>= 90%)', () => {
        expect(audit.accessibility.score).toBeGreaterThanOrEqual(90);
        expect(audit.accessibility.details.hasMainLandmark).toBe(true);
        expect(audit.accessibility.details.imagesHaveAlt).toBe(true);
        expect(audit.accessibility.details.inputsHaveLabels).toBe(true);
        expect(audit.accessibility.details.buttonsHaveAccessibleName).toBe(true);
      });

      it('satisfies Security headers audit threshold (>= 90%)', () => {
        expect(audit.security.score).toBeGreaterThanOrEqual(90);
        expect(audit.security.details.contentSecurityPolicy).toBe(true);
        expect(audit.security.details.strictTransportSecurity).toBe(true);
        expect(audit.security.details.xFrameOptions).toBe(true);
      });

      it('satisfies Performance & Caching audit threshold (>= 90%)', () => {
        expect(audit.performance.score).toBeGreaterThanOrEqual(90);
        expect(audit.performance.details.fontPreloadOrOptimized).toBe(true);
        expect(audit.performance.details.staticAssetCaching).toBe(true);
      });
    });
  });

  it('runs complete audit runner and passes all quality gates', async () => {
    const outcome = await (runAudit() as Promise<{ results: AuditRouteResult[]; passed: boolean }>);
    expect(outcome.passed).toBe(true);
    expect(outcome.results).toHaveLength(TARGET_ROUTES.length);
    outcome.results.forEach((r) => {
      expect(r.passed).toBe(true);
      expect(r.seo.score).toBeGreaterThanOrEqual(90);
      expect(r.accessibility.score).toBeGreaterThanOrEqual(90);
      expect(r.security.score).toBeGreaterThanOrEqual(90);
      expect(r.performance.score).toBeGreaterThanOrEqual(90);
    });
  });
});
