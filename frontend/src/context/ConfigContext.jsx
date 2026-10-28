import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [brandConfig, setBrandConfig] = useState({
    brandName: 'M.S Fashion',
    tagline: 'The Art of Bespoke Ethnic Menswear',
    whatsappPhone: '918999386222',
    displayPhone: '+91 89993 86222',
    email: 'bespoke@msfashion.com',
    boutiqueAddress: 'Ground Floor, 10/A, Sanaullah Compound, Near Sauda Bakery, Dharavi Main Road, Mahim (East), Mumbai - 400017, Maharashtra',
    visitingHours: 'Mon - Sat: 1:00 PM - 7:00 PM',
    googleMapsUrl: 'https://maps.app.goo.gl/bK6BAQTHtguhqWo19'
  });

  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  const refreshBrandConfig = () => {
    api.getBrandConfig().then(config => {
      if (config) setBrandConfig(config);
    }).catch(() => {});
  };

  useEffect(() => {
    refreshBrandConfig();
  }, []);

  const formatINR = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getWhatsAppLink = (message) => {
    const phone = brandConfig.whatsappPhone || '919876543210';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  };

  return (
    <ConfigContext.Provider
      value={{
        brandConfig,
        formatINR,
        getWhatsAppLink,
        appointmentModalOpen,
        setAppointmentModalOpen,
        refreshBrandConfig
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
