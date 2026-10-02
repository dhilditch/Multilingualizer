import test from 'node:test';
import assert from 'node:assert/strict';
import { reportingPeriods, searchTotals, toCsv } from '../scripts/lib/common.mjs';

test('reportingPeriods creates adjacent 28-day windows after the lag', () => {
  const periods = reportingPeriods(3, 28, new Date('2026-08-20T12:00:00Z'));
  assert.deepEqual(periods, {
    current: { startDate: '2026-07-21', endDate: '2026-08-17' },
    previous: { startDate: '2026-06-23', endDate: '2026-07-20' }
  });
});

test('toCsv quotes commas, quotes and newlines', () => {
  assert.equal(toCsv([{ a: 'one,two', b: 'a"b' }], ['a', 'b']), 'a,b\n"one,two","a""b"\n');
});

test('search totals include searches hidden from query reports', () => {
  assert.deepEqual(searchTotals({
    dates: [{ date: '2026-09-01', clicks: 7, impressions: 100 }, { date: '2026-09-02', clicks: 2, impressions: 30 }],
    queries: [{ query: 'weglot pricing', clicks: 1, impressions: 20 }]
  }), { clicks: 9, impressions: 130 });
});
