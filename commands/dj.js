const Discord = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const clr = require("../resources/color_codes");
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

// Cette Map va stocker l'instance DisTube
let distubeInstance = null;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('dj')
        .setDescription('Joue une playlist ou un morceau de musique')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action à effectuer')
                .setRequired(true)
                .addChoices(
                    { name: 'Play', value: 'play' },
                    { name: 'Stop', value: 'stop' },
                    { name: 'Pause', value: 'pause' },
                    { name: 'Resume', value: 'resume' },
                    { name: 'Skip', value: 'skip' },
                    { name: 'Queue', value: 'queue' },
                ))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL YouTube, Spotify ou terme de recherche')),

    async execute(interaction) {
        console.log(`${clr.cya}[cmd] ${clr.blu}/dj ${clr.whi}was fired by ${clr.blu}${interaction.user.username}${clr.stop}`);
        
        const action = interaction.options.getString('action');
        const url = interaction.options.getString('url');
        const voiceChannel = interaction.member.voice.channel;
        
        try {

            // Vérification si l'utilisateur est dans un salon vocal
            if (!voiceChannel) {
                return await interaction.reply({ 
                    content: "Vous devez être dans un salon vocal pour utiliser cette commande.", 
                    ephemeral: true 
                });
            }
            
            // Vérification des permissions
            try {
                const permissions = voiceChannel.permissionsFor(interaction.client.user);
                if (!permissions.has(Discord.PermissionFlagsBits.Connect) || 
                    !permissions.has(Discord.PermissionFlagsBits.Speak)) {
                    return await interaction.reply({ 
                        content: "❌ Je n'ai pas les permissions nécessaires pour rejoindre et parler dans ce salon vocal!", 
                        ephemeral: true 
                    });
                }
            } catch (error) {
                // Si les PermissionFlagsBits ne sont pas disponibles, essayer l'ancienne méthode
                if (!voiceChannel.permissionsFor(interaction.client.user).has(["SPEAK", "CONNECT"])) {
                    return await interaction.reply({ 
                        content: "❌ Je n'ai pas les permissions nécessaires pour rejoindre et parler dans ce salon vocal!", 
                        ephemeral: true 
                    });
                }
            }

            // Forcer la déconnexion avant de se reconnecter (peut aider à résoudre certains problèmes)
            const existingConnection = getVoiceConnection(interaction.guildId);
            if (existingConnection && action === 'play') {
                console.log("Déconnexion forcée avant de rejoindre à nouveau le salon vocal");
                existingConnection.destroy();
            }
            
            // Initialiser DisTube si ce n'est pas déjà fait
            if (!distubeInstance) {
                // Personnaliser le comportement du joinVoiceChannel pour DisTube
                class CustomConnector {
                    constructor(client) {
                        this.client = client;
                    }
                    
                    join(channel, options = {}) {
                        console.log(`Connexion personnalisée au salon vocal ${channel.name} avec selfDeaf=false`);
                        
                        return joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator,
                            selfDeaf: false,
                            selfMute: false,
                            ...options
                        });
                    }
                }
                
                // Créer une nouvelle instance DisTube avec la connexion personnalisée
                distubeInstance = new DisTube(interaction.client, {
                    plugins: [
                        new SpotifyPlugin(),
                        new SoundCloudPlugin(),
                        new YtDlpPlugin({
                            update: true
                        })
                    ],
                    emitNewSongOnly: true,
                    emitAddSongWhenCreatingQueue: false,
                    nsfw: false
                });
                
                // Configurer les événements DisTube
                distubeInstance.on("playSong", (queue, song) => {
                    // Vérifier et corriger la connexion après le début de la lecture
                    try {
                        const connection = getVoiceConnection(queue.id);
                        if (connection && connection.joinConfig.selfDeaf) {
                            console.log("Correction de la connexion (selfDeaf=true détecté)");
                            // Recréer la connexion avec les bons paramètres
                            connection.destroy();
                            joinVoiceChannel({
                                channelId: queue.voiceChannel.id,
                                guildId: queue.id,
                                adapterCreator: queue.voiceChannel.guild.voiceAdapterCreator,
                                selfDeaf: false,
                                selfMute: false
                            });
                        }
                    } catch (e) {
                        console.error("Erreur lors de la vérification de la connexion:", e);
                    }
                    
                    const channel = queue.textChannel;
                    channel.send(`🎵 En cours de lecture: **${song.name}** - \`${song.formattedDuration}\``);
                });
                
                distubeInstance.on("addSong", (queue, song) => {
                    const channel = queue.textChannel;
                    channel.send(`✅ Ajouté à la file d'attente: **${song.name}** - \`${song.formattedDuration}\``);
                });
                
                distubeInstance.on("error", (error) => {
                    console.error("Erreur DisTube:", error);
                });
                
                distubeInstance.on("initQueue", (queue) => {
                    console.log("File d'attente initialisée pour le serveur:", queue.id);
                    // Définir le volume par défaut
                    queue.setVolume(50);
                });
                
                distubeInstance.on("disconnect", (queue) => {
                    console.log("Déconnecté du salon vocal dans le serveur:", queue.id);
                });
            }
            
            // Gérer les différentes actions
            switch (action) {
                case 'play':
                    if (!url) {
                        return await interaction.reply({ 
                            content: 'Vous devez fournir une URL ou un terme de recherche.', 
                            ephemeral: true 
                        });
                    }
                    
                    // Répondre immédiatement pour éviter l'erreur "InteractionNotReplied"
                    await interaction.reply(`🔍 Recherche en cours...`);
                    
                    try {
                        console.log("Demande de lecture avec DisTube:", url);
                        
                        // Jouer la musique avec DisTube
                        distubeInstance.play(voiceChannel, url, {
                            member: interaction.member,
                            textChannel: interaction.channel,
                            position: 0,
                        }).then(() => console.log("Lecture demarree avec succès"))
						.catch(error => console.error("Erreur lors de la lecture:", error));
                        
                        // Vérifier que la connexion a été établie avec les bons paramètres après un court délai
                        setTimeout(() => {
                            const connection = getVoiceConnection(interaction.guildId);
                            if (connection) {
                                console.log("État de la connexion après lecture:");
                                console.log("- selfDeaf:", connection.joinConfig.selfDeaf);
                                console.log("- selfMute:", connection.joinConfig.selfMute);
                                
                                // Si la connexion est toujours en mode sourdine, tenter de la corriger
                                if (connection.joinConfig.selfDeaf) {
                                    console.log("Tentative de correction de la connexion (selfDeaf=true détecté)");
                                    // Parfois, recreer une connexion peut aider
                                    connection.destroy();
                                    const newConnection = joinVoiceChannel({
                                        channelId: voiceChannel.id,
                                        guildId: interaction.guild.id,
                                        adapterCreator: interaction.guild.voiceAdapterCreator,
                                        selfDeaf: false,
                                        selfMute: false
                                    });
                                    
                                    console.log("Nouvelle connexion établie avec selfDeaf=false");
                                }
                            }
                        }, 500);
                        
                    } catch (error) {
                        console.error("Erreur lors de la lecture:", error);
                        await interaction.editReply(`❌ Erreur lors de la lecture: ${error.message}`);
                    }
                    break;
                    
                case 'stop':
                    try {
                        const queue = distubeInstance.getQueue(interaction.guildId);
                        if (!queue) {
                            return await interaction.reply({ 
                                content: '❌ Il n\'y a rien en cours de lecture!', 
                                ephemeral: true 
                            });
                        }
                        
                        queue.stop();
                        return await interaction.reply('🛑 Lecture stoppée et file d\'attente vidée.');
                    } catch (error) {
                        return await interaction.reply({ 
                            content: `❌ Erreur lors de l'arrêt: ${error.message}`, 
                            ephemeral: true 
                        });
                    }
                    
                case 'pause':
                    try {
                        const queuePause = distubeInstance.getQueue(interaction.guildId);
                        if (!queuePause) {
                            return await interaction.reply({ 
                                content: '❌ Il n\'y a rien en cours de lecture!', 
                                ephemeral: true 
                            });
                        }
                        
                        if (queuePause.paused) {
                            return await interaction.reply({ 
                                content: '⚠️ La lecture est déjà en pause!', 
                                ephemeral: true 
                            });
                        }
                        
                        queuePause.pause();
                        return await interaction.reply('⏸️ Lecture mise en pause.');
                    } catch (error) {
                        return await interaction.reply({ 
                            content: `❌ Erreur lors de la mise en pause: ${error.message}`, 
                            ephemeral: true 
                        });
                    }
                    
                case 'resume':
                    try {
                        const queueResume = distubeInstance.getQueue(interaction.guildId);
                        if (!queueResume) {
                            return await interaction.reply({ 
                                content: '❌ Il n\'y a rien en cours de lecture!', 
                                ephemeral: true 
                            });
                        }
                        
                        if (!queueResume.paused) {
                            return await interaction.reply({ 
                                content: '⚠️ La lecture n\'est pas en pause!', 
                                ephemeral: true 
                            });
                        }
                        
                        queueResume.resume();
                        return await interaction.reply('▶️ Reprise de la lecture.');
                    } catch (error) {
                        return await interaction.reply({ 
                            content: `❌ Erreur lors de la reprise: ${error.message}`, 
                            ephemeral: true 
                        });
                    }
                    
                case 'skip':
                    try {
                        const queueSkip = distubeInstance.getQueue(interaction.guildId);
                        if (!queueSkip) {
                            return await interaction.reply({ 
                                content: '❌ Il n\'y a rien en cours de lecture!', 
                                ephemeral: true 
                            });
                        }
                        
                        try {
                            queueSkip.skip();
                            return await interaction.reply('⏭️ Passage au morceau suivant!');
                        } catch (e) {
                            return await interaction.reply({ 
                                content: '❌ Il n\'y a pas de morceau suivant dans la file d\'attente!', 
                                ephemeral: true 
                            });
                        }
                    } catch (error) {
                        return await interaction.reply({ 
                            content: `❌ Erreur lors du passage au morceau suivant: ${error.message}`, 
                            ephemeral: true 
                        });
                    }
                    
                case 'queue':
                    try {
                        const queueList = distubeInstance.getQueue(interaction.guildId);
                        if (!queueList) {
                            return await interaction.reply({ 
                                content: '❌ Il n\'y a rien en cours de lecture!', 
                                ephemeral: true 
                            });
                        }
                        
                        const currentSong = queueList.songs[0];
                        let queueString = `**File d'attente actuelle**\n` +
                                        `En cours de lecture: **${currentSong.name}** - \`${currentSong.formattedDuration}\`\n\n`;
                        
                        if (queueList.songs.length > 1) {
                            queueString += queueList.songs.slice(1, 10).map((song, index) => {
                                return `**${index + 1}.** ${song.name} - \`${song.formattedDuration}\``;
                            }).join('\n');
                            
                            if (queueList.songs.length > 10) {
                                queueString += `\n...et ${queueList.songs.length - 10} autres morceaux`;
                            }
                        } else {
                            queueString += '*La file d\'attente est vide*';
                        }
                        
                        return await interaction.reply(queueString);
                    } catch (error) {
                        return await interaction.reply({ 
                            content: `❌ Erreur lors de l'affichage de la file d'attente: ${error.message}`, 
                            ephemeral: true 
                        });
                    }
                    
                default:
                    return await interaction.reply({ 
                        content: 'Action invalide.', 
                        ephemeral: true 
                    });
            }
        } catch (error) {
            console.error("Erreur principale:", error);
            
            // S'assurer que l'interaction a toujours une réponse en cas d'erreur
            if (!interaction.replied && !interaction.deferred) {
                return await interaction.reply({ 
                    content: `❌ Une erreur s'est produite: ${error.message}`, 
                    ephemeral: true 
                });
            } else {
                return await interaction.followUp({
                    content: `❌ Une erreur s'est produite: ${error.message}`,
                    ephemeral: true
                });
            }
        }
    }
};