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

interface RegisterUser {
  user: { id: string };
  token: string;
  id: string;
  socket: string;
}

let users: Array<RegisterUser> = [];
const sockets: { [user: string]: Array<string> } = {};

io.on("connection", (socket) => {
  socket.on("emit", (listener: Listener) => {
    console.log(listener);
    io.emit(listener.event, listener.data);
  });

  socket.on("register", (user: RegisterUser) => {
    user.socket = socket.id;
    users.push(user);
    console.log(users.length, user);

    if (sockets[user.id] && Array.isArray(sockets[user.id]))
      sockets[user.id].push(socket.id);
    else sockets[user.id] = [socket.id];
  });

  socket.on("disconnect", (reason) => {
    users = users.filter((user) => user.socket !== socket.id);
    const user = users.find((user) => user.socket == socket.id);
    if (user && sockets[user.id] && Array.isArray(sockets[user.id])) {
      sockets[user.id] = sockets[user.id].filter((id) => id !== socket.id);
    }
    console.log(
      users.length,
      `socket ${socket.id} disconnected due to ${reason}`
    );
  });
});

await serve(io.handler(), {
  port: 3070,
});
