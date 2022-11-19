import {
  generateTimeInterval,
  getTimeInterval,
} from '../../src/utils/timeInterval';

import Moment from 'moment-timezone';
import MomentRange from 'moment-range';

const moment = MomentRange.extendMoment(Moment);
const tz = moment.tz.defaultZone;

const DEFAULT_LOCALE = 'en';

describe('TimeInterval', () => {
  const date = new Date('2020-01-02T04:24:25.256Z');

  const expectations = {
    minute: [
      new Date('2020-01-02T04:24:00.000Z'),
      new Date('2020-01-02T04:25:00.000Z'),
      new Date('2020-01-02T04:26:00.000Z'),
    ],
    hour: [
      new Date('2020-01-02T04:00:00.000Z'),
      new Date('2020-01-02T05:00:00.000Z'),
      new Date('2020-01-02T06:00:00.000Z'),
    ],
    day: [
      new Date('2020-01-02T00:00:00.000Z'),
      new Date('2020-01-03T00:00:00.000Z'),
      new Date('2020-01-04T00:00:00.000Z'),
    ],
    week_fr: [
      new Date('2019-12-30T00:00:00.000Z'),
      new Date('2020-01-06T00:00:00.000Z'),
      new Date('2020-01-13T00:00:00.000Z'),
    ],
    week: [
      new Date('2019-12-29T00:00:00.000Z'),
      new Date('2020-01-05T00:00:00.000Z'),
      new Date('2020-01-12T00:00:00.000Z'),
    ],
    month: [
      new Date('2020-01-01T00:00:00.000Z'),
      new Date('2020-02-01T00:00:00.000Z'),
      new Date('2020-03-01T00:00:00.000Z'),
    ],
    year: [
      new Date('2020-01-01T00:00:00.000Z'),
      new Date('2021-01-01T00:00:00.000Z'),
      new Date('2022-01-01T00:00:00.000Z'),
    ],
  };

  const testRun = (interval, locale) => {
    const toUnix = (a) => a.map((k) => +k);

    describe(`With moment [${locale}] locale`, () => {
      moment.locale(locale);
      let intervalKey = interval;
      if (locale !== DEFAULT_LOCALE) {
        intervalKey = `${interval}_${locale}`;
      }

      describe('#generateTimeInterval', () => {
        describe(`on ${interval} interval`, () => {
          describe('when date args is a Date', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = generateTimeInterval(interval, date, 1);
              expect(intervals).toEqual([+expectations[intervalKey][0]]);
            });
          });

          describe('when date args is a number', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = generateTimeInterval(interval, +date, 1);
              expect(intervals).toEqual(toUnix([expectations[intervalKey][0]]));
            });
          });

          describe('when range args is a number (1)', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = generateTimeInterval(interval, date, 1);
              expect(intervals).toEqual(toUnix([expectations[intervalKey][0]]));
            });
          });

          describe('when range args is a number (>1)', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = generateTimeInterval(interval, date, 3);
              expect(intervals).toEqual(toUnix(expectations[intervalKey]));
            });
          });

          describe('when range args is a date (domain +1)', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = generateTimeInterval(
                interval,
                date,
                expectations[intervalKey][0],
              );
              expect(intervals).toEqual(toUnix([expectations[intervalKey][0]]));
            });
          });

          describe('when range args is a date (domain >1)', () => {
            it(`returns an array of ${interval} intervals`, () => {
              const intervals = generateTimeInterval(
                interval,
                date,
                expectations[intervalKey][2],
              );

              expect(intervals).toEqual(toUnix(expectations[intervalKey]));
            });
          });
        });
      });

      describe('#getTimeInterval', () => {
        describe(`on ${interval} interval`, () => {
          it(`returns an the timestamp of the start of ${interval} intervals`, () => {
            const result = getTimeInterval(interval, date);
            expect(result).toEqual(+expectations[intervalKey][0]);
          });

          describe('when requesting a moment object', () => {
            it('returns a moment object', () => {
              const result = getTimeInterval(interval, date, true);
              expect(+result).toEqual(
                +moment.tz(expectations[intervalKey][0], tz),
              );
              expect(result).toBeInstanceOf(moment);
            });
          });
        });
      });
    });
  };

  Object.keys(expectations).forEach((key) => {
    const [interval, locale] = key.split('_');

    testRun(interval, locale || DEFAULT_LOCALE);
  });
});