const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const Poem = require("../models/poem");

function createFile(fileName, name, poem, poet, lan) {
  let fontPath;
  let filePath = path.dirname(__dirname);
  if (lan == "Gujarati") {
    fontPath = filePath + "/fonts/shruti.ttf";
  } else if (lan == "Hindi") {
    fontPath = filePath + "/fonts/ChanakyaRegular.ttf";
  } else if (lan == "English") {
    fontPath = filePath + "/fonts/arial.ttf";
  } else {
    fontPath = filePath + "/fonts/arial.ttf";
  }
  let pdfDoc = new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream(filePath + "/pdfs/" + fileName));
  pdfDoc.font(fontPath).fontSize(25).text(name, { align: "center" });
  pdfDoc.font(fontPath).fontSize(18).text(poem);
  pdfDoc
    .font(fontPath)
    .fontSize(18)
    .text("------" + poet);
  pdfDoc.end();
}

exports.createPoem = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  let fileName = req.body.name + "-" + Date.now() + ".pdf";
  createFile(
    fileName,
    req.body.name,
    req.body.poem,
    req.body.creater,
    req.body.language
  );
  const poemData = new Poem({
    name: req.body.name,
    poem: req.body.poem,
    creater: req.body.creater,
    language: req.body.language,
    type: req.body.type,
    uploaded_by: req.userDataA.userId,
    pdf: url + "/pdfs/" + fileName,
    created_at: Date.now(),
  });
  poemData
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Poem Created Successfully!",
        poemId: result._id,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
exports.updatePoem = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  let fileName = req.body.name + "-" + Date.now() + ".pdf";
  createFile(
    fileName,
    req.body.name,
    req.body.poem,
    req.body.creater,
    req.body.language
  );
  Poem.updateOne(
    { _id: req.params.id, uploaded_by: req.userDataA.userId },
    {
      name: req.body.name,
      poem: req.body.poem,
      type: req.body.type,
      language: req.body.language,
      pdf: url + "/pdfs/" + fileName,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Poem updated Successfully!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't update Poem!!!",
      });
    });
};

exports.deletePoem = (req, res, next) => {
  Poem.deleteOne({
    _id: req.params.id,
    uploaded_by: req.userDataA.userId,
  })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Poem deleted Succcessfully!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't delete Poem!!!",
      });
    });
};

exports.getPoem = (req, res, next) => {
  Poem.findById(req.params.id)
    .then((poem) => {
      res.status(200).json({
        message: "Poem fetched Successfully!",
        poem: poem,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Poem!!!",
      });
    });
};

exports.getPoems = (req, res, next) => {
  Poem.find()
    .then((poems) => {
      res.status(200).json({
        message: "Poems fetched Successfully!",
        poems: poems,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't fetch Poems!!!",
      });
    });
};

exports.getPoemPP = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const poemQuery = Poem.find();
  let fetchedPoems;
  if (pageSize && currentPage) {
    poemQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  poemQuery
    .then((poems) => {
      fetchedPoems = poems;
      return Poem.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Poems fetched Successfully!",
        poems: fetchedPoems,
        maxPoems: count,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't fetch Poems!!!",
      });
    });
};
exports.getPoemOU = (req, res, next) => {
  Poem.find({
    uploaded_by: req.userDataA.userId,
  })
    .then((poems) => {
      res.status(200).json({
        message: "Poems fetched Successfully!",
        poems: poems,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't fetch Poems!!!",
      });
    });
};
