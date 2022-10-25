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

interface Register {
  user: { id: string };
  token: string;
  id: string;
}

interface User extends Register {
  sockets: Array<string>;
}

let users: Array<User> = [];

io.on("connection", (socket) => {
  socket.on("emit", (listener: Listener) => {
    console.log(listener);
    io.emit(listener.event, listener.data);
  });

  socket.on("register", (register: Register) => {
    if (!register.user) return;
    // find user
    const user = users.find((user) => user.user.id == register.user.id);
    // remove user
    users = users.filter((user) => user.user.id !== register.user.id);

    if (user) {
      // modify user
      if (!user.sockets.includes(socket.id)) {
        user.sockets.push(socket.id);
      }
      // re push user
      users.push(user);
    } else {
      // create user
      users.push({ ...register, sockets: [socket.id] } as User);
    }
    console.log(users.length, register.user);
  });

  socket.on("disconnect", (reason) => {
    // find user
    const user = users.find((user) => user.sockets.includes(socket.id));
    // remove
    users = users.filter((user) => !user.sockets.includes(socket.id));

    // modify user
    if (user?.sockets) {
      user.sockets = user?.sockets.filter((id) => id != socket.id);
      if (user.sockets.length) {
        users.push(user);
      }
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
