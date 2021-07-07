const { Client } = require("discord.js");
const Discord = require("discord.js");
const client = new Client();
const express = require('express');

const config = {
    whitlist: "",// Url'yi Değiştirebilecek Kişiler
    bot: "",// Botların İdsi
    log: "",//Url Değiştirildiğinde Mesajın Gideceği Kanal
    url: "",//Url İle Oynandığı Zaman Yapılacak Url
    tokens: "",//Bot Tokeni
    ses: ""//Botun Hangi Sese Gireceği Kanal (İd Girmezseniz sıkıntı çıkmaz)
}

const güvenli = config.whitlist || config.bot

client.on('guildUpdate', async (oldGuild, newGuild) => {
    const request = require('request');
    const moment = require('moment');
    let entry = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE' }).then(audit => audit.entries.first());
    moment.locale('tr');
    if (newGuild.vanityURLCode === null) return; // URL yoksa bişi yapmasın
    if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return; // URL'ler aynıysa bişi yapmasın
    if (güvenli.includes(entry.executor.id)) return; //Güvenlide ki Birisi İse Dokunmasın 
 /*   newGuild.roles.cache.forEach(async function (ytkapat) {
        if (ytkapat.permissions.has("ADMINISTRATOR") || ytkapat.permissions.has("BAN_MEMBERS") || ytkapat.permissions.has("MANAGE_GUILD") || ytkapat.permissions.has("KICK_MEMBERS") || ytkapat.permissions.has("MANAGE_ROLES") || ytkapat.permissions.has("MANAGE_CHANNELS")) {
            ytkapat.setPermissions(0).catch(err => { });
        }
    });*/
    // Yetki Kapatma Fonksiyonu açmak isterseniz yorum satırından çıkarın başka yetkiler eklemek isterseniz " || ytkapat.permissions.has("Yetki İsmi")"
    newGuild.members.ban(entry.executor.id, { reason: "URL Koruma Sistemi!" })
    let log = client.channels.cache.get(config.log)
    if (!log) return console.log('URL Koruma Logu Yok!')
    log.send(`**@everyone (${entry.executor} - ${entry.executor.id}) Tarafından Sunucu URL'si Değiştirildi**\n**URL'yi ``discord.gg/${config.url}`` Yaptım Ve Yetkiliyi Banlayıp Tüm Yetkileri Kapadım**`)
    client.users.cache.get(config.owner).send(`**<@!${config.owner.id}> (${entry.executor} - ${entry.executor.id}) Tarafından Sunucu URL'si Değiştirildi**\n**URL'yi ``discord.gg/${config.url}`` Yaptım Ve Yetkiliyi Banlayıp Tüm Yetkileri Kapadım**`)
    request({
        method: 'PATCH',
        url: `https://discord.com/api/v8/guilds/${newGuild.id}/vanity-url`,
        body: {
            code: config.url
        },
        json: true,
        headers: {
            "Authorization": `Bot ${config.tokens}`// Eğer Bu kısmı başka bi bota koyarsanız config.tokens yazan yeri botunuzun tokeninin bulunduğu yeri yazın
        }
    }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
    });
});

client.on("ready", () => {
    client.user.setPresence({ activity: { name: "Developed By Jahky" }, status: "dnd" });
    console.log(`${client.user.username} Olarak Giriş Yapıldı Guard I Aktif`)
    const ses = client.channels.cache.get(config.ses);
    if (!ses) return
    ses.join()
});

client.login(config.tokens).catch(err => {
    console.error("URL Guard Giriş Yapamadı!")
    console.error("Token Girilmemiş!")
});
