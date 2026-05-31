import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { BusinessMessageProvider, useBusinessMessage } from '@tchil/business-codes/i18n/react';
import { BusinessCode } from '@tchil/business-codes';

function makeWrapper(locale: 'en' | 'vi') {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BusinessMessageProvider locale={locale}>
        {children}
      </BusinessMessageProvider>
    );
  };
}

describe('useBusinessMessage', () => {
  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useBusinessMessage())).toThrow(
      'useBusinessMessage must be used within a BusinessMessageProvider',
    );
  });

  it('getMessage(0) returns English success message', () => {
    const { result } = renderHook(() => useBusinessMessage(), {
      wrapper: makeWrapper('en'),
    });
    expect(typeof result.current.getMessage(0)).toBe('string');
    expect(result.current.getMessage(0).length).toBeGreaterThan(0);
  });

  it('getMessage returns different strings for en vs vi', () => {
    const { result: enResult } = renderHook(() => useBusinessMessage(), {
      wrapper: makeWrapper('en'),
    });
    const { result: viResult } = renderHook(() => useBusinessMessage(), {
      wrapper: makeWrapper('vi'),
    });
    const enMsg = enResult.current.getMessage(BusinessCode.USER_NOT_FOUND);
    const viMsg = viResult.current.getMessage(BusinessCode.USER_NOT_FOUND);
    expect(typeof enMsg).toBe('string');
    expect(typeof viMsg).toBe('string');
    expect(enMsg).not.toBe(viMsg);
  });

  it('getResponseMessage returns message for error response with code', () => {
    const { result } = renderHook(() => useBusinessMessage(), {
      wrapper: makeWrapper('en'),
    });
    const msg = result.current.getResponseMessage({
      success: false,
      error: { code: BusinessCode.USER_NOT_FOUND },
    });
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('getResponseMessage returns response.message for success response', () => {
    const { result } = renderHook(() => useBusinessMessage(), {
      wrapper: makeWrapper('en'),
    });
    const msg = result.current.getResponseMessage({
      success: true,
      message: 'Done',
    });
    expect(msg).toBe('Done');
  });

  it('locale prop is exposed on context', () => {
    const { result } = renderHook(() => useBusinessMessage(), {
      wrapper: makeWrapper('vi'),
    });
    expect(result.current.locale).toBe('vi');
  });
});
