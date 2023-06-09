import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.31.2/mod.ts";

let db: Database;

export async function connect() {
  const client = new MongoClient();

  await client.connect({
    db: "todo",
    tls: true,
    servers: [
      {
        host: "ac-b8rmipw-shard-00-02.trguitc.mongodb.net",
        port: 27017,
      },
    ],
    credential: {
      username: "Ahmed_Adel",
      password: "Ahmed_123456789",
      db: "todo",
      mechanism: "SCRAM-SHA-1",
    },
  });

  db = client.database("todo");
}

export function getDb() {
  return db;
}
