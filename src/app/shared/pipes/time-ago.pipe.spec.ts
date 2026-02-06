import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return "just now" for recent dates', () => {
    const now = new Date();
    expect(pipe.transform(now.toISOString())).toBe('just now');
  });

  it('should return minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(date.toISOString())).toBe('5 minutes ago');
  });

  it('should return "1 minute ago" for singular', () => {
    const date = new Date(Date.now() - 1 * 60 * 1000);
    expect(pipe.transform(date.toISOString())).toBe('1 minute ago');
  });

  it('should return hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(pipe.transform(date.toISOString())).toBe('3 hours ago');
  });

  it('should return "1 hour ago" for singular', () => {
    const date = new Date(Date.now() - 1 * 60 * 60 * 1000);
    expect(pipe.transform(date.toISOString())).toBe('1 hour ago');
  });

  it('should return days ago', () => {
    const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date.toISOString())).toBe('5 days ago');
  });

  it('should return "1 day ago" for singular', () => {
    const date = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date.toISOString())).toBe('1 day ago');
  });

  it('should return months ago', () => {
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date.toISOString())).toBe('2 months ago');
  });

  it('should return years ago', () => {
    const date = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(date.toISOString())).toBe('1 year ago');
  });

  it('should handle Date objects', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(date)).toBe('5 minutes ago');
  });

  it('should handle future dates', () => {
    const date = new Date(Date.now() + 60 * 60 * 1000);
    expect(pipe.transform(date.toISOString())).toBe('in the future');
  });
});
