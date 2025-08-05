//200 ok server code
//500 server fault
//400 client request fault
//404 wrong address
//403 othentication part is wrong

import User from "../models/user.js";

export function getUsers(req, res) {
  User.find().then((userlist) => {
    [
      res.json({
        List: userlist,
      }),
    ];
  });
}

export function createUsers(req, res) {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.json({
        message: "user created",
      });
    })
    .catch(() => {
      res.json({
        message: "user not created",
      });
    });
}

export function deleteUsers(req, res) {
  User.deleteOne({ name: req.body.name }).then(() => {
    res.json({
      message: " user deleted successfully",
    });
  }).catch(()=>{
    res.json({
      message : "user not deleted"
    })
  })
}
