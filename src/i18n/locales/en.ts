/**
 * English Messages for Business Codes
 *
 * Default English translations for all business error codes.
 * Derived from the canonical `businessCodeMessages` table in `constants/business-codes.ts`
 * so the two do not drift apart.
 */

import { MessageMap } from '../types';
import { businessCodeMessages } from '../../constants/business-codes';

export const enMessages: MessageMap = businessCodeMessages;
