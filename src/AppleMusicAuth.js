export default class AppleMusicAuth {
  static sharedProvider() {
    if (!AppleMusicAuth.instance) {
      AppleMusicAuth.instance = new AppleMusicAuth();
    }
    return AppleMusicAuth.instance;
  }

  configure() { //eslint-disable-line
    window.MusicKit.configure({
      developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkdHSzVONUEyTkcifQ.eyJpYXQiOjE1MzE4NzE2NjcsImV4cCI6MTU0NzQyMzY2NywiaXNzIjoiOUwzRDY3NlUyNSJ9.yfVs40BYUDIqHTSWQspOvaJzqlGv0BGmtZVAbUDXiu4xRcIVL70Ke0KAxt_65J6PCMtsccck3cvMI6e-1vbssQ',
      app: {
        name: 'Juke Jam',
        build: '2018.7.17',
      },
    });
  }

  static getMusicInstance() {
    return window.MusicKit.getInstance();
  }
}
