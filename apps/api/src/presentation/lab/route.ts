import { Router } from "express";
import { LabController } from "./lab.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { DependencyContainer } from "../../infrastructure/DependencyContainer.js";

export class LabRoutes {
    static getRoutes(): Router {
        const routes = Router();
        const container = DependencyContainer.getInstance();
        
        const labController = new LabController(
            container.labGroupService,
            container.labReservationService
        );
        const authMiddleware = new AuthMiddleware();

        // Lab groups
        routes.post("/groups", authMiddleware.authenticate, authMiddleware.authorize("secretary"), labController.createLabGroup);
        routes.get("/groups/course/:courseId", authMiddleware.authenticate, labController.getLabGroupsByCourse);
        routes.get("/groups/my-groups", authMiddleware.authenticate, authMiddleware.authorize("professor"), labController.getProfessorLabGroups);
        
        // Lab reservations
        routes.post("/reservations", authMiddleware.authenticate, authMiddleware.authorize("professor"), labController.createReservation);
        routes.get("/reservations/my-reservations", authMiddleware.authenticate, authMiddleware.authorize("professor"), labController.getProfessorReservations);
        routes.get("/reservations", authMiddleware.authenticate, authMiddleware.authorize("admin", "secretary"), labController.getAllReservations);
        routes.put("/reservations/:reservationId/approve", authMiddleware.authenticate, authMiddleware.authorize("secretary"), labController.approveReservation);
        routes.put("/reservations/:reservationId/reject", authMiddleware.authenticate, authMiddleware.authorize("secretary"), labController.rejectReservation);
        routes.put("/reservations/:reservationId/cancel", authMiddleware.authenticate, authMiddleware.authorize("professor"), labController.cancelReservation);

        return routes;
    }
}