import React from 'react';
import DarkBrandTitle from "../BrandTitles/DarkBrandTitle";
import logo_image from '../../assets/logo.png';
import "./BrandLogoTitle.css";

export default function BrandLogoTitleLight() {
  return (
    <div className='brand-setup'>
      <img src={logo_image} alt="logo" />
      <DarkBrandTitle/>
    </div>
  )
}
