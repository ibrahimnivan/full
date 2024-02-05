import { Router } from "express";
import authRouter from "./auth/router/auth.router";
import eventRouter from "./event/router/event.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/event", eventRouter);


export default apiRouter;
