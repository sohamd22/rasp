import * as toxicity from '@tensorflow-models/toxicity';

// The minimum prediction confidence.
const threshold = 0.7;

const isToxic = async (textToCheck) => {
    const model = await toxicity.load(threshold);

    const predictions = await model.classify([textToCheck]);
    if (predictions.some(prediction => prediction.results[0].match)) {
        return true;
    }

    return false;
}

export default isToxic;