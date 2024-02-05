import { Router } from "express";
import authenticationMiddleware from "../../common/middleware/authentication.middleware";
import { getEvents, getEventById, postEvent, getUser, getEventByOrganizer, transaction, eventReview, } from "../handler/event.handler";
import { uploader } from "../../common/middleware/uploader.middleware";
import authorizationOrganizerMiddleware from "../../common/middleware/authorizationOrganizer.middleware";
import authorizationCustomerMiddleware from "../../common/middleware/authorizationCustomer.middleware";

const eventRouter = Router()

eventRouter.post('/', authenticationMiddleware, authorizationOrganizerMiddleware, uploader("IMG", "/postedimage").single("file"), postEvent)
eventRouter.get('/', getEvents )
eventRouter.get('/user', authenticationMiddleware, getUser)
eventRouter.get('/organizer', authenticationMiddleware, getEventByOrganizer)
eventRouter.post('/review', eventReview)
eventRouter.post('/transaction', authenticationMiddleware, authorizationCustomerMiddleware, transaction)
// eventRouter.get('/total-transaction', authenticationMiddleware, totalTransactionOrganizer)
eventRouter.get('/:id',authenticationMiddleware, getEventById )

export default eventRouter
