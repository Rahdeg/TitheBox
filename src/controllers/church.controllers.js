const User = require("../models/user.model").User;
const { Church } = require("../models/church.model");
const { SubAccount } = require("../models/subAccount.model");
const { createSubAccount } = require("../utils/functions");

exports.addChurch = async function (req, res) {
  const data = req.body;
  const subacct_exists = await SubAccount.findOne({
    accountNumber: data.accountNumber,
  });
  const user = await User.findById(req.params.id);
  const details = {
    address: data.address,
    name: data.name,
    serviceDays: data.serviceDays,
  };
  if (!user) {
    return res.status(404).json({ msg: `No user with id ${req.params.id}` });
  }
  if (!subacct_exists) {
    console.log("here")
    const subAccountData = await createSubAccount(data, user);
    if (subAccountData) {
      const bankname = subAccountData.bank_name;
      details.user_id = user.id;
      const account = {
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankCode: data.bank.code,
        subAccountId: subAccountData.subaccount_id,
        bankName: bankname,
      };
      const subacct = new SubAccount(account);
      details.subAccountIds = subacct.id;
      const church = new Church(details);
      subacct.save();
      church.save();
      return res.status(201).json(church);
    }
  } else if (subacct_exists) {
    const details = {
      address: data.address,
      name: data.name,
      serviceDays: data.serviceDays,
      subAccountIds: subacct_exists.id,
    };
    details.user_id = user.id;
    const account = {
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      bankCode: data.bankCode,
      subAccountId: subacct_exists.id,
      bankName: subacct_exists.bankName,
    };
    console.log("here 3")
    const church = new Church(details);
    church.save();
    return res.status(201).json(church);
  }
};

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
