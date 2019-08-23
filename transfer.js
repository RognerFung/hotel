const { countryList, aliasList } = require('./constants');

//get all alias for given key, include key itself, uppercase first char, and other alias
const getAllAlias = key => {
    const otherAlias = aliasList[key] || [];
    return [key, key.charAt(0).toUpperCase() + key.slice(1), ...otherAlias];
}

//return the correct key from alias for a source object
const returnAliasKey = (source, key) => {
    if (!source || !key) return undefined;
    const alias = getAllAlias(key);
    return alias.find(e => source.hasOwnProperty(e));
}

//find the correct key for a source object and return it's value
const returnAliasKeyValue = (source, key) => {
    if (!source || !key) return undefined;
    const realKey = returnAliasKey(source, key);
    if (!realKey) return undefined;
    return source[realKey];
}

//for country, search source and source.location for country's all alias, if value is a two character country code, use countryList to transfer it to full country name
const transferCountry = source => {
    let country = returnAliasKeyValue(source, 'country') || returnAliasKeyValue(source.location, 'country');
    if (!country) return undefined;
    else if (country.length === 2) return countryList[country];
    else return country;
}

//for address, search source and source.location for address's all alias, also search for postalcode, if has postalcode, append to the end of address
const transferAddress = source => {
    const address = returnAliasKeyValue(source, 'address') || returnAliasKeyValue(source.location, 'address');
    if (!address) return undefined;
    const postalcode = returnAliasKeyValue(source, 'postalcode') ||  returnAliasKeyValue(source.location, 'postalcode');
    if (!postalcode) {
        return address;
    } else {
        return address.replace(`, ${postalcode}`, '').replace(`${postalcode}, `, '') + `, ${postalcode}`;
    }
}

//for amenities, if found then transfer all elements in the array to lowercase
const transferAmenities = source => {
    const gen = source.Facilities || (source.amenities ? source.amenities.general : undefined);
    const ro = (source.amenities && !source.amenities.length ? source.amenities.room: undefined) || source.amenities;
    return {
        general: gen ? gen.map(e => e.toLowerCase()) : undefined,
        room: ro ? ro.map(e => e.toLowerCase()) : undefined
    }
}

//for images's content, transfer url -> link and caption -> description
const transferImagesContent = source_images_content => {
    return source_images_content.map(e => {
        return {
            link: e.link || e.url,
            description: e.description || e.caption
        }
    });
}

//for images, structure remains the same just transfer the content
const transferImages = source => {
    if (!source.images) return undefined;
    let result = {};
    Object.keys(source.images).forEach(e => {
        result[e] = transferImagesContent(source.images[e]);
    });
    return result;
}

//trim content
const trimSource = source => {
    if (!source) {
        return source;
    } else if (typeof source === 'string') {
        source = source.trim();
    } else if (source.length > 0) {
        source = source.map(e => {
            return trimSource(e);
        });
    } else if (typeof source === 'object' && !source.length) {
        Object.keys(source).forEach(e => {
            source[e] = trimSource(source[e]);
        });
    }
    return source;
}

//transfer source object to target format
const transferSource = source => {
    source = trimSource(source);
    return {
        id: returnAliasKeyValue(source, 'id'),
        destination_id: returnAliasKeyValue(source, 'destination_id'),
        name: returnAliasKeyValue(source, 'name'),
        description: returnAliasKeyValue(source, 'description'),
        booking_conditions: returnAliasKeyValue(source, 'booking_conditions'),
        location: {
            lat: returnAliasKeyValue(source, 'lat') || returnAliasKeyValue(source.location, 'lat'),
            lng: returnAliasKeyValue(source, 'lng') || returnAliasKeyValue(source.location, 'lng'),
            city: returnAliasKeyValue(source, 'city') || returnAliasKeyValue(source.location, 'city'),
            address: transferAddress(source),
            country: transferCountry(source)
        },
        amenities: transferAmenities(source),
        images: transferImages(source)
    };
}

module.exports = transferSource;