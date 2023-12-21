const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandle } = require("./middleware/errorMiddleware");
const connectDB = require("./configuration/mongo-db");
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/tasksRoutes"));
app.use("/api/timesheet", require("./routes/timesheetRoutes"));
app.use("/api/column", require("./routes/columnRoutes"));

app.use(errorHandle); //overwrites the default express error handler

app.listen(port, () => console.log(`Server started on port ${port}`));
