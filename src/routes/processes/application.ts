import express from "express";
import {
  createApplication,
  deleteApplication,
  showApplication,
  showApplications,
  updateApplication,
} from "../../controllers/processes/application";

const ApplicationRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Applications
 *     description: Operaciones relacionadas con aplicaciones
 */

/**
 * @swagger
 * /api/application:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Obtener todas las aplicaciones
 *     responses:
 *       '200':
 *         description: Lista de aplicaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       '404':
 *         description: No se encontraron aplicaciones
 *   post:
 *     tags:
 *       - Applications
 *     summary: Crear una nueva aplicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       '201':
 *         description: Aplicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 */
ApplicationRouter.post("/", createApplication);
ApplicationRouter.get("/", showApplications);

/**
 * @swagger
 * /api/application/{id}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Obtener una aplicación por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Aplicación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       '404':
 *         description: Aplicación no encontrada
 *   patch:
 *     tags:
 *       - Applications
 *     summary: Actualizar una aplicación por su ID
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
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       '200':
 *         description: Aplicación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *   delete:
 *     tags:
 *       - Applications
 *     summary: Eliminar una aplicación por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Aplicación eliminada exitosamente
 *       '404':
 *         description: Aplicación no encontrada
 */
ApplicationRouter.patch("/:id", updateApplication);
ApplicationRouter.delete("/:id", deleteApplication);
ApplicationRouter.get("/:id", showApplication);

export default ApplicationRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         applicationDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: integer
 *         score:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ApplicationInput:
 *       type: object
 *       properties:
 *         applicationDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: integer
 *         score:
 *           type: number
 *       required:
 *         - applicationDate
 *         - status
*/