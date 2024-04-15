/**
 * This is a simulation that aims to test the affect of common "seeds", or starting configurations, 
 * of a Weiss Schwarz deck upon human randomization, defined as 7 riffle shuffles with an added 
 * degree of error. This error is represented in the value of split between both halves of a riffle 
 * shuffle, as well as the size of interlocking packets.
 * 
 * A reasonable error value of 4 when splitting the deck for repeated riffles is considered the baseline,
 * as is a 1-3 card interlocking packet size, both per-repetition.
 * 
 * 7 repetitions utilizing this method is the minimum to produce a "sufficiently randomized deck". 
 * I'd link the Numberphile video for the 10 billionth time, but the people who refuse to watch or 
 * acknowledge it certainly won't do it now just because I've mentioned it again.
 * 
 * The simulation will measure the "distance" between climaxes in the final deck after performing 
 * sufficient randomization via the above outlined riffle shuffle method. For a 50 card deck, a distance 
 * value of ~6.25 would be considered to have more "well distributed" climaxes, while lower values would 
 * represent more variance in climax placement throughout the deck.
 * 
 * Common seeds are:
 *  1. All climaxes on the bottom, the classic "bottom stack" employed by many players
 *  2. A "piled" deck - climaxes at the 6th position for the first 6 stacks, then 7th for the last two
 *  3. No seed - a computer randomized deck order via the Fisher-Yates algorithm. A newly randomized 
 *     order will be used before each simulation. This will act as a generalized representation of 
 *     players shuffling up an unordered deck from their previous play session.
 * 
 * This will be achieved as simply and "stupidly" as possible, both for clarity and my sanity. 
 */

const {
    mean,
    median,
    mode,
    range,
    variance,
    standardDeviation,
    iqr,
  } = require('@basementuniverse/stats');

const { plot } = require('nodeplotlib');

const SIM_COUNT = 300000;
const REPETITIONS = 7;
const SPLIT_ERROR = 4;
const PACKET_ERROR = 4;
const bottomStacked =   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];
const piled =           [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1];
const unordered =       [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

function riffleShuffle(deckInput, repetitions, splitError, packetError) {
    let deck = [...deckInput];
    for (let i = 0; i < repetitions; i++) {
        const cutDeckVariant = deck.length / 2 + Math.floor(Math.random() * 9) - splitError;
        const leftHalf = deck.splice(0, cutDeckVariant);
        let leftCount = leftHalf.length;
        let rightCount = deck.length - Math.floor(Math.random() * splitError);
        while(leftCount > 0) {
            const takeAmount = Math.floor(Math.random() * packetError);
            deck.splice(rightCount, 0, ...leftHalf.splice(leftCount, takeAmount));
            leftCount -= takeAmount;
            rightCount = rightCount - Math.floor(Math.random() * packetError) + takeAmount;
        }
        deck.splice(rightCount, 0, ...leftHalf);
    }
    return deck;
}

function fisherYatesShuffle(array) {
    // Start from the end of the array and swap elements with random elements before it
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        // Swap array[i] with array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function calculateAverageDistance(array) {
    let distanceSum = 0;
    let count = 0;
    let lastOneIndex = -1;

    for (let i = 0; i < array.length; i++) {
        if (array[i] === 1) {
            if (lastOneIndex !== -1) {
                distanceSum += i - lastOneIndex - 1;
                count++;
            }
            lastOneIndex = i;
        }
    }

    return count > 0 ? distanceSum / count : 0;
}

// Simulate unordered

let unorderedShuffledArrays = [];
for (let i = 0; i < SIM_COUNT; i++) {
    let randomizedUnordered = fisherYatesShuffle(unordered);
    unorderedShuffledArrays.push(riffleShuffle(randomizedUnordered, REPETITIONS, SPLIT_ERROR, PACKET_ERROR));
}
const unorderedShuffledAverages = unorderedShuffledArrays.map(array => calculateAverageDistance(array));

console.log("======UNORDERED SHUFFLE======")
console.log("MEAN: ", mean(unorderedShuffledAverages));
console.log("MEDIAN: ", median(unorderedShuffledAverages));
console.log("MODE: ", mode(unorderedShuffledAverages));
console.log("RANGE: ", range(unorderedShuffledAverages));
console.log("VARIANCE: ", variance(unorderedShuffledAverages));
console.log("STD_DEV: ", standardDeviation(unorderedShuffledAverages));
console.log("IQR: ", iqr(unorderedShuffledAverages));
console.log('\n');

// Simulate bottom-stacked

let bottomStackedShuffledArrays = [];
for (let i = 0; i < SIM_COUNT; i++) {
    bottomStackedShuffledArrays.push(riffleShuffle(bottomStacked, REPETITIONS, SPLIT_ERROR, PACKET_ERROR)); 
}
const bottomStackedShuffledAverages = bottomStackedShuffledArrays.map(array => calculateAverageDistance(array));

console.log("======BOTTOM STACKED SHUFFLE======")
console.log("MEAN: ", mean(bottomStackedShuffledAverages));
console.log("MEDIAN: ", median(bottomStackedShuffledAverages));
console.log("MODE: ", mode(bottomStackedShuffledAverages));
console.log("RANGE: ", range(bottomStackedShuffledAverages));
console.log("VARIANCE: ", variance(bottomStackedShuffledAverages));
console.log("STD_DEV: ", standardDeviation(bottomStackedShuffledAverages));
console.log("IQR: ", iqr(bottomStackedShuffledAverages));
console.log('\n');

// Simulate piled

let piledShuffledArrays = [];
for (let i = 0; i < SIM_COUNT; i++) {
    piledShuffledArrays.push(riffleShuffle(piled, REPETITIONS, SPLIT_ERROR, PACKET_ERROR));
}
const piledShuffledAverages = piledShuffledArrays.map(array => calculateAverageDistance(array));

console.log("======PILED SHUFFLE======")
console.log("MEAN: ", mean(piledShuffledAverages));
console.log("MEDIAN: ", median(piledShuffledAverages));
console.log("MODE: ", mode(piledShuffledAverages));
console.log("RANGE: ", range(piledShuffledAverages));
console.log("VARIANCE: ", variance(piledShuffledAverages));
console.log("STD_DEV: ", standardDeviation(piledShuffledAverages));
console.log("IQR: ", iqr(piledShuffledAverages));
console.log('\n');

let layout = { 
    title: 'Average CX Distance',
    font: {size: 18},
    width: 2000,
    height: 1200
  };
  
let config = {responsive: true}

plot([
    {x: unorderedShuffledAverages, name: "unordered", type: 'histogram' }, 
    {x: bottomStackedShuffledAverages, name: "stacked", type: 'histogram' },
    {x: piledShuffledAverages, name: "piled",  type: 'histogram' }
], layout, config);