import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const LOCALES_DIR = resolve(__dirname, '../public/locales');
const REQUIRED_KEYS = [
  'title', 'room_code_label', 'room_code_placeholder',
  'submit', 'invalid_code', 'network_error', 'timeout',
  'service_unavailable', 'success',
];

function loadLocale(lang: string) {
  const raw = readFileSync(resolve(LOCALES_DIR, lang, 'common.json'), 'utf-8');
  return JSON.parse(raw) as Record<string, Record<string, string>>;
}

(['en', 'es'] as const).forEach((lang) => {
  describe(`${lang}/common.json — join_room i18n`, () => {
    const data = loadLocale(lang);

    it('has a join_room namespace', () => {
      expect(data.join_room).toBeDefined();
    });

    REQUIRED_KEYS.forEach((key) => {
      it(`has non-empty key: join_room.${key}`, () => {
        expect(typeof data.join_room[key]).toBe('string');
        expect(data.join_room[key].trim().length).toBeGreaterThan(0);
      });
    });

    it('network_error mentions network or connection', () => {
      const msg = data.join_room.network_error.toLowerCase();
      expect(msg.includes('network') || msg.includes('connection') || msg.includes('red') || msg.includes('conexión')).toBe(true);
    });

    it('timeout mentions timeout or expiry', () => {
      const msg = data.join_room.timeout.toLowerCase();
      expect(msg.includes('timeout') || msg.includes('timed') || msg.includes('expiró') || msg.includes('expired')).toBe(true);
    });
  });
});
