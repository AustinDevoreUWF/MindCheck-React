
import React from "react";
import {useState} from 'react';
export default function Slider(props){
    
    return(
        <div className='slider-wrapper'>
        <label className='slider-label'>{props.label}</label>
        <input type="range"
        min={0}
        max={10}
        step={1}
        value={props.value}
        onChange={e=> props.onChange(Number(e.target.value))}
        />
        <span className="slider-value">{props.value}</span>
        </div>
    )
}