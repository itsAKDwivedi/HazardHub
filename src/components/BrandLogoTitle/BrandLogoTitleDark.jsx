import React from 'react';
import logo_image from "../../assets/logo.png";
import LightBrandTitle from "../BrandTitles/LightBrandTitle";
import "./BrandLogoTitle.css";

export default function BrandLogoTitleDark() {
  return (
    <div className='brand-setup'>
      <img src={logo_image} alt="logo" />
      <LightBrandTitle/>
    </div>
  )
}
