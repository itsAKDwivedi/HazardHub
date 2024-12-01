import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BrandTitles.css';

export default function DarkBrandTitle() {
    const navigate = useNavigate();

    return (
        <div className="title-container">
            <h1 className='dark-brand-name' onClick={()=>navigate('/')}>HazardHub</h1>
            <p className='dark-tag-line'>Protecting What Matters</p>
        </div>
    )
}
