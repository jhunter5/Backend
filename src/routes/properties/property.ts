import express from "express";
import {
  createProperty,
  deleteProperty,
  showProperty,
  showProperties,
  showPropertiesByUser,
  updateProperty,
} from "../../controllers/properties/property";

const PropertyRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Properties
 *     description: Operaciones relacionadas con propiedades
 */

/**
 * @swagger
 * /api/property:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Obtener todas las propiedades
 *     responses:
 *       '200':
 *         description: Lista de propiedades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       '404':
 *         description: No se encontraron propiedades
 *   post:
 *     tags:
 *       - Properties
 *     summary: Crear una nueva propiedad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       '201':
 *         description: Propiedad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 */
PropertyRouter.post("/", createProperty);
PropertyRouter.get("/", showProperties);

/**
 * @swagger
 * /api/property/user/{userId}:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Obtener todas las propiedades de un usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de propiedades del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyWithMedia'
 *       '404':
 *         description: No se encontraron propiedades para el usuario
 */
PropertyRouter.get("/user/:userId", showPropertiesByUser);

/**
 * @swagger
 * /api/property/{id}:
 *   get:
 *     tags:
 *       - Properties
 *     summary: Obtener una propiedad por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Propiedad encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyWithMediaAndContract'
 *       '404':
 *         description: Propiedad no encontrada
 *   patch:
 *     tags:
 *       - Properties
 *     summary: Actualizar una propiedad por su ID
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
 *             $ref: '#/components/schemas/PropertyInput'
 *     responses:
 *       '200':
 *         description: Propiedad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *   delete:
 *     tags:
 *       - Properties
 *     summary: Eliminar una propiedad por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Propiedad eliminada exitosamente
 *       '404':
 *         description: Propiedad no encontrada
 */
PropertyRouter.patch("/:id", updateProperty);
PropertyRouter.delete("/:id", deleteProperty);
PropertyRouter.get("/:id", showProperty);

export default PropertyRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         type:
 *           type: string
 *         rooms:
 *           type: integer
 *         parking:
 *           type: integer
 *         squareMeters:
 *           type: number
 *         tier:
 *           type: integer
 *         bathrooms:
 *           type: integer
 *         age:
 *           type: integer
 *         floors:
 *           type: integer
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PropertyWithMedia:
 *       allOf:
 *         - $ref: '#/components/schemas/Property'
 *         - type: object
 *           properties:
 *             media:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   mediaType:
 *                     type: string
 *                   mediaUrl:
 *                     type: string
 *                   description:
 *                     type: string
 *                   uploadDate:
 *                     type: string
 *                     format: date-time
 *     PropertyWithMediaAndContract:
 *       allOf:
 *         - $ref: '#/components/schemas/PropertyWithMedia'
 *         - type: object
 *           properties:
 *             contract:
 *               type: object
 *               properties:
 *                 tenant:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 monthlyRent:
 *                   type: number
 *                 status:
 *                   type: string
 *       
*/