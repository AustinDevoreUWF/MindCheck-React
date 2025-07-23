import { useState } from 'react'
import reactLogo from '/assets/react.svg'
import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import DropdownMenus from '../components/dropdown.jsx'
function App() {
  const [count, setCount] = useState(0)
const day=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const week=[1,2,3,4];
const category=['Mood', 'Energy Level', 'Hours Slept', 'Screen Time'];
  return (
    <div className ='page-wrapper'>
      <Header />
      <main className='main-content'>
      <p>Hello Guys</p>
            <DropdownMenus
             type='day'
             options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']} 
             />
             <DropdownMenus
             type='week'
             options={[1,2,3,4]}
             />
          </main>
      <Footer />
    </div>
  );
}

export default App
