import { pipeline } from '@xenova/transformers';

const getEmbedding = async (data) => {
  const embedder = await pipeline(
    'sentence-similarity', 'Alibaba-NLP/gte-large-en-v1.5');
  const response = await embedder(data, { pooling: 'mean', normalize: true });
  return Array.from(response.data);
}

export default getEmbedding;