import type { Request, Response } from "express";
import { UserService } from "../../application/services/UserService.js";
import { CreateUserDTO } from "../../application/dtos/CreateUserDTO.js";

export class ProfessorController {
    constructor(private readonly userService: UserService) {}

    createProfessor = async (req: Request, res: Response) => {
        const professorData = { ...req.body, role: "professor" };
        const [error, dto] = CreateUserDTO.create(professorData);
        
        if (error) {
            return res.status(422).json({ message: error });
        }

        this.userService.createUser(dto!)
            .then((data) => res.status(201).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ 
                    message: error.message || "Internal Server Error" 
                });
            });
    };

    getProfessors = async (req: Request, res: Response) => {
        this.userService.findAll()
            .then((data) => {
                const professors = data.filter(user => user.role === "professor");
                res.status(200).json(professors);
            })
            .catch(() => res.status(500).json({ message: "Error fetching professors" }));
    };

    getProfessor = async (req: Request, res: Response) => {
        const { id } = req.params;
        
        this.userService.findById(id!)  //===========================================================================================//
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ 
                    message: error.message || "Internal Server Error" 
                });
            });
    };
}