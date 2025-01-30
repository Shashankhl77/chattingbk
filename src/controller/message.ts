import { Request, Response } from "express";
import request from "../models/request";
import { IUserDocument } from "../models/user";
import { Types } from "mongoose";
export async function sendRequest(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User id is required" });
      return;
    }
    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid userId format" });
      return;
    }

    const receiverId = new Types.ObjectId(userId);

    const requestdata = new request({
      sender: (req.user as IUserDocument)._id,
      receiver: receiverId,
      status: "REQUEST_SENT",
    });

    await requestdata.save();
    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send request", error });
  }
}

export async function acceptRequest(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("sxdfcgvbhjnkm");
    const { requestId, status } = req.body;
    console.log(req.body);
    if (!requestId) {
      res.status(400).json({ message: "requestId id is required" });
      return;
    }
    if (!Types.ObjectId.isValid(requestId)) {
      res.status(400).json({ message: "Invalid requestId format" });
      return;
    }
    const receiverId = new Types.ObjectId(requestId); // Cast to ObjectId
    console.log("--------------------------", receiverId);

    const updatedRequest = await request.findOneAndUpdate(
      { _id: receiverId },
      {
        status: status,
      }
    );
    console.log("--------------------------", updatedRequest);
    if (!updatedRequest) {
      res.status(404).json({ message: "Request not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Request updated successfully", updatedRequest });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send request", error });
  }
}
export async function contacts(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.body;

    const user = new Types.ObjectId(userId);
    const status = await request.findOne({ sender: user });

    if (!status) {
      res.status(400).json({ message: "User id not found" });
      return;
    }
    const data = await request.aggregate([
      {
        $match: {
          sender: user,
          status: "ACCEPTED",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiverDetails",
        },
      },
      {
        $unwind: "$receiverDetails",
      },
    ]);
    res.json({
      status: 200,
      message: "Request updated successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send request", error });
  }
}
