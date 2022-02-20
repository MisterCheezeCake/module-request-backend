const express = require("express")
const config = require("./config.json")
const { WebhookClient, MessageEmbed } = require("discord.js")
const client = new WebhookClient({url: config.webhook})
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express()

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1
});
app.use(cors({origin: "*", preflightContinue: true}))
app.use(limiter)
app.use(express.json())
app.post('/', (req, res) => {
  if (!req.body.text || !req.body.uuid) {
    res.send("You must provide both text and a UUID, also it looks like you are requesting the backend outside the mod, please dont do that.")
    return;
  }
  const {text, uuid} = req.body
  const module_ = req.body.module || "Unspecified"
  let color = Math.round(Math.random() * 16777215)
  if (color > 16777215 || color < 0) color = 0
  client.send({embeds: [new MessageEmbed().setTitle("Request").addField("User", `\`${uuid}\``).addField("Module", module_).setDescription(text).setColor(color)]}).then(m => {
    res.send("Request Complete")
  })
})


app.listen(8080, () => console.log('App on localhost:8080') )