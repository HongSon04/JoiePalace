"use client";

import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LineElement, ArcElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
ChartJS.register(BarElement, LineElement, ArcElement, CategoryScale, LinearScale, PointElement);

const Chart = ({ data, chartType }) => {
    const options = {
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 10,
                        family: 'Gilroy',
                    },
                    color: '#ffff',
                    padding: 5
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 10,
                        family: 'Gilroy'
                    },
                    color: '#ffff',
                    padding: 5,
                    callback: function(value) {
                        return value / 1000000 + 'M'; 
                    }
                },
                suggestedMax: 800000000,
                min: 0,
            },
        },
        elements: {
            point: {
                radius: 5,                                      
               backgroundColor: 'rgba(75, 192, 192, 0.6)',  
                borderColor: 'rgba(200, 200, 200, 1)',        
                borderWidth: 1,               
            }
        },
       barThickness: 15,
       backgroundColor: 'rgba(75, 192, 192, 0.6)',      
        borderColor: 'rgba(255, 255, 255, 0.6)',           
        borderWidth: 1,            
        
    };

    
    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return <Bar data={data} options={options} />;
            case 'line':
                return <Line data={data} options={options} />;
            case 'doughnut':
                return <Doughnut data={data} />;
            default:
                return null;
        }
    };

    return <>{renderChart()}</>;
};

export default Chart;
