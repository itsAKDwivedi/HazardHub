import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BrandTitles.css';

export default function LightBrandTitle() {
    const navigate = useNavigate();
    return (
        <div className="title-container">
            <h1 className='light-brand-name' onClick={()=>navigate('/active-projects')}>HazardHub</h1>
            <p className='light-tag-line'>Protecting What Matters</p>
        </div>
    )
}
