const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BASE_URL = 'https://www.smitegame.com/gods/';
const OUTPUT_DIR = path.join(__dirname, 'gods');

// Liste des dieux
const gods = [
	"achilles", "agni", "ah-muzen-cab", "ah-puch", "amaterasu", "anhur", "anubis", "ao-kuang", "aphrodite", "apollo", "arachne", "ares", "artemis", "artio", "athena", "atlas", "awilix", "baba-yaga", "bacchus", "bakasura", "bake-kujira", "baron-samedi", "bastet", "bellona", "cabrakan", "camazotz", "cerberus", "cernunnos", "chaac", "chang'e", "charon", "charybdis", "chernobog", "chiron", "chronos", "cliodhna", "cthulhu", "cu-chulainn", "cupid", "da-ji", "danzaburou", "discordia", "erlang-shen", "eset", "fafnir", "fenrir", "freya", "ganesha", "geb", "gilgamesh", "guan-yu", "hachiman", "hades", "he-bo", "heimdallr", "hel", "hera", "hercules", "horus", "hou-yi", "hun-batz", "ishtar", "ix-chel", "izanami", "janus", "jing-wei", "jormungandr", "kali", "khepri", "king-arthur", "kukulkan", "kumbhakarna", "kuzenbo", "lancelot", "loki", "maman-brigitte", "martichoras", "maui", "medusa", "mercury", "merlin", "morgan-le-fay", "mulan", "ne-zha", "neith", "nemesis", "nike", "nox", "nu-wa", "nut", "odin", "olorun", "osiris", "pele", "persephone", "poseidon", "ra", "raijin", "rama", "ratatoskr", "ravana", "scylla", "serqet", "set", "shiva", "skadi", "sobek", "sol", "sun-wukong", "surtr", "susano", "sylvanus", "terra", "thanatos", "the-morrigan", "thor", "thoth", "tiamat", "tsukuyomi", "tyr", "ullr", "vamana", "vulcan", "xbalanque", "xing-tian", "yemoja", "ymir", "yu-huang", "zeus", "zhong-kui"
];

// Nettoyage noms fichiers
function sanitizeFilename(name) {
	return name.replace(/[/\\?%*:|"<>]/g, '-')
		.replace(/[\x00-\x1F\x7F]/g, '')
		.replace(/\s+/g, '_')
		.toLowerCase();
}

// Téléchargement image
async function downloadImage(url, filename) {
	try {
		const response = await axios.get(url, { responseType: 'arraybuffer' });
		fs.writeFileSync(filename, response.data);
		console.log(`    Téléchargé : ${path.basename(filename)}`);
	} catch (error) {
		console.error(`    Erreur lors du téléchargement de ${url} :`, error.message);
	}
}

async function main() {
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	const browser = await puppeteer.launch({
		executablePath: '/usr/bin/chromium-browser', // chemin vers ton Chromium
		headless: true
	});
	const page = await browser.newPage();

	for (const godName of gods) {

		const role = await page.evaluate(() => {
		const firstMeta = document.querySelector('.profile__meta .meta__single span');
		return firstMeta ? firstMeta.innerText.trim() : "Unknown";
		});

		const roleDir = path.join(OUTPUT_DIR, sanitizeFilename(role));
		if (!fs.existsSync(roleDir)) {
		fs.mkdirSync(roleDir, { recursive: true });
		}

		const godDir = path.join(roleDir, sanitizeFilename(godName));
		if (!fs.existsSync(godDir)) {
		fs.mkdirSync(godDir, { recursive: true });
		}

		const url = BASE_URL + godName;
		console.log(`\n🔎 Traitement de ${godName} -> ${url}`);

		try {
			await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

			// attendre que la liste des skins soit rendue
			await page.waitForSelector('.skins__list .single__skin', { timeout: 5000 });

			// récupérer infos skins
			const skins = await page.evaluate(() => {
				const elements = document.querySelectorAll('.skins__list .single__skin');
				return Array.from(elements).map(el => {
					const style = el.getAttribute('style') || '';
					const match = style.match(/url\(["']?([^"')]+)["']?\)/i);
					const url = match ? match[1] : null;
					const nameEl = el.querySelector('.skin__name');
					const name = nameEl ? nameEl.innerText.trim() : null;
					return url && name ? { url, name } : null;
				}).filter(Boolean);
			});

			console.log(`  ${skins.length} skins trouvées pour ${godName}.`);

			for (const { url: imgUrl, name: skinName } of skins) {
				const filename = path.join(godDir, `${sanitizeFilename(skinName)}.jpg`);
				await downloadImage(imgUrl, filename);
				await new Promise(res => setTimeout(res, 500)); // petite pause
			}

		} catch (err) {
			console.error(`  ❌ Erreur pour ${godName}:`, err.message);
		}
	}

	await browser.close();
	console.log("\n✅ Téléchargement terminé !");
}

main();
