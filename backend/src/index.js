import app from "./app";
import "./config/base_de_datos";
import { PORT } from "./config/config";

app.listen(PORT);
console.log("server listen on port", app.get("port"));
