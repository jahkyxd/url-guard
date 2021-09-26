const { Client } = require("discord.js");
const Discord = require("discord.js");
const client = new Client();
const express = require('express');

client.on('guildUpdate', async (oldGuild, newGuild) => {
    const request = require('request');
    const moment = require('moment');
    let entry = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE' }).then(audit => audit.entries.first());
    moment.locale('tr');
    if (newGuild.vanityURLCode === null) return;
    if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
    newGuild.members.ban(entry.executor.id, { reason: "URL Koruma Sistemi!" })
    request({
        method: 'PATCH',
        url: `https://discord.com/api/v8/guilds/${newGuild.id}/vanity-url`,
        body: {
            code: oldGuild.vanityURLCode
        },
        json: true,
        headers: {
            "Authorization": `Bot ${client.token}`
        }
    }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
});

client.on("ready", () => {
    client.user.setPresence({ activity: { name: "Developed By Jahky" }, status: "dnd" });
});

client.login("tokeeniniz").then(x => console.log(`${client.user.username} olarak giriş yapıldı`)).catch(err => console.log(`Giriş yaparken bir sorun oluştu! Sebeb: ${err}`));
