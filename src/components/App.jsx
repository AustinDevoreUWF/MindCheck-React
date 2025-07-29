import { useState } from 'react'
import reactLogo from '/assets/react.svg'
import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import DropdownMenus from '../components/dropdown.jsx'
import SliderBox from './sliderBox.jsx'
function App() {

      return (
    <div className ='page-wrapper'>
      <Header />
      <main className='content-wrapper'>
        <div className='selector-wrapper'>
        <SliderBox />
            <DropdownMenus
             type='day'
             options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']} 
             />
             <DropdownMenus
             type='week'
             options={[1,2,3,4]}
             />
             </div>
          </main>
      <Footer />
    </div>
  );
}

export default App
