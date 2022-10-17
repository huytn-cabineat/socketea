import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";

const ioOptions = {
  /* options */
  cors: {
    origin: [
      "http://localhost:3000",
      "https://app.nhaydingaichi.vn",
      "https://admin.socket.io",
    ],
    credentials: true,
  },
  cookie: {
    name: "nhay",
    sameSite: "none",
    secure: true,
  },
};

const io = new Server(ioOptions);

interface Listener {
  event: string;
  data: unknown;
}

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.on("emit", (listener: Listener) => {
    console.log(listener);
    io.emit(listener.event, listener.data);
  });

  socket.emit("toast", { description: "world" });

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

await serve(io.handler(), {
  port: 3070,
});
