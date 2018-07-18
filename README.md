# Juke Jam

TO DO:
1. Refactor code into intelligent components.
2. Change from Spotify to Apple Music
3. Add database.

Guest Requests:
1. Enter lobby (server)
  - Data sent:
    - Input lobby code
  - Data received:
    - Boolean of whether server exists
2. Get tracks (Apple Music)
  - Data sent:
    - Search query
  - Data received:
    - object with results
3. Recommend song (server)
  - Data sent:
    - Song ID
    - Lobby code
  - Data received:
    - Boolean of whether request was sent or not

Host Requests
1. Get playlists (Apple Music)
  - Data sent:
    - User ID
  - Data received:
    - object with results
2. Set lobby (server)
  - Data sent:
    - Playlist ID
    - Max recommendations
  - Data received:
    - Promise
3. Get recommendations (server)
  - Data sent:
    - lobby code
  - Data received:
    - object with results
4. Add song (Apple Music)
  - Data sent:
    - song ID and maybe user ID
  - Data received:
    - Promise
  NOTE: calls `Delete song` in this function always
5. Delete song (server)
  - Data sent:
    - lobby code, song ID
  - Data received:
    - Promise

Getting Apple Music API Keys:
https://help.apple.com/developer-account/#/devce5522674
