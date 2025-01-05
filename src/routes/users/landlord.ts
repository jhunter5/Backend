import express from "express";
import { createLandlord, deleteLandlord, showLandlord, showLandlords, updateLandlord } from "../../controllers/users/landlord";

const LandlordRouter = express.Router();
LandlordRouter.post("/", createLandlord);
LandlordRouter.get("/", showLandlords);
LandlordRouter.patch("/:id", updateLandlord);
LandlordRouter.delete("/:id", deleteLandlord);
LandlordRouter.get("/:id", showLandlord);
/**
 * @swagger
 * /api/landlord:
 *   get:
 *     tags:
 *       - Landlords
 *     summary: Obtener todos los landlords
 *     responses:
 *       '200':
 *         description: Lista de landlords
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Landlord'
 *       '404':
 *         description: No se encontraron landlords
 *   post:
 *     tags:
 *       - Landlords
 *     summary: Crear un nuevo landlord
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordInput'
 *     responses:
 *       '201':
 *         description: Landlord creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 *       '409':
 *         description: ID ya registrado
 */

/**
 * @swagger
 * /api/landlord/{id}:
 *   get:
 *     tags:
 *       - Landlords
 *     summary: Obtener un landlord por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Landlord encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 *       '404':
 *         description: Landlord no encontrado
 *   patch:
 *     tags:
 *       - Landlords
 *     summary: Actualizar un landlord por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordInput'
 *     responses:
 *       '200':
 *         description: Landlord actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 *       '404':
 *         description: Landlord no encontrado
 *   delete:
 *     tags:
 *       - Landlords
 *     summary: Eliminar un landlord por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Landlord eliminado exitosamente
 *       '404':
 *         description: Landlord no encontrado
 */
export default LandlordRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Landlord:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         numberOfProperties:
 *           type: integer
 *         avgRating:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LandlordInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         numberOfProperties:
 *           type: integer
 *         avgRating:
 *           type: number
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - phone
 *         - email
 */