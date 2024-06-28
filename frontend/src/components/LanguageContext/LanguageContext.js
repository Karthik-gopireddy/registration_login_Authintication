import React from "react";

const LanguageContext = React.createContext({
    language: 'en',
    changeLanguage: () => {}
})

export default LanguageContext