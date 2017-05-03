export default function (itemOrItems) {
    const array = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];
    return array.map(action => action.toString());
}