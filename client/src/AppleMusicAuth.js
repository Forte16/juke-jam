export default class AppleMusicAuth {
  static sharedProvider() {
    if (!AppleMusicAuth.instance) {
      AppleMusicAuth.instance = new AppleMusicAuth();
    }
    return AppleMusicAuth.instance;
  }

  configure() { //eslint-disable-line
    return new Promise(function (resolve, reject) {
      let key = "JukeJam-3OY6MXSIAB";
      fetch(`https://www.alexandroforte.com/getTokens?key=${key}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (response.status === 404) {
          reject();
        }
        return response.json();
      }).then((resp) => {
        window.MusicKit.configure({
          developerToken: resp.devtoken,
          app: {
            name: 'Juke Jam',
            build: '2019.1.17',
          },
        });
        resolve();
      });
    });
  }

  static getMusicInstance() {
    return window.MusicKit.getInstance();
  }
}
