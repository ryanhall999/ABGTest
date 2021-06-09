const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const morgan = require("morgan");

app.use(express.json());

morgan(":method :url :status :res[content-length] - :response-time ms");

app.use("/dist", express.static("dist"));
app.use("/css", express.static("css"));

app.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/product_list", (req, res, next) => {
	db.readProductList()
		.then((list) => res.send(list))
		.catch(next);
});

app.post("/api/indvProduct", (req, res, next) => {
	db.getIndvProd(req.body.value)
		.then((list) => res.send(list))
		.catch(next);
});

const port = process.env.PORT || 3000;

db.sync()
	.then(() => {
		app.listen(port, () => {
			console.log(`listening on port ${port}...`);
		});
	})
	.catch((e) => {
		console.error(e);
	});
