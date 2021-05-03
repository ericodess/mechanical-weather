const setChartConfig = (timeStampList, upperDatasetList, lowerDataseList) => {
    let chartConfig = {};

    if(timeStampList.length === upperDatasetList.length && timeStampList.length === lowerDataseList.length){
        chartConfig = {
            type: "line",
            data: {
                labels: timeStampList,
                datasets: [
                    {
                        label: 'Temperature',
                        data: upperDatasetList,
                        borderColor: "#17B978",
                        backgroundColor: "rgba(23, 185, 120, .4)",
                        hoverBackgroundColor: "rgba(23, 185, 120, 1)",
                        fill: true
                    },
                    {
                        label: 'Humidity',
                        data: lowerDataseList,
                        borderColor: "#071A52",
                        backgroundColor: "rgba(7, 26, 82, .4)",
                        hoverBackgroundColor: "rgba(7, 26, 82, 1)",
                        fill: true
                    }
                ]
            },
            options: {
                plugins: {
                    filler: {
                        propagate: false,
                    },
                    tooltip: {
                        mode: 'x'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            display: false
                        }  
                    }
                },
                elements: {
                    line: {
                        tension: 0.3
                    }
                },
                hover: {
                    mode: 'dataset'
                },
                responsive: true,
                maintainAspectRatio: false,
                radius: 5
            }
        };
    };

    return chartConfig;
};

export default setChartConfig;