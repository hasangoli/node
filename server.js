import http from 'http';

const todos = [
  {
    id: 0,
    text: 'Todo One',
  },
  {
    id: 1,
    text: 'Todo Two',
  },
  {
    id: 2,
    text: 'Todo three',
  },
];

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  let body = [];
  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();

      let status = 404;

      const response = {
        success: false,
        data: null,
        error: null,
      };

      if (method === 'GET' && url === '/todos') {
        status = 200;
        response.success = true;
        response.data = todos;
      } else if (method === 'POST' && url === '/todos') {
        const { id, text } = JSON.parse(body);
        if (!id || !text) {
          status = 400;
          response.error = 'Please provide id and text!';
        } else {
          todos.push({ id, text });
          status = 201;
          response.success = true;
          response.data = todos;
        }
      }

      res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js',
      });

      res.end(JSON.stringify(response));
    });
});

const PORT = 3001;

server.listen(PORT, async () => console.log(`App starts on port ${PORT}!`));
