var express = require("express");
var router = express.Router();
let roleModel = require("../schemas/Role");
let { CreateErrorRes, CreateSuccessRes } = require("../utils/responseHandler");

router.get("/", async function (req, res, next) {
  let role = await roleModel.find({
    isDeleted: false,
  });
  CreateSuccessRes(res, role, 200);
});
router.get("/:id", async function (req, res, next) {
  try {
    let role = await roleModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    CreateSuccessRes(res, role, 200);
  } catch (error) {
    next(error);
  }
});
router.post("/", async function (req, res, next) {
  try {
    let body = req.body;
    let newrole = new roleModel({
      name: body.name,
      description: body.description,
    });
    await newrole.save();
    CreateSuccessRes(res, newrole, 200);
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
    if (body.description) {
      updatedInfo.description = body.description;
    }
    let updaterole = await roleModel.findByIdAndUpdate(id, updatedInfo, {
      new: true,
    });
    CreateSuccessRes(res, updaterole, 200);
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", async function (req, res, next) {
  let id = req.params.id;
  try {
    let updaterole = await roleModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      { new: true }
    );
    CreateSuccessRes(res, updaterole, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
