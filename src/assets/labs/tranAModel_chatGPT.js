const fs = require('fs');
const tf = require('@tensorflow/tfjs');

// Leer archivo con las jugadas FEN y sus correspondientes jugadas
const data = [];
const file = fs.readFileSync('chess_data.txt', 'utf-8');
const lines = file.split('\n');
for (let i = 0; i < lines.length; i++) {
    const [fen, move] = lines[i].split(' ');
    data.push({ fen, move });
}

// Convertir cada entrada en un formato utilizable para el modelo
const characters = new Set();
for (let i = 0; i < data.length; i++) {
    const { fen, move } = data[i];
    for (let j = 0; j < fen.length; j++) {
        characters.add(fen[j]);
    }
    for (let j = 0; j < move.length; j++) {
        characters.add(move[j]);
    }
}
const charToIndex = new Map();
const charactersArray = Array.from(characters).sort();
for (let i = 0; i < charactersArray.length; i++) {
    charToIndex.set(charactersArray[i], i);
}

function encodeInput(fen, move, maxLen = 50) {
    const fenEncoded = [];
    for (let i = 0; i < fen.length; i++) {
        fenEncoded.push(charToIndex.get(fen[i]));
    }
    const moveEncoded = [];
    for (let i = 0; i < move.length; i++) {
        moveEncoded.push(charToIndex.get(move[i]));
    }
    const inputEncoded = fenEncoded.concat(Array(maxLen - fenEncoded.length).fill(0)).concat(moveEncoded);
    return tf.tensor2d(inputEncoded, [1, maxLen * 2]);
}

const inputs = tf.concat(data.map(({ fen, move }) => encodeInput(fen, move)));
const labels = tf.tensor1d(data.map(({ move }) => charToIndex.get(move[0])));

// Crear un modelo de red neuronal
const model = tf.sequential();
model.add(tf.layers.embedding({
    inputDim: charactersArray.length,
    outputDim: 128
}));
model.add(tf.layers.lstm({ units: 128 }));
model.add(tf.layers.dense({ units: charactersArray.length, activation: 'softmax' }));

// Compilar el modelo con un optimizador y una función de pérdida
model.compile({
    optimizer: tf.train.rmsprop(0.01),
    loss: 'categoricalCrossentropy'
});

// Entrenar el modelo con los datos y etiquetas previamente procesados
async function trainModel() {
    const batchSize = 32;
    const epochs = 50;
    const validationSplit = 0.1;

    const [Xs, Ys] = tf.tidy(() => {
        const d = tf.data.array(data.map(({ fen, move }) => [fen, move]))
            .map(({ fen, move }) => ({ xs: encodeInput(fen, move), ys: charToIndex.get(move[0]) }))
            .shuffle(data.length)
            .batch(batchSize);
        return [
            d.map(({ xs }) => xs),
            d.map(({ ys }) => ys)
        ];
    });

    return await model.fitDataset(Xs, Ys, {
        batchSize,
        epochs,
        validationSplit
    });
}

// Entrenar y evaluar el modelo
(async () => {
    console.log('Iniciando entrenamiento...');
    const history = await trainModel();
    console.log('Entrenamiento finalizado.');
    console.log('Último resultado de validación:');
    console.log(history.history.val_loss[history.history.val_loss.length - 1]);
})();
