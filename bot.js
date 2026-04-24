import { birthdays } from "./birthdays.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

function getToday() {
    const now = new Date();

    return now.toLocaleDateString("en-CA", {
        timeZone: "Europe/Moscow",
    }).slice(5); // MM-DD
}

async function sendMessage(text) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: "HTML",
        }),
    });
}

async function run() {
    const today = getToday();
    console.log("Today:", today);

    const todayPeople = birthdays.filter(p => p.date === today);

    if (todayPeople.length === 0) {
        console.log("No birthdays today");
        return;
    }

    for (const person of todayPeople) {
        const text = `🎉 <a href="tg://user?id=${person.telegramId}">${person.name}</a>\n\n${person.message}`;

        console.log("Sending:", person.name);

        await sendMessage(text);
    }
}

run();