import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

it('destroys the calendar', () => {
  const cal: CalHeatmap = new CalHeatmap();
  select('body').append('div').attr('id', 'cal-heatmap');

  cal.init({ range: 1 });
  expect(select('#cal-heatmap').selectAll('.graph-domain').size()).toBe(1);

  cal.destroy(() => {
    expect(select('#cal-heatmap').html()).toBe('');
  });
});

it('also destroys the legend', () => {
  const cal: CalHeatmap = new CalHeatmap();
  select('body').append('div').attr('id', 'cal-heatmap');

  cal.init({ range: 1, legend: { show: true } });
  expect(select('.graph-legend').size()).toBe(1);

  cal.destroy(() => {
    expect(select('.graph-legend').size()).toBe(0);
  });
});