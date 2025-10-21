import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";

import { useSelector, useDispatch } from "react-redux";
import countries from "../../assets/static/flag.json";

const CountrySelect = ({ opValue, className, onChange, isValid, isInvalid }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const auth = useSelector((state) => state.Auth); 
  const dispatch = useDispatch()
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('layoutState');
    const savedStateParse = savedState ? JSON.parse(savedState) : null;
    setIsDarkMode(savedStateParse && savedStateParse.layoutColor === 'dark'); // Vérifier le mode sombre
  }, [selectedOption]);

  const countryOptions = countries.map((country) => ({
    value: country.code,
    label: country.name,
    image: `${process.env.REACT_APP_API_URL}/flags/${country.code}.svg`, // Chemin dynamique pour le drapeau
  }));

  // Trouver l'option par défaut au montage
  useEffect(() => {
    const defaultOption = countryOptions.find((option) => option.value === opValue);
    setSelectedOption(defaultOption);
  }, [opValue]);

  const customSingleValue = ({ data }) => (
    <div className="d-flex align-items-center">
      <img
        src={data.image}
        alt={data.label}
        style={{ width: 20, height: 15, marginRight: 10 }}
      />
      {data.label}
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="d-flex align-items-center p-2">
        <img
          src={data.image}
          alt={data.label}
          style={{ width: 20, height: 15, marginRight: 10 }}
        />
        {data.label}
      </div>
    );
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#36404A' : '#fff', // Fond du select en mode sombre
      color: isDarkMode ? '#fff' : '#333', // Texte en mode sombre
      borderColor: isValid ? "#F1556C" : base.borderColor,
      "&:hover": {
        borderColor: isValid ? "#F1556C" : base.borderColor,
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? (isDarkMode ? '#36404A' : '#f0f0f0') : (isDarkMode ? '#333' : '#fff'),
      color: isDarkMode ? '#fff' : '#333',
      "&:hover": {
        backgroundColor: isDarkMode ? '#36404A' : '#f7f7f7',
        color: isDarkMode ? '#fff' : '#333',
      },
    }),
    input: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#333', // Texte tapé en blanc en mode sombre
    }),
    placeholder: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#999', // Placeholder blanc en mode sombre
    }),
    singleValue: (base) => ({
      ...base,
      color: isDarkMode ? '#fff' : '#333', // Texte sélectionné en blanc en mode sombre
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? '#333' : '#fff', // Fond du menu déroulant
      borderColor: isDarkMode ? '#555' : '#ccc', // Bordure du menu
    }),
   
  };

  return (
    <>
      <Select
        value={selectedOption}
        onChange={(option) => {
          setSelectedOption(option);
          onChange(option.value);
        }}
        name="nationality"
        options={countryOptions}
        placeholder="Select a country"
        components={{ SingleValue: customSingleValue, Option: customOption }}
        isSearchable
        styles={customStyles}
        className={className}
      />
    </>
  );
};

export default CountrySelect;
