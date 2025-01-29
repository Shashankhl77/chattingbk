import express from "express";
import * as auth from "../controller/auth";

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: signUp
 *     security:
 *       - adminBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include in the response (projection)
 *           examples:
 *             example:
 *               summary: Projection Example
 *               value:
 *                 username: Shashank
 *                 password: "Admin@123"
 *     responses:
 *       200:
 *         description: Signup successfully
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
 *                        username:
 *                          type: string
 *                          example: Shashank
 *                        accesstoken:
 *                          type: string
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *                        refreshtoken:
 *                          type: string
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *             examples:
 *               Success:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "successfully."
 *                   data:
 *                      username: Shashank
 *                      accesstoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *                      refreshtoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *                   toastMessage: Fetched successful
 */

router.post("/signup", auth.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: login
 *     security:
 *       - adminBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include in the response (projection)
 *           examples:
 *             example:
 *               summary: Projection Example
 *               value:
 *                 username: Shashank
 *                 password: "Admin@123"
 *     responses:
 *       200:
 *         description: Signup successfully
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
 *                        username:
 *                          type: string
 *                          example: Shashank
 *                        accesstoken:
 *                          type: string
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *                        refreshtoken:
 *                          type: string
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *             examples:
 *               Success:
 *                 summary: Successful response
 *                 value:
 *                      username: Shashank
 *                      accesstoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *                      refreshtoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 */

router.post("/login", auth.login);

/**
 * @swagger
 * /auth/accesstoken:
 *   post:
 *     summary: Generated new access token
 *     security:
 *       - adminBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include in the response (projection)
 *           examples:
 *             example:
 *               summary: Projection Example
 *               value:
 *                 refreshtoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *     responses:
 *       200:
 *         description: Generated new access token
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
 *                        refreshtoken:
 *                          type: string
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *             examples:
 *               Success:
 *                 summary: Successful response
 *                 value:
 *                      refreshtoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 */
router.post("/accesstoken", auth.refresh);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: logout
 *     security:
 *       - adminBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include in the response (projection)
 *           examples:
 *             example:
 *               summary: Projection Example
 *               value:
 *                 refreshtoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
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
 *                        refreshtoken:
 *                          type: string
 *                          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNmY4ZDU2MzFmMz
 *             examples:
 *               Success:
 *                 summary: Successful response
 *                 value:
 *                      message: "Logout successful"
 */
router.post("/logout", auth.logout);

export default router;
