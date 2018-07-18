const fs = require('fs');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync('AuthKey.p8').toString();
const teamId = '9L3D676U25';
const keyId = 'GGK5N5A2NG';

const jwtToken = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  issuer: teamId,
  header: {
    alg: 'ES256',
    kid: keyId,
  },
});

console.log(jwtToken);
