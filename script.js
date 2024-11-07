const clientId = "web_client_" + Math.random().toString(16).substr(2, 8);
const host = "wss://pemulungilmu.cloud.shiftr.io:443";
const options = {
  keepalive: 60,
  clientId: clientId,
  username: "pemulungilmu", 
  password: "bosacong", 
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30000,
};

const client = mqtt.connect(host, options);

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Update status koneksi pada halaman web
  document.getElementById("connection-status").innerText = "Terhubung";
  document.getElementById("connection-status").classList.remove("disconnected");
  document.getElementById("connection-status").classList.add("connected");

  // Subscribe ke topik suhu dan kelembaban
  client.subscribe("home/temperature");
  client.subscribe("home/humidity");
});

client.on("message", (topic, message) => {
  if (topic === "home/temperature") {
    document.getElementById("temperature").innerText =
      message.toString() + "°C";
  } else if (topic === "home/humidity") {
    document.getElementById("humidity").innerText = message.toString() + "%";
  }
});

// Kontrol lampu
document.getElementById("lamp-on").addEventListener("click", () => {
  client.publish("home/lamp/control", "on");
});

document.getElementById("lamp-off").addEventListener("click", () => {
  client.publish("home/lamp/control", "off");
});

client.on("error", (error) => {
  console.log("MQTT connection error:", error);
  document.getElementById("connection-status").innerText = "Terputus";
  document.getElementById("connection-status").classList.remove("connected");
  document.getElementById("connection-status").classList.add("disconnected");
});
