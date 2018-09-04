import React from 'react';
import { shallow } from 'enzyme';
import HostSongResults from '../presentational/HostSongResults';

it('should be selectable by class "recommendedSongs"', function () {
  expect(shallow(<HostSongResults />).is('.recommendedSongs')).toBe(true);
});
