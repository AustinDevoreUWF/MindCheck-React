import { useState, useEffect } from "react";
import { collection, doc, setDoc, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import Slider from "./sliderDefault";

//AI use: Formatting/CustomSliders only on monday/Reset code.

export default function SliderBox() {
  const [sliders, setSliders] = useState([
    { id: 1, label: "Mood", value: 5 },
    { id: 2, label: "Hours Slept", value: 5 },
    { id: 3, label: "Screen Time", value: 5 },
  ]);
  const [newLabel, setNewLabel] = useState("");
  const [nextId, setNextId] = useState(4);
  const [currentDay, setCurrentDay] = useState("Monday");
  const [submissionIndex, setSubmissionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const initializeData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Initializing data for user:', user.uid);

        // Get current submission index from Firestore
        const progressQuery = query(collection(db, 'userProgress'), where('uid', '==', user.uid));
        const progressSnapshot = await getDocs(progressQuery);
        
        let savedIndex = 0;
        if (!progressSnapshot.empty) {
          savedIndex = progressSnapshot.docs[0].data().submissionIndex || 0;
        }
        
        console.log('Current submission index:', savedIndex);
        
        setSubmissionIndex(savedIndex);
        setCurrentDay(savedIndex < daysOfWeek.length ? daysOfWeek[savedIndex] : "Week Complete");

        // Load custom sliders only if we haven't started or it's Monday
        if (savedIndex === 0) {
          const customSlidersQuery = query(collection(db, 'customSliders'), where('uid', '==', user.uid));
          const customSnapshot = await getDocs(customSlidersQuery);
          
          if (!customSnapshot.empty) {
            const savedSliders = customSnapshot.docs.map(doc => {
              const data = doc.data();
              return { id: Math.random(), label: data.label, value: 5 };
            });
            
            console.log('Loaded custom sliders:', savedSliders);
            
            // Combine default sliders with custom ones
            const defaultSliders = [
              { id: 1, label: "Mood", value: 5 },
              { id: 2, label: "Hours Slept", value: 5 },
              { id: 3, label: "Screen Time", value: 5 },
            ];
            
            setSliders([...defaultSliders, ...savedSliders]);
            setNextId(4 + savedSliders.length);
          }
        } else {
          // If not Monday, still load custom sliders but don't allow adding new ones
          //Ai was used to accomplish this
          const customSlidersQuery = query(collection(db, 'customSliders'), where('uid', '==', user.uid));
          const customSnapshot = await getDocs(customSlidersQuery);
          
          if (!customSnapshot.empty) {
            const savedSliders = customSnapshot.docs.map(doc => {
              const data = doc.data();
              return { id: Math.random(), label: data.label, value: 5 };
            });
            
            const defaultSliders = [
              { id: 1, label: "Mood", value: 5 },
              { id: 2, label: "Hours Slept", value: 5 },
              { id: 3, label: "Screen Time", value: 5 },
            ];
            
            setSliders([...defaultSliders, ...savedSliders]);
            setNextId(4 + savedSliders.length);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        initializeData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateValue = (id, newValue) => {
    setSliders(prev =>
      prev.map(slider =>
        slider.id === id ? { ...slider, value: newValue } : slider
      )
    );
  };

  const addSlider = async () => {
    if (newLabel.trim() === '' || sliders.length >= 6 || submissionIndex !== 0) return;
    
    const user = auth.currentUser;
    if (!user) return;

    const newSlider = { id: nextId, label: newLabel.trim(), value: 5 };
    
    setSliders([...sliders, newSlider]);
    setNextId(nextId + 1);
    setNewLabel('');

    // Save custom slider to Firestore
    try {
      await addDoc(collection(db, 'customSliders'), {
        uid: user.uid,
        label: newSlider.label,
        value: newSlider.value
      });
      console.log('Custom slider saved:', newSlider.label);
    } catch (error) {
      console.error("Error saving custom slider:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    if (submissionIndex >= daysOfWeek.length) {
      alert("You've submitted data for all 7 days. Please reset to start a new week.");
      return;
    }

    const dayToSubmit = daysOfWeek[submissionIndex];
    
    const submitData = sliders.reduce((acc, slider) => {
      acc[slider.label] = slider.value;
      return acc;
    }, {});

    console.log('Submitting data for', dayToSubmit, ':', submitData);

    try {
      // Save the day's data
      await setDoc(doc(db, "sliderData", `${user.uid}_${dayToSubmit}`), {
        uid: user.uid,
        day: dayToSubmit,
        data: submitData,
        timestamp: new Date(),
      });

      // Update user progress
      await setDoc(doc(db, "userProgress", user.uid), {
        uid: user.uid,
        submissionIndex: submissionIndex + 1,
        lastUpdated: new Date()
      });

      console.log('Data submitted successfully for', dayToSubmit);
      alert(`Data submitted for ${dayToSubmit}!`);
      
      // Update local state
      const newIndex = submissionIndex + 1;
      setSubmissionIndex(newIndex);
      setCurrentDay(newIndex < daysOfWeek.length ? daysOfWeek[newIndex] : "Week Complete");
      
      // Reset slider values for next day
      setSliders(prev => prev.map(slider => ({ ...slider, value: 5 })));
      
      // Trigger chart refresh
      window.dispatchEvent(new CustomEvent('chartDataUpdated'));
      
    } catch (error) {
      console.error("Error writing document: ", error);
      alert("Error submitting data. Please try again.");
    }
  };

  const resetWeek = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Reset user progress
      await setDoc(doc(db, "userProgress", user.uid), {
        uid: user.uid,
        submissionIndex: 0,
        lastUpdated: new Date()
      });

      // Delete all custom sliders
      const customSlidersQuery = query(collection(db, 'customSliders'), where('uid', '==', user.uid));
      const customSnapshot = await getDocs(customSlidersQuery);
      
      const deletePromises = customSnapshot.docs.map(docSnapshot => {
        return deleteDoc(docSnapshot.ref);
      });
      await Promise.all(deletePromises);

      // Delete all slider data for the week
      const sliderDataQuery = query(collection(db, 'sliderData'), where('uid', '==', user.uid));
      const sliderSnapshot = await getDocs(sliderDataQuery);
      
      const deleteDataPromises = sliderSnapshot.docs.map(docSnapshot => {
        return deleteDoc(docSnapshot.ref);
      });
      await Promise.all(deleteDataPromises);

      // Reset local state to default sliders only
      setSubmissionIndex(0);
      setCurrentDay("Monday");
      setSliders([
        { id: 1, label: "Mood", value: 5 },
        { id: 2, label: "Hours Slept", value: 5 },
        { id: 3, label: "Screen Time", value: 5 },
      ]);
      setNextId(4);
      setNewLabel('');
      
      // Trigger chart refresh
      window.dispatchEvent(new CustomEvent('chartDataUpdated'));
      
      console.log('Week and custom sliders reset successfully');
      alert("Week reset! All custom sliders and data cleared. You can now start fresh for Monday.");
    } catch (error) {
      console.error("Error resetting week:", error);
      alert("Error resetting week. Please try again.");
    }
  };

  if (loading) {
    return <div style={{color:'white'}}>Loading sliders...</div>;
  }

  if (submissionIndex >= daysOfWeek.length) {
    return (
      <div className="sliderBox">
        <h3 style={{color:'pink', fontSize:'24px', textShadow: '1px 3px 4px #000000'}}>Week Complete!</h3>
        <p style={{color:'pink', textShadow: '1px 3px 4px #000000'}}>You've logged data for all 7 days. Reset to start a new week.</p>
        <button onClick={resetWeek}>Reset Week</button>
      </div>
    );
  }

  return (
    <div className="sliderBox">
      <div className="slider-sizer">
      <h3 style={{color:'white'}}> Current Day: {currentDay}</h3>
      <p style={{color:'white', textAlign:'justify'}}>Day {submissionIndex + 1} of 7</p>
      
      {sliders.map(slider => (
        <div key={slider.id} style={{ marginBottom: '25px' }}>
          <label>{slider.label}: {slider.value}</label>
          <Slider
            value={slider.value}
            onChange={val => updateValue(slider.id, val)}
          />
        </div>
      ))}

      {submissionIndex === 0 && sliders.length < 6 && (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New slider label"
            style={{ marginRight: '10px' }}
          />
          <button onClick={addSlider}>
            Add Slider ({sliders.length}/6)
          </button>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Custom sliders can only be added on Monday
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmit} style={{ marginRight: '10px' }}>
          Submit {currentDay}
        </button>
        <button onClick={resetWeek}>Reset Week</button>
      </div>
      </div>
    </div>
  );
}