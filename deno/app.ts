import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";
const app = new Application();

import todosRoutes from "./routes/todos.ts";

// Connect to DB
import { connect } from "./helpers/db.ts";
await connect();

//////////////////////

// app.use(async (ctx, next) => {
//   console.log("Middleware!");
//   await next();
// });

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });

/////////////////////////////////////
// const todos = await getDb().collection("todos").find().toArray();
// todo._id.toString()
