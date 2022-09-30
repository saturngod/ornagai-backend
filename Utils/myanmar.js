const isMyanmar = (word) => {
    const regex = /[\u1000-\u109F]/g
    return word.match(regex)
}

module.exports = {
    isMyanmar
}