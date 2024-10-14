import { pipeline } from '@xenova/transformers';

const getEmbedding = async (data) => {
    const embedder = await pipeline(
        'feature-extraction', 
        'mixedbread-ai/mxbai-embed-large-v1');
    const response = await embedder(data, { pooling: 'mean', normalize: true });
    return Array.from(response.data);
}

export default getEmbedding;