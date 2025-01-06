import express from "express";
import {
  createLandlord,
  updateLandlord,
  deleteLandlord,
  showLandlord,
  showLandlords,
} from "../../controllers/users/landlord";

const LandlordRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Landlords
 *     description: Operaciones relacionadas con los arrendadores
 */

/**
 * @swagger
 * /api/landlord:
 *   get:
 *     tags:
 *       - Landlords
 *     summary: Obtener todos los arrendadores
 *     responses:
 *       '200':
 *         description: Lista de arrendadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Landlord'
 *       '404':
 *         description: No se encontraron arrendadores
 */
LandlordRouter.get("/", showLandlords);

/**
 * @swagger
 * /api/landlord/{id}:
 *   get:
 *     tags:
 *       - Landlords
 *     summary: Obtener un arrendador por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del arrendador
 *     responses:
 *       '200':
 *         description: Arrendador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 *       '404':
 *         description: No se encontró el arrendador
 */
LandlordRouter.get("/:id", showLandlord);

/**
 * @swagger
 * /api/landlord:
 *   post:
 *     tags:
 *       - Landlords
 *     summary: Crear un nuevo arrendador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordInput'
 *     responses:
 *       '201':
 *         description: Arrendador creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 */
LandlordRouter.post("/", createLandlord);

/**
 * @swagger
 * /api/landlord/{id}:
 *   patch:
 *     tags:
 *       - Landlords
 *     summary: Actualizar un arrendador por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del arrendador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandlordInput'
 *     responses:
 *       '200':
 *         description: Arrendador actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Landlord'
 *       '404':
 *         description: No se encontró el arrendador
 */
LandlordRouter.patch("/:id", updateLandlord);

/**
 * @swagger
 * /api/landlord/{id}:
 *   delete:
 *     tags:
 *       - Landlords
 *     summary: Eliminar un arrendador por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del arrendador
 *     responses:
 *       '200':
 *         description: Arrendador eliminado exitosamente
 *       '404':
 *         description: No se encontró el arrendador
 */
LandlordRouter.delete("/:id", deleteLandlord);

export default LandlordRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Landlord:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Número de cédula del arrendador
 *         authID:
 *           type: string
 *           description: ID de autenticación único
 *         firstName:
 *           type: string
 *           description: Nombre del arrendador
 *         lastName:
 *           type: string
 *           description: Apellido del arrendador
 *         gender:
 *           type: string
 *           description: Género del arrendador
 *           enum:
 *             - Masculino
 *             - Femenino
 *         phone:
 *           type: string
 *           description: Número de teléfono del arrendador
 *         email:
 *           type: string
 *           description: Correo electrónico del arrendador
 *         avatar:
 *           type: string
 *           description: URL del avatar del arrendador
 *         avgRating:
 *           type: number
 *           description: Calificación promedio del arrendador
 *           minimum: 0
 *           maximum: 10
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     LandlordInput:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Número de cédula del arrendador
 *         authID:
 *           type: string
 *           description: ID de autenticación único
 *         firstName:
 *           type: string
 *           description: Nombre del arrendador
 *         lastName:
 *           type: string
 *           description: Apellido del arrendador
 *         gender:
 *           type: string
 *           description: Género del arrendador
 *           enum:
 *             - Masculino
 *             - Femenino
 *         phone:
 *           type: string
 *           description: Número de teléfono del arrendador
 *         email:
 *           type: string
 *           description: Correo electrónico del arrendador
*/