export const formatName = (name) => {
    return name
        .split(' ')
        .map(word => {
            if (word === word.toUpperCase()) { return word; }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize the first letter and lowercase the rest
        })  
        .join(' ');              
};