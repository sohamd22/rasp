import { pipeline } from '@xenova/transformers';

const embedder = await pipeline(
    'feature-extraction', 
    'mixedbread-ai/mxbai-embed-large-v1');

const getEmbedding = async (data) => {
    console.log("Hello from getEmbedding");    
    const response = await embedder(data, { pooling: 'mean', normalize: true });
    console.log("Done with embedding")
    return Array.from(response.data);
}

export default getEmbedding;