import React from 'react';
import { shallow } from 'enzyme';
import HostSongResults from '../presentational/HostSongResults';

it('should be selectable by class "playlist"', function () {
  expect(shallow(<HostSongResults />).is('.playlist')).toBe(true);
});
