var express = require("express");
var router = express.Router();
let userModel = require("../schemas/User");
let roleModel = require("../schemas/Role");
let { CreateErrorRes, CreateSuccessRes } = require("../utils/responseHandler");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    let { username, fullName, minLoginCount, maxLoginCount } = req.query;
    let filter = { isDeleted: false };
    if (username) filter.username = { $regex: username, $options: "i" };
    if (fullName) filter.fullName = { $regex: fullName, $options: "i" };
    if (minLoginCount) filter.loginCount = { $gte: parseInt(minLoginCount) };
    if (maxLoginCount)
      filter.loginCount = {
        ...filter.loginCount,
        $lte: parseInt(maxLoginCount),
      };
    let users = await userModel.find(filter).populate("role");
    CreateSuccessRes(res, users, 200);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let user = await userModel
      .findOne({
        _id: req.params.id,
        isDeleted: false,
      })
      .populate("role");
    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error);
  }
});
//check status
router.post("/check", async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userModel.findOne({
      email,
      username,
      isDeleted: false,
    });
    if (!user) {
      return CreateErrorRes(res, "User not found", 404);
    }
    user.status = true;
    await user.save();

    CreateSuccessRes(res, user, 200);
  } catch (error) {
    next(error);
  }
});
router.post("/", async function (req, res, next) {
  try {
    let body = req.body;
    let role = await roleModel.findOne({
      _id: body.role,
    });
    if (role) {
      let newuser = new userModel({
        username: body.username,
        password: body.password,
        email: body.email,
        fullName: body.fullName,
        avatarUrl: body.avatarUrl,
        status: body.status,
        role: body.role,
        loginCount: body.loginCount,
      });
      await newuser.save();
      const polulateUser = await userModel.populate(newuser, { path: "role" });
      CreateSuccessRes(res, polulateUser, 200);
    } else {
      throw new Error("role khong ton tai");
    }
  } catch (error) {
    next(error);
  }
});
router.put("/:id", async function (req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body;
    let updatedInfo = {};
    if (body.name) {
      updatedInfo.name = body.name;
    }
    if (body.password) {
      updatedInfo.password = body.password;
    }
    if (body.email) {
      updatedInfo.email = body.email;
    }
    if (body.role) {
      updatedInfo.role = body.role;
    }
    if (body.fullName) {
      updatedInfo.fullName = body.fullName;
    }
    if (body.avatarUrl) {
      updatedInfo.avatarUrl = body.avatarUrl;
    }
    if (body.status) {
      updatedInfo.status = body.status;
    }
    if (body.loginCount) {
      updatedInfo.loginCount = body.loginCount;
    }
    let updateUser = await userModel
      .findByIdAndUpdate(id, updatedInfo, { new: true })
      .populate("role");
    CreateSuccessRes(res, updateUser, 200);
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", async function (req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body;
    let updateUser = await userModel
      .findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        { new: true }
      )
      .populate("role");
    CreateSuccessRes(res, updateUser, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
