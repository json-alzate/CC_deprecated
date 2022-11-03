// Javascript program for Elo Rating

// Function to calculate the Probability
const probability = (rating1, rating2) => (
    (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400))
);


// Function to calculate Elo rating
// K is a constant.
// d determines whether Player A wins
// or Player B.
export const calculateElo = (ra: number, rb: number, d: boolean) => {

    const k = 30;

    // To calculate the Winning
    // Probability of Player B
    const pb = probability(ra, rb);

    // To calculate the Winning
    // Probability of Player A
    const pa = probability(rb, ra);

    // Case 1 When Player A wins
    // Updating the Elo Ratings
    if (d === true) {
        ra = ra + k * (1 - pa);
        rb = rb + k * (0 - pb);
    }

    // Case 2 When Player B wins
    // Updating the Elo Ratings
    else {
        ra = ra + k * (0 - pa);
        rb = rb + k * (1 - pb);
    }

    return { ra: Math.round(Math.round(ra * 1000000.0) / 1000000.0), rb: Math.round(Math.round(rb * 1000000.0) / 1000000.0) };

    // document.write("Updated Ratings:-<br>");
    // document.write(
    //     "Ra = " +
    //     Math.round(Ra * 1000000.0) / 1000000.0 +
    //     " Rb = " +
    //     Math.round(Rb * 1000000.0) / 1000000.0
    // );
};

// Ra and Rb are current ELO ratings
// const Ra = 1200;
// const Rb = 1000;

// const K = 30;
// const d = true;

// EloRating(Ra, Rb, K, d);
