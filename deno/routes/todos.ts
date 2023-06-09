import { Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
const router = new Router();

import { getDb } from "../helpers/db.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

interface Todo {
  id?: string;
  text: string;
}

router.get("/todos", async (ctx) => {
  const todos = await getDb().collection("todos").find().toArray();
  const transformedTodos = todos.map((todo) => {
    return { id: todo._id.toString(), text: todo.text };
  });

  ctx.response.body = { todos: transformedTodos };
});

router.post("/todos", async (ctx) => {
  let data = await ctx.request.body();
  data = await data.value;

  const newTodo: Todo = {
    text: data.text,
  };
  const id = await getDb().collection("todos").insertOne(newTodo);
  newTodo.id = id.$oid;

  ctx.response.body = { message: "Created todo!", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const tid = ctx.params.todoId;
  let data = await ctx.request.body();
  data = await data.value;

  const res = await getDb()
    .collection("todos")
    .updateOne({ _id: new ObjectId(tid) }, { $set: { text: data.text } });

  if (res.matchedCount >= 1) {
    ctx.response.body = { message: "Updated todo" };
  } else {
    ctx.response.body = { message: "Something went wrong!" };
  }
});

router.delete("/todos/:todoId", async (ctx) => {
  const tid = ctx.params.todoId;
  const res = await getDb()
    .collection("todos")
    .deleteOne({ _id: new ObjectId(tid) });

  if (res === 1) {
    ctx.response.body = { message: "Deleted todo" };
  } else {
    ctx.response.body = { message: "Something went wrong!" };
  }
});

export default router;
