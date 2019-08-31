export type OpponentGameType = {
    Item: {
        score: { N: number };
        gridId: { S: string };
        id: { S: string };
        name: { S: string };

        wordsFound: { L: { S: string }[] };
    };
};
