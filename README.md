Demo web browser crypto test

This uses Webcrypto API to generate "cryptokens" in the browser.  The purpose is to demonstrate the capability to cyrptographically tokenise (or cryptokenise) sensitive fields so they are not accessible beyond the browser, and only recoverable once returned to the browser.

The Index.html makes use of the various libraries and implements a test protocol.  The main application is stored under webcryptotest.js, whic contains all the methods used:
- MakeKeys - makes a base64-encoded AES-128 symmetric encryption/decryption key
- MakeVector - makes a base64-encoded 16-bit random vector using 
- EncryptFields - Encrypts fields given a text Datafield, key and vector
- DecryptFields - Decrypts fields given a cyphertext, key and vector

All the above methods work with HTML data fields.


