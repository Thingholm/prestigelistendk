export default function numerizeRanking(rankingList) {
    const sortedRanking = rankingList.sort(function (a, b) { return b.points - a.points });

    const rankedRanking = sortedRanking.map((obj, index) => {
        let rank = index + 1;

        if (index > 0 && obj.points == sortedRanking[index - 1].points) {
            rank = sortedRanking.findIndex(i => obj.points == i.points) + 1;
        }

        return ({ ...obj, currentRank: rank })
    });

    return (rankedRanking)
}