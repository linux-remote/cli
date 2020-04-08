// The //# is option
module.exports = {
  port: 3000, // Website listen port.

  //# host: undefined, // Website listen host.

  secure : null, // http model
  /*
    // Or provide an Object to enter https model: 
    secure: {
      keyPath: '/xxx/xxx',
      certPath: '/xxx/xxx',
      pfxPath:  '/xxx/xxx', // eq keyPath + certPath
      caPath: '/xxx/xxx', // Optionally
      //... Other options same as https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options
    },
  */

  cookie: {
    //# secure: undefined,
    sameSite: 'None'
  },
  
  trustProxy: false, // Boolean, If you used proxy, You need set it. 
  // Otherwise, you will not get the real IP when you login.
  // And you can't set it true.
  // More settings:  https://expressjs.com/en/guide/behind-proxies.html

  
  client: { // Server include client. 
    cdn: false // Is use https://unpkg.com to load client static file.
  }
};