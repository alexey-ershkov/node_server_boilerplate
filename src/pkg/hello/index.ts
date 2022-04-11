import router from 'express';

const helloHandler = router();

helloHandler.get('/', (req, resp) => {
  resp.status(200);
  resp.send('Hello world');
});

export default helloHandler;
