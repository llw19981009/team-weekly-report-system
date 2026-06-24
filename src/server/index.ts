import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

app.listen(port, () => {
  console.log(
    `Team weekly report system is running at http://127.0.0.1:${port}`,
  );
});
