const convertCamelToPhrase = (camelString) => {
    return (camelString.charAt(0).toUpperCase() + camelString.slice(1)).split(/(?=[A-Z])/).join(" ");
};

export default convertCamelToPhrase;