const express = require('express');
const cors = require('cors');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

app.post('/api/submit', async (req, res) => {
    try {
        const {
            email,
            age,
            citizenship,
            discord,
            ingame,
            battletag,
            role,
            rank,
            reason
        } = req.body;

        // Basic validation
        if (!email || !discord || !battletag || !role || !rank) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const issueTitle = `Tryout Application: ${battletag} - ${role}`;
        const issueBody = `
## Tryout Application

**Email:** ${email}
**Discord:** ${discord}
**Battle Tag:** ${battletag}
**Ingame Name:** ${ingame || 'N/A'}
**Rol:** ${role}
**Rango Más Alto (2 últimas temp):** ${rank}

**¿Tiene 17 años o más antes del 1 de marzo 2026?:** ${age}
**¿Es ciudadano/residente legal?:** ${citizenship}

**¿Por qué quieres competir en la OWWC?**
${reason || 'N/A'}
        `;

        const response = await octokit.rest.issues.create({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            title: issueTitle,
            body: issueBody,
            labels: ['tryout', role.toLowerCase()]
        });

        res.status(200).json({ success: true, issueUrl: response.data.html_url });
    } catch (error) {
        console.error('Error creating GitHub issue:', error);
        res.status(500).json({ error: 'Hubo un error al procesar tu solicitud.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
