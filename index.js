const { Plugin } = require('powercord/entities');
const fs = require('fs')
const path = require('path')

const prefix = powercord.api.commands.prefix;

module.exports = class GlasscordInjector extends Plugin {

    async startPlugin() {
		powercord.api.commands.registerCommand({
			command: 'glasscord',
			description: 'Attempts to inject Glasscord',
			usage: '{c} for more help',
			executor: this.handleCommand.bind(this)
		});
	}

    pluginWillUnload() {
		powercord.api.commands.unregisterCommand('glasscord');
	}

    async handleCommand() {
		if (fs.existsSync('%appdata%../../resources/app')){
			fs.copyFile(path.resolve(__dirname, 'glasscord.txt'), path.resolve('%appdata%../../resources/app/glasscord.asar'), (err) => {
				if (err) throw err;
				console.log("Copied glasscord.asar")
			})
			fs.copyFile(path.resolve('%appdata%../../resources/app/package.json'), path.resolve('%appdata%../../resources/app/package.original.json'), (err) => {
				if (err) throw err;
				console.log("Created package.original.json")
			})
			fs.readFile('%appdata%../../resources/app/package.json', 'utf-8', function(err, data) {
				if (err) throw err;
				var newData = data.replace("index.js", "glasscord.asar")
				fs.writeFile('%appdata%../../resources/app/package.json', newData, function(err) {
					if (err) throw err;
					console.log("Edited package.json")
				})
			})
			if (!fs.existsSync(path.resolve(__dirname, '../../themes/glass_dark_2'))) {
				fs.mkdir(path.resolve(__dirname, '../../themes/glass_dark_2'), function(err) {
					if (err) {console.log(err)}
				})
				fs.copyFile(path.resolve(__dirname, 'theme.css'), path.resolve(__dirname, '../../themes/glass_dark_2/theme.css'), (err) => {
					if (err) {console.log(err)};
					console.log("Copied theme.css")
				})
				fs.copyFile(path.resolve(__dirname, 'powercord_manifest.json'), path.resolve(__dirname, '../../themes/glass_dark_2/powercord_manifest.json'), (err) => {
					if (err) {console.log(err)};
					console.log("Copied powercord_manifest.json")
				})
			}

			DiscordNative.app.relaunch()
		}
		else {
			console.log("No")
		}
    }


}