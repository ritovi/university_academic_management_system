import type { Request, Response } from "express";
import { UserService } from "../../application/services/UserService.js";
import { CreateUserDTO } from "../../application/dtos/CreateUserDTO.js";

export class StudentController {
    constructor(private readonly userService: UserService) {}

    createStudent = async (req: Request, res: Response) => {
        const studentData = { ...req.body, role: "student" };
        const [error, dto] = CreateUserDTO.create(studentData);
        
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

    getStudents = async (req: Request, res: Response) => {
        this.userService.findAll()
            .then((data) => {
                const students = data.filter(user => user.role === "student");
                res.status(200).json(students);
            })
            .catch(() => res.status(500).json({ message: "Error fetching students" }));
    };

    getStudent = async (req: Request, res: Response) => {
        const { id } = req.params;
        
        this.userService.findById(id!)  ///===================================================================!!!
            .then((data) => res.status(200).json(data))
            .catch((error: any) => {
                const statusCode = error.statusCode || 500;
                res.status(statusCode).json({ 
                    message: error.message || "Internal Server Error" 
                });
            });
    };
}