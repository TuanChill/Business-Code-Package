// TEAM_001: Unit tests for BusinessMessageProvider, including custom (non-built-in) locales
import { BusinessMessageProvider } from './message-provider';

describe('BusinessMessageProvider', () => {
  describe('built-in locales', () => {
    it('returns the English built-in message', () => {
      const provider = new BusinessMessageProvider({ locale: 'en' });
      expect(provider.getMessage(2001)).toBe('User not found');
    });

    it('returns the Vietnamese built-in message', () => {
      const provider = new BusinessMessageProvider({ locale: 'vi' });
      expect(provider.getMessage(2001)).not.toBe('User not found');
    });
  });

  describe('custom locales', () => {
    it('returns a registered message for an arbitrary locale tag', () => {
      const provider = new BusinessMessageProvider({ locale: 'fr' });
      provider.registerMessages('fr', { 0: 'Opération réussie' });

      expect(provider.getMessage(0, 'fr')).toBe('Opération réussie');
    });

    it('falls back to the fallback locale, then to the default unknown message, for an unregistered code in a custom locale', () => {
      const provider = new BusinessMessageProvider({ locale: 'fr', fallbackLocale: 'en' });
      provider.registerMessages('fr', { 0: 'Opération réussie' });

      // Code 2001 has no 'fr' override, but built-in 'en' has it.
      expect(provider.getMessage(2001, 'fr')).toBe('User not found');

      // Unknown code in every locale falls back to the English unknown message.
      expect(provider.getMessage(999999, 'fr')).toBe('Unknown error');
    });

    it('hasMessage reports true for a registered custom-locale message and false otherwise', () => {
      const provider = new BusinessMessageProvider({ locale: 'fr' });
      provider.registerMessages('fr', { 0: 'Opération réussie' });

      expect(provider.hasMessage(0, 'fr')).toBe(true);
      expect(provider.hasMessage(999999, 'fr')).toBe(false);
    });
  });
});
