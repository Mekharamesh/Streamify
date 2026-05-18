import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";


// ✅ RECOMMENDED USERS
export async function getRecommendedUser(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUser = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true }
            ]
        });

        res.status(200).json(recommendedUser);

    } catch (error) {
        console.log("Error in getRecommended controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// ✅ GET FRIENDS
export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user._id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);

    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}


// ✅ SEND FRIEND REQUEST
export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: recipientId } = req.params;

        if (myId.toString() === recipientId) {
            return res.status(400).json({
                message: "You can't send friend request to yourself"
            });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        if (recipient.friends.includes(myId)) {
            return res.status(400).json({
                message: "You are already friends with this user"
            });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "A friend request already exists between you and this user"
            });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);

    } catch (error) {
        console.log("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// ✅ ACCEPT REQUEST
export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept this request"
            });
        }

        if (friendRequest.status === "accepted") {
            return res.status(400).json({
                message: "Friend request already accepted"
            });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({
            success: true,
            message: "Friend request accepted"
        });

    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// ✅ GET FRIEND REQUESTS (INCOMING + ACCEPTED)
export async function getFriendsRequest(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    const outgoingReqs = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json({
      incomingReqs,
      acceptedReqs,
      outgoingReqs,
    });

  } catch (error) {
    console.log("Error in getFriendsRequest:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// ✅ OUTGOING REQUESTS
export async function getOutgoingFriendReq(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending",
        }).populate(
            "recipient",
            "fullName profilePic nativeLanguage learningLanguage"
        );

        res.status(200).json(outgoingRequests);

    } catch (error) {
        console.log("Error in getOutgoingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

