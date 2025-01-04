import express from "express";
import {
  createTenant,
  deleteTenant,
  showTenant,
  showTenants,
  updateTenant,
} from "../../controllers/users/tenant";

const TenantRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tenants
 *     description: Operaciones relacionadas con tenants
 */

/**
 * @swagger
 * /api/tenant:
 *   get:
 *     tags:
 *       - Tenants
 *     summary: Obtener todos los tenants
 *     responses:
 *       '200':
 *         description: Lista de tenants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tenant'
 *       '404':
 *         description: No se encontraron tenants
 *   post:
 *     tags:
 *       - Tenants
 *     summary: Crear un nuevo tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantInput'
 *     responses:
 *       '201':
 *         description: Tenant creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       '409':
 *         description: ID ya registrado
 */
TenantRouter.post("/", createTenant);
TenantRouter.get("/", showTenants);

/**
 * @swagger
 * /api/tenant/{id}:
 *   get:
 *     tags:
 *       - Tenants
 *     summary: Obtener un tenant por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tenant encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       '404':
 *         description: Tenant no encontrado
 *   patch:
 *     tags:
 *       - Tenants
 *     summary: Actualizar un tenant por su ID
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
 *             $ref: '#/components/schemas/TenantInput'
 *     responses:
 *       '200':
 *         description: Tenant actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       '404':
 *         description: Tenant no encontrado
 *   delete:
 *     tags:
 *       - Tenants
 *     summary: Eliminar un tenant por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tenant eliminado exitosamente
 *       '404':
 *         description: Tenant no encontrado
 */
TenantRouter.patch("/:id", updateTenant);
TenantRouter.delete("/:id", deleteTenant);
TenantRouter.get("/:id", showTenant);

export default TenantRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Tenant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idType:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: integer
 *         gender:
 *           type: string
 *         maritalStatus:
 *           type: string
 *         salary:
 *           type: number
 *         contractType:
 *           type: string
 *         industry:
 *           type: string
 *         avgRating:
 *           type: number
 *         previousContracts:
 *           type: integer
 *         avgContractDuration:
 *           type: integer
 *         rating:
 *           type: number
 *         tenure:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TenantInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idType:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: integer
 *         gender:
 *           type: string
 *         maritalStatus:
 *           type: string
 *         salary:
 *           type: number
 *         contractType:
 *           type: string
 *         industry:
 *           type: string
 *         avgRating:
 *           type: number
 *         previousContracts:
 *           type: integer
 *         avgContractDuration:
 *           type: integer
 *         rating:
 *           type: number
 *         tenure:
 *           type: integer
 *       required:
 *         - id
 *         - idType
 *         - firstName
 *         - lastName
 *         - phone
 *         - email
 *         - age
 *         - gender
 *         - maritalStatus
*/