import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import enFlag from "./flags/US.svg";
import frFlag from "./flags/FR.svg";
import dzFlag from "./flags/DZ.svg";

// Define the structure for language items
interface Language {
  name: string;
  flag: string;
  lang: string;
}

// Define the available languages
const Languages: Language[] = [
  {
    name: "English",
    flag: enFlag,
    lang: "en",
  },
  {
    name: "French",
    flag: frFlag,
    lang: "fr",
  },

];

const LanguageDropdown: React.FC = () => {
  const { t,i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<Language>(Languages[0]);

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem("language") || "en";
    const lang = Languages.find((l) => l.lang === savedLang) || Languages[0];
    setSelectedLang(lang);
    i18n.changeLanguage(lang.lang); // Set the language on load
  }, [i18n]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Change the selected language
  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang.lang);
    document.documentElement.setAttribute("dir", lang.lang === "ar" ? "rtl" : "ltr");
    setSelectedLang(lang);
    localStorage.setItem("language", lang.lang); // Save the language
    setDropdownOpen(false);
  };

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        id="dropdown-languages"
        as="a"
        onClick={toggleDropdown}
        className={classNames("nav-link waves-effect waves-light", {
          show: dropdownOpen,
        })}
      >
        <img src={selectedLang.flag} alt={selectedLang.name} height="16" />
        <span className="ms-2">{t(selectedLang.name)}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu dropdown-menu-end">
        {(Languages || []).map((lang, i) => (
          <Dropdown.Item
            key={i}
            className="dropdown-item notify-item"
            onClick={() => handleLanguageChange(lang)}
          >
            <img src={lang.flag} alt={lang.name} className="me-1" height="12" />
            <span className="align-middle">{t(lang.name)}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageDropdown;
