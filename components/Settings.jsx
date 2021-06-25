const { React } = require('powercord/webpack');
const { Divider, Button } = require('powercord/components');

const fs = require('fs')
const path = require('path');

module.exports = class GlasscordInjectorSettings extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>
                <div className='powercord-entities-manage powercord-text'>
                    <div className='powercord-entities-manage-header'>
                    <span>Inject Glasscord</span>
                        <div className='buttons glasscord-injector-buttons'>
                            <Button onClick={() => this.injectGlasscord()} color={Button.Colors.GREEN} look={Button.Looks.FILLED} size={Button.Sizes.LARGE}>
                                Inject
                            </Button>
                            <Button onClick={() => this.uninjectGlasscord()} color={Button.Colors.RED} look={Button.Looks.FILLED} size={Button.Sizes.LARGE}>
                                Uninject
                            </Button>
                        </div>
                    </div>
                    <Divider/>
                    <p><b>Glasscord won't inject!</b></p>
                    <p>Close discord from task manager, and reopen.</p>

                    <p><b>Everything is cyan!</b></p>
                    <p>Make sure you have a supported theme selected. glass_dark should automatically install - Go enable it.</p>
                </div>
            </div>
        );
    }
}

function injectGlasscord() {
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