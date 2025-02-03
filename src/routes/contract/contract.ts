import express from "express";
import {
  getContractById,
  getContractsByProperty,
  getContractsByPropertyAndUser,
  updateContract,
  deleteContract,
  createContract,
  getContractsByTenant,
  getActiveContractsByTenant,
} from "../../controllers/contract/contract";

const ContractRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Contracts
 *     description: Operaciones relacionadas con contratos
 */

/**
 * @swagger
 * /api/contracts/{id}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener un contrato por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Contrato encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 *       '404':
 *         description: Contrato no encontrado
 */
ContractRouter.get("/:id", getContractById);
ContractRouter.post("/", createContract);
/**
 * @swagger
 * /api/contracts/user/{userId}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener contratos por usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de contratos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contract'
 *       '404':
 *         description: No se encontraron contratos para el usuario
 */
ContractRouter.get("/tenant/:id", getContractsByTenant);
ContractRouter.get("/tenant/active/:id", getActiveContractsByTenant);
/**
 * @swagger
 * /api/contracts/property/{propertyId}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener contratos por propiedad
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de contratos de la propiedad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contract'
 *       '404':
 *         description: No se encontraron contratos para la propiedad
 */
ContractRouter.get("/property/:propertyId", getContractsByProperty);

/**
 * @swagger
 * /api/contracts/property/{propertyId}/user/{tenantId}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Obtener contratos por propiedad y usuario
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de contratos para la propiedad y el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contract'
 *       '404':
 *         description: No se encontraron contratos para la combinación de propiedad y usuario
 */
ContractRouter.get(
  "/property/:propertyId/user/:tenantId",
  getContractsByPropertyAndUser
);

/**
 * @swagger
 * /api/contracts/{id}:
 *   put:
 *     tags:
 *       - Contracts
 *     summary: Actualizar un contrato por ID
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
 *             $ref: '#/components/schemas/ContractInput'
 *     responses:
 *       '200':
 *         description: Contrato actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 *       '404':
 *         description: Contrato no encontrado
 */
ContractRouter.put("/:id", updateContract);

/**
 * @swagger
 * /api/contracts/{id}:
 *   delete:
 *     tags:
 *       - Contracts
 *     summary: Eliminar un contrato por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Contrato eliminado exitosamente
 *       '404':
 *         description: Contrato no encontrado
 */
ContractRouter.delete("/:id", deleteContract);

export default ContractRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Contract:
 *       type: object
 *       properties:
 *         propertyId:
 *           type: string
 *           description: ID de la propiedad asociada
 *         tenant:
 *           type: string
 *           description: ID del inquilino asociado
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del contrato
 *         endDate:
 *           type: string
 *           format: date
 *           description: Fecha de finalización del contrato
 *         monthlyRent:
 *           type: number
 *           description: Monto mensual del contrato
 *         status:
 *           type: string
 *           description: Estado del contrato
 *         duration:
 *           type: number
 *           description: Duración del contrato en meses
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del contrato
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del contrato
 *     ContractInput:
 *       type: object
 *       properties:
 *         propertyId:
 *           type: string
 *         tenant:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         monthlyRent:
 *           type: number
 *         status:
 *           type: string
 *         duration:
 *           type: number
 *       required:
 *         - propertyId
 *         - tenant
 *         - startDate
 *         - endDate
 *         - monthlyRent
 *         - status
 *         - duration
 */
