import downloadjs from 'downloadjs'
import html2canvas from 'html2canvas'
import * as d3 from 'd3'
import { NebulaFighterTheme } from '../../theme/schemes/NebulaFighterTheme'

const PlotDownloadService = {
    downloadAsPNGRed: async () => {
        const cornerPlotElmt = document.querySelector<HTMLElement>('.corner-plot')
        if (!cornerPlotElmt) return
        changeColours('white', 'black')

        const canvas = await html2canvas(cornerPlotElmt)
        const dataURL = canvas.toDataURL('image/png')
        downloadjs(dataURL, 'corner-plot.png', 'image/png')

        changeColours(NebulaFighterTheme.palette.background.default, 'white')
    },
    downloadAsPNG: async () => {
        const cornerPlotElmt = document.querySelector<HTMLElement>('.corner-plot')
        if (!cornerPlotElmt) return
        changeColours('white', 'black')
        const copiedCornerPlotElmt = cornerPlotElmt.cloneNode(
            true
          ) as HTMLElement;
          copiedCornerPlotElmt.style.position = 'fixed';
          copiedCornerPlotElmt.style.right = '100%';
          copiedCornerPlotElmt.style.height = 'auto';
      
          document.body.append(copiedCornerPlotElmt);

        const canvas = await html2canvas(copiedCornerPlotElmt)
        copiedCornerPlotElmt.remove();

        const dataURL = canvas.toDataURL('image/png')
        downloadjs(dataURL, 'corner-plot.png', 'image/png')

        changeColours(NebulaFighterTheme.palette.background.default, 'white')
    },
    downloadAsSVG: () => {
        const cornerPlotElmt = document.querySelector<HTMLElement>('.corner-plot')
        changeColours('white', 'black')
        var serializer = new XMLSerializer()
        var source = serializer.serializeToString(cornerPlotElmt)

        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"')
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source

        //convert svg source to URI data scheme.
        var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)

        var downloadLink = document.createElement('a')
        downloadLink.href = url
        downloadLink.download = 'corner-plot.svg'
        downloadLink.click()
        changeColours(NebulaFighterTheme.palette.background.default, 'white')
    }
}

const changeColours = (backgroundColour, labelsColour) => {
    const cornerPlotElmt = document.querySelector<HTMLElement>('.corner-plot')
    cornerPlotElmt.style.backgroundColor = backgroundColour

    let svg = d3.select('#corner-plot-id')
    svg.selectAll('foreignObject').style('color', labelsColour)

    d3.selectAll('.axis-lines').style('stroke', labelsColour)
    d3.selectAll('.axis-labels').style('fill', labelsColour)
}

export default PlotDownloadService
