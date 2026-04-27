import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Condition, WaitingListEntry } from '../api/ambulance-wl';

const sampleConditions: Condition[] = [
  { code: 'headache', value: 'Bolesť hlavy', typicalDurationMinutes: 15, reference: 'https://zdravoteka.sk/priznaky/bolest-hlavy/' },
  { code: 'nausea', value: 'Nevoľnosť', typicalDurationMinutes: 25, reference: 'https://zdravoteka.sk/priznaky/nevolnost/' },
  { code: 'followup', value: 'Pravidelná kontrola', typicalDurationMinutes: 25 },
  { code: 'subfebrilia', value: 'Subfebrília', typicalDurationMinutes: 20, reference: 'https://zdravoteka.sk/priznaky/zvysena-telesna-teplota/' },
  { code: 'blood-test', value: 'Odber krvi', typicalDurationMinutes: 10 },
  { code: 'administration', value: 'Administratíva', typicalDurationMinutes: 5 },
];

const baseDate = new Date();
function isoFromOffset(minutesAgo: number): string {
  return new Date(baseDate.getTime() - minutesAgo * 60_000).toISOString();
}

const sampleEntries: WaitingListEntry[] = [
  {
    id: 'entry-1',
    name: 'Jožko Púčik',
    patientId: '10001',
    waitingSince: isoFromOffset(45),
    estimatedStart: isoFromOffset(-15),
    estimatedDurationMinutes: 15,
    condition: sampleConditions[0],
  },
  {
    id: 'entry-2',
    name: 'Mária Vyšná',
    patientId: '10002',
    waitingSince: isoFromOffset(20),
    estimatedStart: isoFromOffset(-30),
    estimatedDurationMinutes: 25,
    condition: sampleConditions[1],
  },
  {
    id: 'entry-3',
    name: 'Peter Adamovský',
    patientId: '10003',
    waitingSince: isoFromOffset(5),
    estimatedStart: isoFromOffset(-50),
    estimatedDurationMinutes: 25,
    condition: sampleConditions[2],
  },
];

let entries: WaitingListEntry[] = [...sampleEntries];
let conditions: Condition[] = [...sampleConditions];
let installed = false;

export function isAzureStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.endsWith('azurewebsites.net');
}

export function installAzureDemoMock(): void {
  if (installed) return;
  installed = true;

  const mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });

  mock.onGet(/\/api\/waiting-list\/[^/]+\/condition$/).reply(() => {
    return [200, conditions];
  });

  mock.onGet(/\/api\/waiting-list\/[^/]+\/entries\/[^/?]+(\?.*)?$/).reply((cfg) => {
    const url = new URL(cfg.url!, 'http://x');
    const id = url.pathname.split('/').pop()!;
    const found = entries.find((e) => e.id === id);
    return found ? [200, found] : [404, { error: 'entry not found' }];
  });

  mock.onGet(/\/api\/waiting-list\/[^/]+\/entries(\?.*)?$/).reply(() => {
    return [200, entries];
  });

  mock.onPost(/\/api\/waiting-list\/[^/]+\/entries$/).reply((cfg) => {
    const body = JSON.parse(cfg.data) as WaitingListEntry;
    const newId = 'entry-' + Math.random().toString(36).slice(2, 8);
    const created: WaitingListEntry = { ...body, id: newId };
    entries = [...entries, created];
    return [201, created];
  });

  mock.onPut(/\/api\/waiting-list\/[^/]+\/entries\/[^/?]+$/).reply((cfg) => {
    const id = cfg.url!.split('/').pop()!;
    const idx = entries.findIndex((e) => e.id === id);
    if (idx < 0) return [404, { error: 'entry not found' }];
    const body = JSON.parse(cfg.data) as WaitingListEntry;
    const updated: WaitingListEntry = { ...body, id };
    entries = [...entries.slice(0, idx), updated, ...entries.slice(idx + 1)];
    return [200, updated];
  });

  mock.onDelete(/\/api\/waiting-list\/[^/]+\/entries\/[^/?]+$/).reply((cfg) => {
    const id = cfg.url!.split('/').pop()!;
    const idx = entries.findIndex((e) => e.id === id);
    if (idx < 0) return [404, { error: 'entry not found' }];
    entries = [...entries.slice(0, idx), ...entries.slice(idx + 1)];
    return [204];
  });
}
