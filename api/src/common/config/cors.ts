import cors from 'cors';

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8000'], // Replace with the origin of your frontend application
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

export default cors(corsOptions);
