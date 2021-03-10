# EMC-Core-quick-start
EMC-Core quick start project

# Installation :zap:
```npm
git clone https://github.com/Zeldown/EMC-Core-quick-start.git
cd EMC-Core-quick-start
npm install
```

# Run :rocket:
```npm
npm start
```

___
# Install Server :construction:
> :rotating_light: You must have a web hosting

## PreBuild Server Version
1. Download **EMC-Core-Server** of your version at *https://github.com/Zeldown/EMC-Core/releases*
2. Extract archive on your computer
3. In *EMC-Core-Server/files* put your files to download (mods, config, etc). Default files in folder is **mandatory** (assets, libraries, natives, versions)
4. Put the folder *EMC-Core-Server* to your web hosting (exemple: upload folder EMC-Core-Server at https://exemple.com/)
5. Set url option of *launch options* to url of content of *EMC-Core-Server* (exemple: https://exemple.com/EMC-Core-Server)
```javascript
let opts = {
  url: url_of_emc-core-server,
  ...
}
```

## Build custom EMC-Core-Server
1. Create a folder with the file [reader.php](EMC-Core-Server/reader.php)
2. Create a folder **java**
3. Put an archive of java named *java.zip* in ```java``` folder (exemple : [java.zip](EMC-Core-Server/java/java.zip)
4. Create a folder **files**
5. Put all files of minecraft in folder ```files``` like *assets, library, natives, mods, versions*
6. Put your custom folder to your web hosting (exemple: upload folder My-Version at https://exemple.com/)
7. Set url option of *launch options* to url of content of *custom folder* (exemple: https://exemple.com/My-Version)
```javascript
let opts = {
  url: url_of_your_uploaded_version,
  ...
}
```

