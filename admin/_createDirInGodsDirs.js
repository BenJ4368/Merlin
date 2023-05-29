const fs = require('fs');
const path = require('path');

const dirToCreate = 'sounds'
const godsDirectory = './resources/gods';

// Vérifier si le dossier "gods" existe
if (fs.existsSync(godsDirectory)) {
  // Lire les dossiers dans le dossier "gods"
  const subDirectories = fs.readdirSync(godsDirectory);

  // Parcourir chaque sous-dossier
  subDirectories.forEach((subDirectory) => {
    const subDirectoryPath = path.join(godsDirectory, subDirectory);

    // Vérifier si le chemin correspond à un dossier
    if (fs.statSync(subDirectoryPath).isDirectory()) {
      const soundsDirectoryPath = path.join(subDirectoryPath, dirToCreate);

      // Vérifier si le dossier "sounds" n'existe pas déjà
      if (!fs.existsSync(soundsDirectoryPath)) {
        // Créer le dossier "sounds"
        fs.mkdirSync(soundsDirectoryPath);
        console.log(`Created ${dirToCreate} directory in ${subDirectoryPath}`);
      }
    }
  });
} else {
  console.log('The "gods" directory does not exist.');
}