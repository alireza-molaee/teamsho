export default function camel2Text(text) {
    let result = text.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
}