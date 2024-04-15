# WS-Shuffle-Sim

This is a simulation that aims to test the affect of common "seeds", or starting configurations, 
of a Weiss Schwarz deck upon human randomization, defined as 7 riffle shuffles with an added 
degree of error. This error is represented in the value of split between both halves of a riffle 
shuffle, as well as the size of interlocking packets.

A reasonable error value of 4 when splitting the deck for repeated riffles is considered the baseline,
as is a 1-3 card interlocking packet size, both per-repetition.

7 repetitions utilizing this method is the minimum to produce a "sufficiently randomized deck". 
I'd link the Numberphile video for the 10 billionth time, but the people who refuse to watch or 
acknowledge it certainly won't do it now just because I've mentioned it again.

The simulation will measure the "distance" between climaxes in the final deck after performing 
sufficient randomization via the above outlined riffle shuffle method. For a 50 card deck, a distance 
value of ~6.25 would be considered to have more "well distributed" climaxes, while lower values would 
represent more variance in climax placement throughout the deck.

Common seeds are:
 1. All climaxes on the bottom, the classic "bottom stack" employed by many players
 2. A "piled" deck - climaxes at the 6th position for the first 6 stacks, then 7th for the last two
 3. No seed - a computer randomized deck order via the Fisher-Yates algorithm. A newly randomized 
    order will be used before each simulation. This will act as a generalized representation of 
    players shuffling up an unordered deck from their previous play session.

This will be achieved as simply and "stupidly" as possible, both for clarity and my sanity.

It's a pretty simple script, all things considered.

## How To Run

You need Node.js. Yeah, sure, it could of and should have been Python, but this is my day to day, so :P

```
npm install
node index.js
```

That's it. Plotly will pop in your default browser for visual interpretation. 
Other stats are printed to the command line.

