# Vox Clamantis Discord Bot

Setup up to 5 webhooks in your Discord based on these categories:
Chat Report
Logins/outs
Admin Commands
Group Activities
Combat Activities

Add the following code to your server's **Game.ini** file located here:
> {installFolder}/BeastsOfBermuda/Saved/Config/WindowsServer
(if it does not exist, create it under this location)

```
[GameReporter]
ChatReportDiscordWebhook="123456/examplekey_dwdhwaowdawbdwaowdcic11938374-ce"
ChatReportIconURL=""
LoginDiscordWebhook="123456/examplekey_dwdhwaowdawbdwaowdcic11938374-ce"
LoginDiscordIconURL=""
AdminCmdDiscordWebhook="123456/examplekey_dwdhwaowdawbdwaowdcic11938374-ce"
AdminCmdDiscordIcon=""
GroupActivityDiscordWebhook="123456/examplekey_dwdhwaowdawbdwaowdcic11938374-ce"
GroupActivityDiscordIconURL=""
CombatActivityDiscordWebhook="123456/examplekey_dwdhwaowdawbdwaowdcic11938374-ce"
CombatActivityDiscordIconURL=""

bUseChatWebhook=False
ChatWebhookFormatStyle="[:x01]<{PlayerInfo}>[:x01] <ChatMode={ChatMode}> **>** _{msg}_"

bUseLoginReportWebhook=False
LoginReportFormatStyle="Player [:x01]<{PlayerInfo}>[:x01] joined server _{Server}_\n----"
LogoutReportFormatStyle="Player [:x01]<{PlayerInfo}>[:x01] left server _{Server}_, played for {Hours}:{Minutes}.\n----"

bUseAdminCommandUsageWebhook=False
AdminCommandUsageFormatStyle="Player [:x01]<{PlayerInfo}>[:x01] used command [:x01]{Cmd}[:x01]\n----"

bUseGroupActivityWebhook=False
```
Obviously change the 123456/examplekey_dwdhwaowdawbdwaowdcic11938374-ce to your webhook link
> e.g. https://discordapp.com/api/webhooks/864574086981222411/E4W2PurzqHUS6OnLVNWjNQIdEcoia4Q6nMYL46d6g3FxYR6BvyLMt3sWP0WphoZpsuoa
> Becomes
> 864574086981222411/E4W2PurzqHUS6OnLVNWjNQIdEcoia4Q6nMYL46d6g3FxYR6BvyLMt3sWP0WphoZpsuoa

[TBC](https://wiki.beastsofbermuda.com/Discord_webhooks)
