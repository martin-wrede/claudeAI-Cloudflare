import Anthropic from '@anthropic-ai/sdk';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request, env, ctx) {
        // Initialize the Anthropic client with the API key from environment variables
        const anthropic = new Anthropic({
            apiKey: env.ANTHROPIC_API_KEY,
        });

        // Handle CORS preflight request
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            const messages = await request.json();
            const response = await anthropic.completions.create({
                model: 'claude-3-5-sonnet-20240620',
                max_tokens_to_sample: 300,
                prompt: `You are a text summarizer. When asked to summarize a text, send back the summary of it. Please only send back the summary without prefixing it with things like "Summary" or telling where the text is from. Also give me the summary as if the original author wrote it and without using a third-person voice.`,
                messages: messages,
            });

            // Send the response back to the client
            return new Response(JSON.stringify(response), { headers: corsHeaders });
        } catch (error) {
            return new Response(JSON.stringify({ error: error.toString() }), { status: 500, headers: corsHeaders });
        }
    },
};
