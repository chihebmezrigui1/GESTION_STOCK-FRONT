import React, { useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { Card, Progress, Spin } from 'antd';

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false)




  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data);
      setLoading(false)
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const generateChartData = (data) => {
    const years = ['2020', '2021', '2022', '2023', '2024'];
    const sentiments = ['POSITIVE', 'WEAK_NEGATIVE', 'NEUTRAL'];

    const chartData = [
      ['Year', 'Number of product','WEAK_NEGATIVE','NEUTRAL','POSITIVE' ],
    ];

    years.forEach((year) => {
      const yearData = data.filter((item) => item.Year === year);
      const sentimentCounts = sentiments.map((sentiment) =>
        yearData.filter((item) => item.sentiment === sentiment).length
      );
      chartData.push([year, yearData.length, ...sentimentCounts]);
    });

    return chartData;
  };
  

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Analyze</button>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin tip="Analyzing...">
            <Progress type="dashboard" percent={75} status="active" />
          </Spin>
        </div>
      )}

      {results.length > 0 && (
       <div>
         <div style={{ marginTop: '20px' }}>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={[
              ['Sentiment', 'Count', { role: 'style' }],
              ['Positive', countSentiment(results, 'POSITIVE'), '#4CAF50'],
              ['Neutral', countSentiment(results, 'NEUTRAL'), '#FFC107'],
              ['Weak Negative', countSentiment(results, 'WEAK_NEGATIVE'), '#F44336'],
            ]}
            options={{
              title: 'Sentiment Analysis',
              colors: ['#4CAF50', '#FFC107', '#F44336'],
              legend: { position: 'top' },
            }}
          />
        </div>
        <br/>
          <div style={{ marginTop: '20px' }}>
          <Chart
            chartType="Bar"
            width="100%"
            height="400px"
            data={generateChartData(results)}
            options={{
              chart: {
                title: 'Number of reviews per year and sentiment',
              },
              bars: 'vertical',
              legend: { position: 'top' },
            }}
          />
        </div>
       </div>
      )}
    </div>
  );
};

// Helper function to count occurrences of a sentiment in results
const countSentiment = (results, sentiment) => {
  return results.filter(review => review.sentiment === sentiment).length;
};

export default UploadCSV;