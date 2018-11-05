import React from 'react';
import '../css/About.css';
import '../css/tailwind.css';

const About = () => (
  <div className="main2">
    <div className="title2">
      {'About Juke Jam'}
    </div>
    <div id="how">
      <div className="subtitles">
        {'How To Use'}
      </div>
      <div id="howHost">
        {'Hosts:'}
      </div>
      <ol id="hostList">
        <li>
          {'Login into Apple Music to connect your account with Juke Jam.'}
        </li>
        <li>
          {'Select the playlist you would like to add recommendations to and set a '}
          {'limit for the maximum number of recommendations per person.'}
        </li>
        <li>
          {'Send guests a link to your lobby so they can begin recommending songs. '}
        </li>
        <li>
          {'Click the "Refresh" button to see the latest list of recommended songs. '}
        </li>
        <li>
          {'Click the "Add" button to add the corresponding song to your playlist, '}
          {'otherwise click the "Delete" button to remove that recommendation.'}
        </li>
      </ol>
      <div id="howGuest">
        {'Guests: '}
      </div>
      <ol id="guestList">
        <li>
          {'Enter your host\'s unique code or receive a direct link from your host to their lobby.'}
        </li>
        <li>
          {'Search by song, artist, or album and see relevent tracks that can be '}
          {'recommended to the host.'}
        </li>
        <li>
          {'Click the "Add" button to recommend the corresponding song to the host. '}
          {'NOTE: You will be alerted if your recommendation does not go through '}
          {'because you exceeded the maximum number of recommendations per person  '}
          {'set by the host.'}
        </li>
      </ol>
    </div>
    <div id="oooTellEm">
      {'Check out some other of my projects'}
      <a href="https:www.alexandroforte.com" className="goToWebsite">
        {' HERE'}
      </a>
      .
    </div>
    <div className="center2">
      <a href="/" className="goToWebsite">
        {'Return to Juke Jam'}
      </a>
    </div>
  </div>
);

export default About;
