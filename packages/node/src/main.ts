import * as express from "express";
import { v2 as webdav } from "webdav-server";
import { router as visitorRouter } from "./api/visitor";

const app = express();
app.use(express.raw());
app.use(express.json());

const server = new webdav.WebDAVServer();

app.use("/visitor", visitorRouter);

// https://github.com/OpenMarshal/npm-WebDAV-Server/issues/23
// app.all("/folder/*", (req, res) => {
//   // req.path = req.path.substring("/folder".length);
//   server.executeRequest(req, res, "/tmp/test");
// });
app.use(webdav.extensions.express("/tmp/test", server));

app.listen(3010);
