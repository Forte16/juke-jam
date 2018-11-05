import React from 'react';
import { shallow } from 'enzyme';
import HostSongResults from '../presentational/Playlist';

it('should be selectable by class "playlist"', function () {
  expect(shallow(<Playlist />).is('.playlist')).toBe(true);
});
