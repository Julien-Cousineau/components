import http from 'http'
import app from './server'
const server = http.createServer(app)
let currentApp = app


server.listen(8080,'0.0.0.0', function() {
  console.log('Webserver is listening on port %d!',PORT);
});
if (module.hot) {
 module.hot.accept('./server', () => {
  server.removeListener('request', currentApp)
  server.on('request', app)
  currentApp = app
 })
}