const fs = require("fs/promises");
const Jimp = require("jimp");
const path = require("path");
const { User } = require("../../models/user");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  const filename = `${_id}_${originalname}`;
  const resultUploud = path.join(avatarsDir, filename);
  await Jimp.read(tempUpload)
    .then((image) => image.resize(250, 250).quality(50).write(resultUploud))
    .catch((error) => next(error));

  await fs.unlink(tempUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = updateAvatar;
