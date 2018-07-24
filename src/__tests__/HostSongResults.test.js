import React from 'react';
import { shallow, mount, render } from 'enzyme';
import HostSongResults from '../HostSongResults';

it('should be selectable by class "foo"', function () {
  expect(shallow(<HostSongResults />).is('.recommendedSongs')).toBe(true);
});
