const crypto = require('crypto');
var Buffer = require('buffer/').Buffer;

// First we get our unique key to encrypt our object
const password ="123"
const iv = Buffer.from('81dFxOpX7BPG1UpZQPcS6w==', 'base64');
// Function to find SHA1 Hash of password key
function sha1(input) {
  return crypto.createHash('sha1').update(input).digest();
}

//Function to get secret key for encryption and decryption using the password
function password_derive_bytes(password, salt, iterations, len) {
  var key = Buffer.from(password + salt);
  for (var i = 0; i < iterations; i++) {
    key = sha1(key);
  }
  if (key.length < len) {
    var hx = password_derive_bytes(password, salt, iterations - 1, 20);
    for (var counter = 1; key.length < len; ++counter) {
      key = Buffer.concat([
        key,
        sha1(Buffer.concat([Buffer.from(counter.toString()), hx])),
      ]);
    }
  }
  return Buffer.alloc(len, key);
}

// Function to encode the object
async function encode(string) {
  var key = password_derive_bytes(password, '', 100, 32);
  // Initialize Cipher Object to encrypt using AES-256 Algorithm
  var cipher = crypto.createCipheriv('aes-256-cbc', key,iv);
  var encryptedData = cipher.update(string, 'utf8', 'base64') + cipher.final('base64');
  return encryptedData;
  
}

// Function to decode the object
async function decode(string) {
  var key = password_derive_bytes(password, '', 100, 32);
  // Initialize decipher Object to decrypt using AES-256 Algorithm
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  var decrypted = decipher.update(string, 'base64', 'utf8')+ decipher.final('utf8');

  return decrypted;
}

module.exports = { encode, decode };
