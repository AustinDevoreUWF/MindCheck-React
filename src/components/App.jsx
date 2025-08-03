import { useState } from 'react'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebase';
import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import Chart1 from '../components/chart1.jsx'
import SliderBox from './sliderBox.jsx'

export default function App() {
const [uid, setUid] = useState(null);
  const [chartData, setChartData] = useState([]); 
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>; // Or a spinner
  }

      return (
    <div className ='page-wrapper'>
      <Header />
      <main className='content-wrapper'>
        <div className='selector-wrapper'>
        <SliderBox setChartData={setChartData} uid={uid} />
             </div>
             
             <div className="graph-wrapper">
              <Chart1 chartData={chartData} uid={uid} />
             </div>
          </main>
      <Footer />
    </div>
  );
}

