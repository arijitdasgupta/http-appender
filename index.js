const express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const application = express();

const filename = process.env['FILENAME'] ? `${process.env['FILENAME']}.log` : 'http-appender.log';
const port = isNaN(parseInt(process.env['PORT'])) ? 8300 : parseInt(process.env['PORT']);

const filepath = path.resolve('.', 'log_dump', filename);

application.set('port', port);
application.use(bodyParser.raw({ 
  inflate: true,
  limit: '100kb',
  type: '*/*'
}));

application.post('/', (req, res) => {
  fs.appendFile(filepath, req.body, () => { //TODO: Bad nesting
    fs.appendFile(filepath, '\n', () => {
      res.send('OK');
    })
  });
});

application.listen(application.get('port'), () => {
  console.info(`Listening on ${application.get('port')}`);
});