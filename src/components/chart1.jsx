import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useState, useEffect } from 'react';

export default function Chart1() {
  const [sliderKeys, setSliderKeys] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //AI use: Formating, Refresh Logic, sizing and learning fireBase.

  // Easy to change dimensions here
  const CHART_WIDTH = 1200;  // Change this to control width
  const CHART_HEIGHT = 600;  // Change this to control height

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching data for user:', user.uid);
        
        const q = query(collection(db, 'sliderData'), where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        const rawData = snapshot.docs.map(doc => doc.data());
        
        console.log('Raw data from Firebase:', rawData);

        const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        // Get all possible slider keys first
        const allKeys = new Set();
        rawData.forEach(entry => {
          if (entry.data) {
            Object.keys(entry.data).forEach(key => {
              allKeys.add(key);
            });
          }
        });

        console.log('Found slider keys:', [...allKeys]);

        // Create chart data with all days, initialize with 0 values
        const chartDataMap = {};
        orderedDays.forEach(day => {
          chartDataMap[day] = { day };
          // Initialize all keys with 0
          allKeys.forEach(key => {
            chartDataMap[day][key] = 0;
          });
        });

        // Fill in the actual data
        rawData.forEach(entry => {
          if (chartDataMap[entry.day] && entry.data) {
            Object.keys(entry.data).forEach(key => {
              chartDataMap[entry.day][key] = entry.data[key] || 0;
            });
          }
        });

        const sortedData = orderedDays.map(day => chartDataMap[day]);
        
        console.log('Final chart data:', sortedData);
        console.log('Final slider keys:', [...allKeys]);
        
        setChartData(sortedData);
        setSliderKeys([...allKeys]);
        setLoading(false);
        
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Initial fetch if user is already authenticated
    if (auth.currentUser) {
      fetchData();
    }

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchData();
      } else {
        setLoading(false);
        setChartData([]);
        setSliderKeys([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Refresh data when SliderBox submits new data
  useEffect(() => {
    const refreshData = () => {
      if (auth.currentUser) {
        const fetchData = async () => {
          try {
            const q = query(collection(db, 'sliderData'), where('uid', '==', auth.currentUser.uid));
            const snapshot = await getDocs(q);
            const rawData = snapshot.docs.map(doc => doc.data());
            
            const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            
            const allKeys = new Set();
            rawData.forEach(entry => {
              if (entry.data) {
                Object.keys(entry.data).forEach(key => {
                  allKeys.add(key);
                });
              }
            });

            const chartDataMap = {};
            orderedDays.forEach(day => {
              chartDataMap[day] = { day };
              allKeys.forEach(key => {
                chartDataMap[day][key] = 0;
              });
            });

            rawData.forEach(entry => {
              if (chartDataMap[entry.day] && entry.data) {
                Object.keys(entry.data).forEach(key => {
                  chartDataMap[entry.day][key] = entry.data[key] || 0;
                });
              }
            });

            const sortedData = orderedDays.map(day => chartDataMap[day]);
            setChartData(sortedData);
            setSliderKeys([...allKeys]);
          } catch (err) {
            console.error('Error refreshing chart data:', err);
          }
        };
        fetchData();
      }
    };

    // Listen for storage events or you could use a custom event
    window.addEventListener('chartDataUpdated', refreshData);
    return () => window.removeEventListener('chartDataUpdated', refreshData);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        width: `${CHART_WIDTH}px`, 
        height: `${CHART_HEIGHT}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginTop: '50px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <div style={{color: 'white'}}>Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        width: `${CHART_WIDTH}px`, 
        height: `${CHART_HEIGHT}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginTop: '50px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <div style={{ color: 'red' }}>Error loading chart: {error}</div>
      </div>
    );
  }

  if (!chartData.length || sliderKeys.length === 0) {
    return (
      <div style={{ 
        width: `${CHART_WIDTH}px`, 
        height: `${CHART_HEIGHT}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginTop: '50px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <div style={{color: 'white'}}>No data available yet.</div>
        <div style={{color:'white'}}>Submit some slider data to see your chart!</div>
      </div>
    );
  }

  return (
    <div style={{
      width: `${CHART_WIDTH}px`,
      height: `${CHART_HEIGHT}px`,
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#3705ff',
      marginTop: '50px',        // Distance from top
      marginLeft: 'auto',       // Centers horizontally
      marginRight: 'auto'       // Centers horizontally
    }}>
      <div style={{ 
        marginBottom: '15px', 
        textAlign: 'center'
      }}>
        <h3 style={{color: 'pink', margin: '0 0 5px 0', textShadow: '1px 3px 4px #000000'}}>Weekly Progress Chart</h3>
        <div style={{ color: 'pink', fontSize: '14px',textShadow: '1px 3px 4px #000000'}}>
          Categories: {sliderKeys.join(', ')} | Data points: {chartData.filter(d => Object.keys(d).length > 1).length}/7 days
        </div>
      </div>
      
      <BarChart 
        width={CHART_WIDTH - 40}  // Subtract padding
        height={CHART_HEIGHT - 80} // Subtract padding and header
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
       <XAxis 
  dataKey="day"
  stroke="pink"
  tick={(props) => (
    <text 
      x={props.x} 
      y={props.y + 10} 
      textAnchor="middle" 
      fill="pink" 
      style={{ 
        textShadow: '1px 3px 2px #000000',
        fontSize: '16px',
      }}
    >
      {props.payload.value}
    </text>
  )}
/>
        <YAxis
  stroke="pink"
  tick={(props) => (
    <text 
      x={props.x - 10} 
      y={props.y + 4} 
      textAnchor="end" 
      fill="pink"
      style={{ 
        textShadow: '1px 3px 4px #000000',
        fontSize: '14px',
      }}
    >
      {props.payload.value}
    </text>
  )}
/>
        <Tooltip />
        <Legend />
        {sliderKeys.map((key, index) => (
          <Bar 
            key={key} 
            dataKey={key} 
            stackId="a" 
            fill={generateColor(index)}
            name={key}
          />
        ))}
      </BarChart>
    </div>
  );
}

function generateColor(index) {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];
  return colors[index % colors.length];//Gives the correct amount of colors
}