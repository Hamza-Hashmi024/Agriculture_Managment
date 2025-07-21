const path = require("path");
const fs = require("fs");

const saveFile = (file, folder = "uploads") => {
  const uploadPath = path.join(__dirname, `../public/${folder}`);
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

  const filename = Date.now() + "_" + file.name;
  const filePath = path.join(uploadPath, filename);
  file.mv(filePath);
  return `/public/${folder}/${filename}`;
};

module.exports = {
  saveFile,
};
