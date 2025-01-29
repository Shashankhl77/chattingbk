import express from "express";
import * as request from "../controller/message";
import passport from "passport";
const router = express.Router();

/**
 * @swagger
 * /request:
 *   post:
 *     summary: request
 *     security:
 *       - adminBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: object
 *                 description: User unique Id
 *           examples:
 *             example:
 *               summary: request example
 *               value:
 *                 userId: 679888cd98fcdeb452f7720e
 *     responses:
 *       200:
 *         description: logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                        message:
 *                          type: string
 *                          example: Request sent successfully
 *             examples:
 *               Success:
 *                 summary: Successful response
 *                 value:
 *                      message: "request sent successfully"
 */
router.post(
  "/request",
  passport.authenticate("bearer", { session: false }),
  request.sendRequest
);
/**
 * @swagger
 * /request/respond:
 *   put:
 *     summary: respond
 *     security:
 *       - adminBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: object
 *                 description: User unique Id
 *           examples:
 *             example1:
 *               summary: request example
 *               value:
 *                 requestId: 679888cd98fcdeb452f7720e
 *                 status: ACCEPTED
 *             example2:
 *               summary: request example
 *               value:
 *                 requestId: 679888cd98fcdeb452f7720e
 *                 status: REJECTED
 *     responses:
 *       200:
 *         description: logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                        message:
 *                          type: string
 *                          example: Request sent successfully
 *             examples:
 *               Success:
 *                 summary: Successful response
 *                 value:
 *                      message: "request sent successfully"
 */
router.put(
  "/respond",
  passport.authenticate("bearer", { session: false }),
  request.acceptRequest
);
export default router;
