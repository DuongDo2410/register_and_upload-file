const http = require("http");
const fs = require("fs");
const qs = require("qs");
const path = require("path");
const formidable = require("formidable");
const port = 8080;
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    fs.readFile("./view/index.html", (err, data) => {
      res.writeHead(200, { "content-type": "text/html" });
      if (err) {
        console.log(err);
      }
      res.write(data);
      res.end();
    });
  } else {
    const form = new formidable.IncomingForm();
    form.uploadDir = "uploads/";
    form.parse(req, (err, fields, files) => {
      let { name, email, password, avatar } = fields;
      if (err) {
        // Kiểm tra nếu có lỗi
        console.error(err.message);
        return res.end(err.message);
      }
      // Lấy ra đường dẫn tạm của tệp tin trên server
      let tmpPath = files.avatar.filepath;
      // console.log(oldPath);
      let newPath = form.uploadDir + files.avatar.originalFilename;

      avatar = newPath;
      // Đổi tên của file tạm thành tên mới và lưu lại
      fs.rename(tmpPath, newPath, (err) => {
        if (err) throw err;
        let fileType = files.avatar.mimetype;
        let mimeTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (mimeTypes.indexOf(fileType) === -1) {
          res.writeHead(200, { "Content-Type": "text/html" });
          return res.end(
            "The file is not in the correct format: png, jpeg, jpg"
          );
        }
      });
      fs.readFile("./view/show.html", "utf8", (err, data) => {
        if (err) {
          console.log(err);
        }
        res.writeHead(200, { "content-type": "text/html" });
        data = data.replace("{name}", name);
        data = data.replace("{img}", avatar);
        data = data.replace("{password}", password);
        data = data.replace("{email}", email);
        res.write(data);
        res.end();
      });
    });
  }
});

server.listen(port, () => {
  console.log("Server running http://localhost:8080/");
});
