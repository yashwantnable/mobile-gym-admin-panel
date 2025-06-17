/**
 * Converts any payload into FormData, handling nested structures.
 * @param {Object} data - The payload to convert.
 * @returns {FormData} - The constructed FormData object.
 */
export function toFormData(data, parentKey = "", formData = new FormData()) {
    if (data && typeof data === "object" && !(data instanceof File)) {
        // Handle arrays and objects
        Object.keys(data).forEach((key) => {
            const value = data[key];
            const newKey = parentKey ? `${parentKey}[${key}]` : key;

            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    toFormData(item, `${newKey}[${index}]`, formData);
                });
            } else if (value && typeof value === "object") {
                toFormData(value, newKey, formData);
            } else {
                formData.append(newKey, value);
            }
        });
    } else {
        formData.append(parentKey, data);
    }

    return formData;
}