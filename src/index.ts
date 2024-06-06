import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

dotenv.config();

const app = express();

app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_DOMAIN,
}));

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    token: req.headers.authorization || '',
  }),
});

await server.start();
server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
