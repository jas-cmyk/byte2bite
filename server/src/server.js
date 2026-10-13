import { createApp } from "./app.js";
import { PORT } from "./config.js";

createApp().listen(PORT, () => {
  console.log(`byte2bite server running on http://localhost:${PORT}`);
});