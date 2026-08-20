import test from 'node:test';
import assert from 'node:assert/strict';
import { reportingPeriods, toCsv } from '../scripts/lib/common.mjs';

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
