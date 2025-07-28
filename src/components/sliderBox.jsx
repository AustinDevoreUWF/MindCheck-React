import { useState } from "react";
import Slider from "./sliderDefault";

export default function SliderBox() {
  const [sliders, setSliders] = useState([
    { id: 1, label: "Mood", value: 5 },
    { id: 2, label: "Energy Level", value: 5 },
    { id: 3, label: "Hours Slept", value: 5 },
    { id: 4, label: "Calories Eaten", value: 5 },
    { id: 5, label: "Screen Time", value: 5 },
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [nextId, setNextId] = useState(6);

  const updateValue = (id, newValue) => {
    setSliders(sliders.map(s => s.id === id ? { ...s, value: newValue } : s));
  };

  const addSlider = () => {
    if (newLabel.trim() === '') return;

    setSliders([
      ...sliders,
      { id: nextId, label: newLabel.trim(), value: 5 }
    ]);
    setNextId(nextId + 1);
    setNewLabel('');
  };

  return (
    <>
      {sliders.map(slider => (
        <div key={slider.id}>
          <label>{slider.label}: {slider.value}</label>
          <Slider
            value={slider.value}
            onChange={val => updateValue(slider.id, val)}
          />
        </div>
      ))}

      {/* Input and button to add a new slider */}
      
      <input
        type="text"
        value={newLabel}
        onChange={e => setNewLabel(e.target.value)}
        placeholder="New slider label"
      />
      <button onClick={addSlider}>Add Slider</button>
    </>
  );
}
