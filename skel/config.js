// The //# is option
module.exports = {
  port: 3001, // Website listen port.

  //# host: undefined, // Website listen host.

  secure : null, // http model
  /*
    // Or provide an Object to enter https model: 
    secure: {
      keyPath: '/xxx/xxx',
      certPath: '/xxx/xxx',
      // or
      pfxPath:  '/xxx/xxx', // eq keyPath + certPath
      
      //... Other options same as https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options
    },
  */
  
  trustProxy: false, // If you used proxy, You need set it. 
  // Otherwise, you will not get the real IP when you login.
  // You can't set it true.
  // More settings:  https://expressjs.com/en/guide/behind-proxies.html

  client: {
    cdn: false // Use CDN to load client static files. The URL pattern must be the same as  https://unpkg.com. 
    // Set it to false, will install and load client static module from server.
    /* Some Public CDN root URLs:
        https://unpkg.com
        https://cdn.jsdelivr.net/npm
    */
  },

  //# log: undefined, // undefined be equal to "/dev/null"

  errLog: '/tmp/linux-remote-err.log'
};