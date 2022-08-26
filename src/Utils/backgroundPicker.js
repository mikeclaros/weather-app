

export function backgroundPicker(temp) {
    if (temp < 78.0) {
        return 'background-cool'
    } else if (temp > 78.0 && temp < 88.0) {
        return 'background-sunny'
    } else if (temp >= 88.0) {
        return 'background-hot'
    }
}