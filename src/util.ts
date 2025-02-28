import {
    DEFAULT_BOARD,
    DEFAULT_BOARD_SIZE,
    DEFAULT_HAND_SIZE,
    DEFAULT_ITERATIONS,
    DEFAULT_NUMBER_OF_DECKS,
} from './constants';
import {
    Input,
    CardGroup,
    InternalInput,
    isInputAnExternalInputWithHands,
    isInputAnExternalInputWithNumberOfPlayers,
} from './types';

export function validateInput(input: Input): void {
    // numPlayers or hands
    if (!('numPlayers' in input) && !('hands' in input))
        throw new Error(`Either "numPlayers" or "hands" must be provided.`);

    // returnHandStats
    if ('returnHandStats' in input) {
        if (typeof input.returnHandStats !== 'boolean')
            throw new Error(
                `"returnHandStats" must be a boolean. Invalid: ${input.returnHandStats}`
            );
    }

    // returnTieHandStats
    if ('returnTieHandStats' in input) {
        if (typeof input.returnTieHandStats !== 'boolean')
            throw new Error(
                `"returnTieHandStats" must be a boolean. Invalid: ${input.returnTieHandStats}`
            );
    }

    // numPlayers
    if ('numPlayers' in input) {
        if (
            typeof input.numPlayers !== 'number' ||
            !Number.isSafeInteger(input.numPlayers) ||
            input.numPlayers < 1
        )
            throw new Error(
                `"numPlayers" must be an integer greater than 0. Invalid: ${input.numPlayers}`
            );

        if (
            isInputAnExternalInputWithHands(input) &&
            input.numPlayers < input.hands.length
        )
            throw new Error(
                `"numPlayers" must be equal to or greater than number of hands. Invalid: ${input.numPlayers} | ${input.hands}`
            );
    }

    // boardSize
    if ('boardSize' in input) {
        if (
            typeof input.boardSize !== 'number' ||
            !Number.isSafeInteger(input.boardSize) ||
            input.boardSize < 0
        )
            throw new Error(
                `"boardSize" must be a positive integer. Invalid: ${input.boardSize}`
            );
    }

    // numDecks
    if ('numDecks' in input) {
        if (
            typeof input.numDecks !== 'number' ||
            !Number.isSafeInteger(input.numDecks) ||
            input.numDecks < 1
        )
            throw new Error(
                `"numDecks" must be an integer greater than 0. Invalid: ${input.numDecks}`
            );
    }

    // board
    if ('board' in input) {
        if (typeof input.board !== 'string')
            throw new Error(
                `"board" must be a string. Invalid: ${input.board}`
            );

        const cardGroup = new CardGroup(input.board);
        if ('boardSize' in input) {
            if (
                cardGroup.cards.length > (input.boardSize ?? DEFAULT_BOARD_SIZE)
            )
                throw new Error(
                    `"board" cannot contain more than "boardSize" number of cards. Invalid: ${input.board} on boardSize ${input.boardSize}`
                );
        } else {
            if (cardGroup.cards.length > 5)
                throw new Error(
                    `"board" cannot contain more than 5 cards. Invalid: ${input.board}`
                );
        }
    }

    // iterations
    if ('iterations' in input) {
        if (
            typeof input.iterations !== 'number' ||
            !Number.isSafeInteger(input.iterations) ||
            input.iterations < 1
        )
            throw new Error(
                `"iterations" must be a string. Invalid: ${input.iterations}`
            );
    }

    // handSize
    if ('handSize' in input) {
        if (
            typeof input.handSize !== 'number' ||
            !Number.isSafeInteger(input.handSize) ||
            input.handSize < 0
        )
            throw new Error(
                `"handSize" must be a positive integer. Invalid: ${input.handSize}`
            );
    }

    // hands
    if ('hands' in input) {
        if (!Array.isArray(input.hands))
            throw new Error(
                `"hands" must be an array of strings like ["5c,Th"]. Invalid: ${input.hands}`
            );

        for (const hand of input.hands) {
            const cardGroup = new CardGroup(hand);
            if (!('handSize' in input)) {
                if (cardGroup.cards.length > 2)
                    throw new Error(
                        `Each hand must specify at most 2 cards. Invalid ${hand}`
                    );
            } else {
                if (
                    cardGroup.cards.length >
                    (input.handSize ?? DEFAULT_HAND_SIZE)
                )
                    throw new Error(
                        `Each hand must specify at most ${
                            input.handSize ?? DEFAULT_HAND_SIZE
                        } cards. Invalid ${hand}`
                    );
            }
        }
    }

    // hands + board must be unique
    const allCards = [];
    if (isInputAnExternalInputWithHands(input))
        input.hands.forEach((e) => allCards.push(...e.split(',')));

    if (input.board) allCards.push(...input.board.split(','));

    if (new Set(allCards).size !== allCards.length)
        throw new Error(`Input cards must be unique. Invalid: ${allCards}`);
}

export function cleanInput(input: Input): InternalInput {
    return {
        board: input.board ?? DEFAULT_BOARD,
        boardSize: input.boardSize ?? DEFAULT_BOARD_SIZE,
        handSize: input.handSize ?? DEFAULT_HAND_SIZE,
        hands: isInputAnExternalInputWithHands(input) ? input.hands : [],
        iterations: input.iterations ?? DEFAULT_ITERATIONS,
        numDecks: input.numDecks ?? DEFAULT_NUMBER_OF_DECKS,
        numPlayers: isInputAnExternalInputWithNumberOfPlayers(input)
            ? input.numPlayers
            : input.hands.length,
        returnHandStats: input.returnHandStats ?? false,
        returnTieHandStats: input.returnTieHandStats ?? false,
    };
}

export const uniqWith = <T extends unknown>(
    arr: T[],
    comparator: (a: T, b: T) => boolean
) => {
    const uniques = [];
    for (const a of arr) {
        if (uniques.findIndex((u) => comparator(a, u)) === -1) uniques.push(a);
    }
    return uniques;
};

export function shuffle(arr: any[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
