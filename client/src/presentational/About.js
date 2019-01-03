import React from 'react';
import '../css/About.css';
import '../css/tailwind.css';

const About = () => (
  <div className="text-left">
    <div className="title2 text-center">
      {'About Juke Jam'}
    </div>
    <div id="how">
      <div className="subtitles">
        {'How To Use'}
      </div>
      <div id="howHost">
        {'Hosts:'}
      </div>
      <ol>
        <li className="listItem">
          {'Login into Apple Music to connect your account with Juke Jam.'}
        </li>
        <li className="listItem">
          {'Select the playlist you would like to add recommendations to and set a '}
          {'limit for the maximum number of recommendations per person.'}
        </li>
        <li className="listItem">
          {'Send guests a link to your lobby so they can begin recommending songs. '}
        </li>
        <li className="listItem">
          {'Click the "Refresh" button to see the latest list of recommended songs. '}
        </li>
        <li className="listItem">
          {'Click the "Add" button to add the corresponding song to your playlist or '}
          {'the "Delete" button to remove that recommendation.'}
        </li>
      </ol>
      <div id="howGuest">
        {'Guests: '}
      </div>
      <ol>
        <li className="listItem">
          {'Enter your host\'s unique code or receive a direct link from your host to their lobby.'}
        </li>
        <li className="listItem">
          {'Search by song, artist, or album and see relevent tracks that can be '}
          {'recommended to the host.'}
        </li>
        <li className="listItem">
          {'Click the "Add" button to recommend the corresponding song to the host. '}
        </li>
      </ol>
    </div>
    <div>
      {'Check out some other of my projects '}
      <a href="https://www.alexandroforte.com" className="link">
        {'HERE'}
      </a>
      .
    </div>
    <div>
      <a href="/" className="link">
        {'Return to Juke Jam'}
      </a>
    </div>
  </div>
);

export default About;
