import { MathJaxContext } from 'better-react-mathjax'
import { useCallback, useEffect, useState } from 'react'
import CheckboxDropdown from '../pages/FileUpload/CheckboxDropdown'
import CornerPlot from './CornerPlot'
import downloadjs from 'downloadjs'
import html2canvas from 'html2canvas'
import { Button } from '@mui/material'
import AppearanceConfig from './Appearance/AppearanceConfiguration'
import { PlotConfig, DatasetConfig, ParameterConfig } from './PlotTypes'
import * as d3 from 'd3'

const PlotConfigDefault: PlotConfig = {
    plot_size: 500,
    subplot_size: 150,
    margin: {
        horizontal: 10,
        vertical: 10
    },
    axis: {
        size: 100,
        tickSize: 10,
        ticks: 4
    },
    background_color: '#CFE5FF'
}

const DatasetConfigDefault: DatasetConfig = {
    data: {},
    bins: 30,
    sigmas: [1, 2, 3],
    quantiles: [0.5],
    color: '#0088FF',
    line_width: 1.25,
    blur_radius: 0.1
}

const ParameterConfigDefault: ParameterConfig = {
    name: 'undefined',
    display_text: 'undefined',
    domain: [0, 0]
}

function PlotsPage({ file }) {
    /* 

    This is the skeleton component for our plots page. It hosts all relevant components for the user to create plots
    including the parameter selectors and the corner plot itself. 

    */
    const [datasets, setDatasets] = useState<DatasetConfig[]>([
        {
            ...DatasetConfigDefault,
            data: file['posterior']['content']
        }
    ])
    const [parameters, setParameters] = useState<ParameterConfig[]>([])
    const [config, setConfig] = useState<PlotConfig>(PlotConfigDefault)
    const defaultParameters = file.selected_keys

    // Config for MathJax rendering of mathematical symbols
    const MathJaxConfig = {
        tex: {
            inlineMath: [
                ['$', '$'],
                ['\\(', '\\)']
            ]
        },
        startup: {
            typeset: false
        }
    }

    // Function for corner plot image download.
    const downloadCornerPlotImage = async () => {
        const cornerPlotElmt = document.querySelector<HTMLElement>('.corner-plot')
        if (!cornerPlotElmt) return

        const canvas = await html2canvas(cornerPlotElmt)
        const dataURL = canvas.toDataURL('image/png')
        downloadjs(dataURL, 'corner-plot.png', 'image/png')
    }

    const colors = [
        '#0088FF',
        '#BF40BF',
        '#800000',
        '#FF8800',
        '#FFCC00',
        '#FFFF00',
        '#0088FF',
        '#00CC00',
        '#FF0000',
        '#FF8800',
        '#FFCC00',
        '#FFFF00'
    ]
    const processFiles = e => {
        const reader = new FileReader()
        reader.onload = e => {
            const newDataset = JSON.parse(e.target.result as string)
            setDatasets(data => [
                ...data,
                {
                    ...DatasetConfigDefault,
                    data: newDataset['posterior']['content'],
                    color: colors[data.length]
                }
            ])
        }
        reader.readAsText(e.target.files[0])
    }

    // Called from CheckboxDropdown component to fill parameters with ParameterConfig values
    const updateParameters = (new_parameters: string[]) => {
        setConfig(config => ({
            ...config,
            subplot_size: config.plot_size / new_parameters.length
        }))
        setParameters(
            new_parameters.map(p => {
                const combined_data = [].concat(...datasets.map(d => d.data[p]))
                return { name: p, display_text: p, domain: d3.extent(combined_data) }
            })
        )
    }

    // Called to populate initial parameters
    useEffect(() => {
        updateParameters(defaultParameters)
    }, [])

    return (
        <div>
            <input type='file' onChange={processFiles}></input>
            <MathJaxContext config={MathJaxConfig}>
                <CheckboxDropdown
                    defaultChecked={defaultParameters}
                    keys={Object.keys(datasets[0].data)}
                    setSelectedKeys={updateParameters}
                    sx={{ margin: '2rem 0 2rem 0' }}
                />
                <div
                    className='corner-plot-appearance-config-container'
                    style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                    <CornerPlot datasets={datasets} parameters={parameters} config={config} />
                    <AppearanceConfig datasets={datasets} setDatasets={setDatasets} />
                </div>
                <Button variant='contained' onClick={downloadCornerPlotImage}>
                    Download Image
                </Button>
            </MathJaxContext>
        </div>
    )
}

export default PlotsPage
