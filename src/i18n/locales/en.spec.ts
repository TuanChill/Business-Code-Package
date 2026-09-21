// TEAM_001: Unit tests proving enMessages stays derived from the canonical business-codes table
import { enMessages } from './en';
import { businessCodeMessages } from '../../constants/business-codes';

describe('enMessages', () => {
  it('is identical to the canonical businessCodeMessages table', () => {
    expect(enMessages).toEqual(businessCodeMessages);
  });

  it('has the same number of entries as businessCodeMessages', () => {
    expect(Object.keys(enMessages)).toHaveLength(Object.keys(businessCodeMessages).length);
  });
});
