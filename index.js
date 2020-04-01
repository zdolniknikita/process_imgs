const fs = require('fs')
const Jimp = require('jimp')
const config = require('config')

const start = async () => {
    
    let inputPath = config.get('input.folder.fullpath')
    let outputPath = config.get('output.folder.fullpath')

    let w = config.get('output.resize.width')
    let h = config.get('output.resize.height')

    if ( !inputPath ) return console.log('Please enter the path input image folder first')
    if ( !outputPath ) return console.log('Please enter the path output image folder first')

    if ( !w && !h ) return console.log('Width and Height cannot both be set to 0')

    const { x, y, fullpath } = config.get('output.watersign')

    if ( !fullpath ) return console.log('Please enter the path image logo')
    
    const waterMark = await Jimp.read(fullpath)
        await waterMark.resize(300, 300)


    if ( !w ) w = Jimp.AUTO
    if ( !h ) h = Jimp.AUTO


    fs.readdir(inputPath, async (err, filenames) => {

        if ( err ) throw err

        await Promise.all(
            filenames.map(async imgPath => {

                const image = await Jimp.read(`${inputPath}/${imgPath}`)

                await image
                        .resize(w, h)
                        .quality(100)
                        .composite(waterMark, x, y, {
                            mode: Jimp.BLEND_SOURCE_OVER,
                            opacityDest: 1,
                            opacitySource: 1
                        })
                        .writeAsync(`${outputPath}/${imgPath}_${w}x${h}.png`)
            })
        );
    })
}


module.exports = start