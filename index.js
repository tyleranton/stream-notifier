const tmi = require("tmi.js");
const notifier = require("node-notifier");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question(`Enter your Twitch username:\n`, owner => {
  init(owner);
  readline.close();
});

function init(owner) {
  const client = new tmi.Client({
    options: { debug: true },
    connection: {
      reconnect: true,
      secure: true
    },
    channels: [owner]
  });

  client.connect();
  client.on("message", onMessageHandler);

  function onMessageHandler(target, context, msg, self) {
    if (self) {
      return;
    }

    const cmd = msg.split(" ");

    if (cmd[0] === "!notify" && (context.username === owner || context.mod)) {
      notifier.notify({
        title: `Notification from ${context.username}`,
        message: msg.split("!notify")[1]
      });
    }
  }
}
