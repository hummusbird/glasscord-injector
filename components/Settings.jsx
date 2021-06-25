const { React } = require('powercord/webpack');
const { Divider, Tooltip, Button } = require('powercord/components');

const fs = require('fs')
const path = require('path');
const { shell } = require('electron');

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
							{fs.existsSync('%appdata%../../resources/app') ?
								<Button onClick={() => injectGlasscord()} color={Button.Colors.GREEN} look={Button.Looks.FILLED} size={Button.Sizes.LARGE}>
									Inject
								</Button> :
								<Tooltip text="Wrong filestructure!">
									<Button className = "glasscordButton" disabled color={Button.Colors.GREEN} look={Button.Looks.FILLED} size={Button.Sizes.LARGE}>
									Inject
									</Button>
								</Tooltip> 
								}
							{fs.existsSync('%appdata%../../resources/app') ?
								<Button onClick={() => uninjectGlasscord()} color={Button.Colors.RED} look={Button.Looks.FILLED} size={Button.Sizes.LARGE}>
									Uninject
								</Button> :
								<Tooltip text = "Wrong filestructure!">
									<Button className = "glasscordButton" disabled color={Button.Colors.RED} look={Button.Looks.FILLED} size={Button.Sizes.LARGE}>
									Uninject
									</Button>
								</Tooltip>
							}
							<Button onClick={() => shell.openPath(path.resolve('%appdata%../../resources/'))} color={Button.Colors.GRAY} look={Button.Looks.FILLED} size={Button.Sizes.LARGE}>
                                Open resources folder
                            </Button>
                        </div>
                    </div>
                    <Divider/>
                    <p><b>Glasscord won't inject!</b></p>
                    <p>Close discord from task manager, and reopen.</p>

                    <p><b>Everything is cyan!</b></p>
                    <p>Make sure you have a supported theme selected. glass_dark should automatically install when you click inject - Go enable it.</p>
					
					<p><b>Everything is a bit gray!</b></p>
					<p>Move the window around a bit.</p>		

					<p><b>It says i have the wrong filestructure!</b></p>
					<p>You have the wrong filestructre. Install manually.</p>
                </div>
            </div>
        );
    }
}

function injectGlasscord() {
	if (fs.existsSync('%appdata%../../resources/app')){

		if (!fs.existsSync(path.resolve(__dirname, '../../themes/glass_dark'))) {
			fs.mkdir(path.resolve(__dirname, '../../themes/glass_dark'), function(err) {
				if (err) {console.log(err)}
			})
			fs.copyFile(path.resolve(__dirname, 'theme.css'), path.resolve(__dirname, '../../themes/glass_dark/theme.css'), (err) => {
				if (err) {console.log(err)};
				console.log("Copied theme.css")
			})
			fs.copyFile(path.resolve(__dirname, 'powercord_manifest.json'), path.resolve(__dirname, '../../themes/glass_dark/powercord_manifest.json'), (err) => {
				if (err) {console.log(err)};
				console.log("Copied powercord_manifest.json")
			})
		}

		fs.copyFile(path.resolve(__dirname, 'glasscord.txt'), path.resolve('%appdata%../../resources/app/glasscord.asar'), (err) => {
			if (err) throw err;
			console.log("Copied glasscord.asar")

			fs.copyFile(path.resolve('%appdata%../../resources/app/package.json'), path.resolve('%appdata%../../resources/app/package.original.json'), (err) => {
				if (err) throw err;
				console.log("Created package.original.json")

				fs.readFile('%appdata%../../resources/app/package.json', 'utf-8', function(err, data) {
					if (err) throw err;
					var newData = data.replace("index.js", "glasscord.asar")
					fs.writeFile('%appdata%../../resources/app/package.json', newData, function(err) {
						if (err) throw err;
						console.log("Edited package.json")

						DiscordNative.app.relaunch()
					})
				})
			})
		})
		


	}
	else {
		console.log("Incorrect filestructure!")
	}
}

function uninjectGlasscord() {
	if (fs.existsSync('%appdata%../../resources/app/package.original.json') && fs.existsSync('%appdata%../../resources/app/package.original.json')){

		fs.copyFile('%appdata%../../resources/app/package.original.json', '%appdata%../../resources/app/package.json', (err) => {
			if (err) {console.log(err)}
			console.log("Renamed package.json")

			fs.unlink('%appdata%../../resources/app/package.original.json', (err) => {
				if (err) {console.log(err)};
				console.log("deleted package.original.json")
			})	

			fs.unlink('%appdata%../../resources/app/glasscord.asar', (err) => {
				if (err) {console.log(err)};
				console.log("deleted glasscord.asar")
			})

			fs.unlink('%appdata%../../resources/app/glasscord.new', (err) => {
				if (err) {console.log(err)};
				console.log("deleted package.original.json")
				
			})	

			DiscordNative.app.relaunch()
		}) 

	}
	else {
		console.log("Incorrect filestructure!")
	}
}