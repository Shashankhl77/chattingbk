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

/**
 * @swagger
 * /request/contact:
 *   post:
 *     summary: contact
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
 *             example2:
 *               summary: contact example
 *               value:
 *                 userId: 6799bca1c6bca980d6845f21
 *     responses:
 *       200:
 *         description: contact
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
 *                    message: successfully
 *                    data:
 *                    - _id: 679a0afa2dedc811b12f60e0
 *                      sender: 6799bca1c6bca980d6845f21
 *                      receiver: 679888cd98fcdeb452f7720e
 *                      status: ACCEPTED
 *                      isDeleted: false
 *                      createdAt: '2025-01-29T11:03:22.058Z'
 *                      updatedAt: '2025-01-29T12:19:31.037Z'
 *                      senderDetails:
 *                      - _id: 6799bca1c6bca980d6845f21
 *                        username: Shashank
 *                        password: "$2a$10$WcOVB4OZT6yX82FbzyAxA.g3AztWR7RYHUczQFmwbKmXfYz.bz5yy"
 *                        isDeleted: false
 *                        createdAt: '2025-01-29T05:29:05.779Z'
 *                        updatedAt: '2025-01-29T05:29:05.779Z'
 *                      receiverDetails:
 *                        _id: 679888cd98fcdeb452f7720e
 *                        username: testuser
 *                        password: "$2a$10$YWUVz9a.Wjsab2G3XzkzH.CHF/aI/YeVJ/dyw1ofoF9gfc8gu0kT6"
 *                        isDeleted: false
 *                        createdAt: '2025-01-28T07:35:41.408Z'
 *                        updatedAt: '2025-01-28T07:35:41.408Z'
 *
 */

router.post(
  "/contact",
  passport.authenticate("bearer", { session: false }),
  request.contacts
);
export default router;
