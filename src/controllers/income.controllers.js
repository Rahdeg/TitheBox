const { Income } = require("../models/income.model");
const User = require("../models/user.model").User;
const AsyncManager = require("../utils/asyncManager");
const LibraryError = require("../utils/libraryError");


exports.addIncome =AsyncManager( async function (req, res,next) {
    const data = req.body;
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: `No user with id ${req.params.id}` });
      }
      data.user_id = user.id;
      const income = await Income.create(data);
    return res.status(201).json(income);
      
    } catch (error) {
      return next(new LibraryError(error.message, 500));
    }
  }
) 

exports.getIncomes = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ msg: `User with ${req.params.id} not found` });
    }
    data = await Income.find({ user_id: req.params.id });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: error });
  }
};

exports.getIncome = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ msg: `User with ${req.params.id} not found` });
    }
    const data = await Income.findById(req.params.inc_id);
    if (!data) {
      return res.status(404).json({ msg: "Not Found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    if (error.name == "CastError") {
      return res.status(400).json(error.message);
    }
    return res.status(500).json(error);
  }
};

exports.updateIncome = async function (req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ msg: `User with ${req.params.id} not found` });
  }
  const update = req.body;
  Income.findByIdAndUpdate(
    req.params.inc_id,
    update,
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        return res
          .status(200)
          .json({ msg: "Income updated successfully", data: data });
      }
    }
  );
};

exports.delete_income = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    const income = await Income.findByIdAndDelete(req.params.inc_id);
    // if(!user){
    //     return res.status(404).json({msg:`No user with id ${req.params.id}`})
    // }
    if (!income) {
      return res
        .status(404)
        .json({ msg: `No income with id ${req.params.id}` });
    } else {
      return res
        .status(200)
        .json({ msg: "Income Deleted Successfully", data: null });
    }
  } catch (error) {
    console.log(error);
  }
};
