const http = require("http");
const https = require("https");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const colors = require("./utils/colors");
const { configCheck, appConfig } = require("./config/appConfig");
const { mongoStart } = require("./config/mongoDBConf");
const certOptions = require("./config/certImport");
const AppError = require("./utils/appError");
const errorHandler = require("./middlewares/errorHandler");
const routeAPIsInit = require("./utils/routeInit");
const { verifySMTPConnection } = require("./utils/email");
const { dirConfig, dirCheck } = require("./config/dirConfig");

const app = express();

app.use(morgan("short"));

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// serve static files
if (process.env.NODE_ENV === "production") {
  // app.use(helmet()); // helmet sets headers for security
  // app.use(compression());
  app.enable("trust proxy");
  app.use(
    express.static(path.join(__dirname, "../../Front-end/dist"), {
      maxAge: "7d",
    })
  );
}

app.use("/static", express.static(path.join(appConfig.FILES_UPLOADS_DIR)));

// import API routes
routeAPIsInit(app);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on the server`, 404));
});

app.use(errorHandler);

const httpServer = http.Server(app);

const httpsServer = https.createServer(certOptions, app);

const startUp = async () => {
  console.log(colors.cyan, "-----------------------------------------");
  console.info("Backend App version", require("../../package.json").version);
  let envs = configCheck(appConfig);
  let mongo = false;
  mongo = await mongoStart();
  await verifySMTPConnection();
  dirCheck(dirConfig);
  if (envs && mongo) {
    console.log(
      colors.magenta,
      `-------The servers are starting in ${appConfig.NODE_ENV} Mode------`
    );
    httpServer.listen(appConfig.PORT, function () {
      console.log(
        colors.yellow,
        `HTTP Server started at port : ${httpServer.address().port}`
      );
    });

    if (appConfig.HTTPS_REQUIRED === "true") {
      httpsServer.listen(appConfig.HTTPS_PORT, () => {
        console.log(
          colors.yellow,
          `HTTPS Server running on port : ${httpsServer.address().port}`
        );
      });
    }
  } else {
    process.exit();
  }
};

startUp();

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message, err);
  console.warn(colors.blue, "Unhandled rejection!");
  httpServer.close(() => {
    process.exit(1);
  });
  if (appConfig.HTTPS_REQUIRED === "true") {
    httpsServer.close(() => {
      process.exit(1);
    });
  }
});

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  console.warn(colors.cyan, "Uncaught exception, catch the errors!");
  process.exit(1);
});

function shutDown() {
  console.log(colors.red, "Received kill signal, shutting down gracefully");
  httpServer.close(() => {
    console.log(
      colors.red,
      "Closed out remaining connections on HTTP server !"
    );
    process.exit(0);
  });
  if (appConfig.HTTPS_REQUIRED === "true") {
    httpsServer.close(() => {
      console.log(
        colors.red,
        "Closed out remaining connections on HTTPS server !"
      );
      process.exit(0);
    });
  }
}

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
