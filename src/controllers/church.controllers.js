const User = require("../models/user.model").User;
const { Church } = require("../models/church.model");
const AsyncManager = require("../utils/asyncManager");
const LibraryError = require("../utils/libraryError");


exports.addChurch = AsyncManager(async function (req, res,next) {
    try {
    const data = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: `No user with id ${req.params.id}` });
    }

    const details = {
      user_id:user.id,
      address: data.address,
      name: data.name,
      serviceDays: data.serviceDays,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      country:data.country,
      bank:{
        code:data.bank.code,
        name:data.bank.name
      }
    };

    const church = await Church.create(details);
    return res.status(201).json(church);
    
    } catch (error) {
      
      // return res.status(500).json({message:"an error occurred"})
      return next(new LibraryError(error.message, 404));
    }
  
  }
);

exports.getChurches = async function (req, res) {
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ msg: `User with id ${req.params.id} not found` });
    }
    const churches = await Church.find({ user_id: req.params.id });
    return res.status(200).json(churches);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "An Error Occured" });
  }
};

exports.getChurch = async function (req, res) {
  try {
    const church = await Church.findById(req.params.church_id);
    if(!church){
      return res.status(404).json({ msg: `Church with id ${req.params.church_id} not found` })
    }
    return res.status(200).json(church);
  } catch (error) {
    res.status(500).json({ msg: "An Error Occured" });
  }
};

exports.updateChurch = async function (req, res) {
  const data = req.body;

  Church.findByIdAndUpdate(
    req.params.inc_id,
    data,
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        return res
          .status(200)
          .json({ msg: "Church updated successfully", data: data });
      }
    }
  );
};

exports.deleteChurch = async function (req, res) {
  try {
    Church.findByIdAndDelete(req.params.church_id, (err, church) => {
      if (err) {
        return res
          .status(404)
          .json({ msg: `Church with id ${req.params.church_id} not found` });
      }
      if (church) {
        return res
          .status(200)
          .json({ message: "Church deleted successfully", data: null });
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: "An Error Occured" });
  }
};

exports.getChurchAccounts = async function (req, res) {
  try {
    const church = await Church.findById(req.params.church_id).populate(
      "subAccountIds"
    );
    if (!church) {
      return res
        .status(404)
        .json({ msg: `Church with id ${req.params.church_id} not found` });
    } else {
      const accounts = church.subAccountIds;
      return res.status(200).json(accounts);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An Error Occured" });
  }
};

exports.getChurchAccount = async function (req, res) {
  try {
    const account = await SubAccount.findById(req.params.acc_id);
    if (!account) {
      return res
        .status(404)
        .json({ msg: `Account with id ${req.params.acc_id} not found` });
    } else {
      return res.status(200).json(account);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An Error Occured" });
  }
};
