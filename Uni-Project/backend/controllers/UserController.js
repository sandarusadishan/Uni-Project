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
  User.deleteOne({ gmail: req.body.gmail }).then(() => {
    res.json({
      message: " user deleted successfully",
    });
  }).catch(()=>{
    res.json({
      message : "user not deleted"
    })
  })
}
