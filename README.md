# Juke Jam

[![Build Status](https://travis-ci.com/forte/juke-jam.svg?token=759c3Sz9dwdshoUPwoqG&branch=master)](https://travis-ci.com/forte/juke-jam)

TO DO:
1. Change from Spotify to Apple Music
2. Add database.

Guest Requests:
1. Enter lobby (server)
  - Data sent:
    - Input lobby code
  - Data received:
    - Boolean of whether server exists

Host Requests
1. Set lobby (server)
  - Data sent:
    - Playlist ID
    - Max recommendations
  - Data received:
    - Promise
2. Get recommendations (server)
  - Data sent:
    - lobby code
  - Data received:
    - object with results
3. Add song (Apple Music)
  - Data sent:
    - song ID and maybe user ID
  - Data received:
    - Promise
  NOTE: calls `Delete song` in this function always
4. Delete song (server)
  - Data sent:
    - lobby code, song ID
  - Data received:
    - Promise

Getting Apple Music API Keys:
https://help.apple.com/developer-account/#/devce5522674
