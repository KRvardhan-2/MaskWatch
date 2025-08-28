'use server';
/**
 * @fileOverview A flow for detecting masks in an image.
 *
 * - detectMask - A function that handles the mask detection process.
 * - DetectMaskInput - The input type for the detectMask function.
 * - DetectMaskOutput - The return type for the detectMask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectMaskInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectMaskInput = z.infer<typeof DetectMaskInputSchema>;

const DetectMaskOutputSchema = z.object({
  detection: z.enum(['mask', 'no-mask', 'no-face', 'not-sure']).describe("The result of the mask detection. It can be 'mask', 'no-mask' if a face is detected but no mask, 'no-face' if no face is detected, or 'not-sure' if the model is not confident."),
  box: z.object({
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional().describe('The bounding box of the detected face, if any.'),
});
export type DetectMaskOutput = z.infer<typeof DetectMaskOutputSchema>;

export async function detectMask(input: DetectMaskInput): Promise<DetectMaskOutput> {
  return detectMaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMaskPrompt',
  input: {schema: DetectMaskInputSchema},
  output: {schema: DetectMaskOutputSchema},
  prompt: `You are a computer vision model specialized in detecting face masks on people.
Analyze the provided image and determine if a person is wearing a face mask.
- If a person is clearly wearing a mask, your response should be 'mask'.
- If a person is clearly not wearing a mask, your response should be 'no-mask'.
- If there is no human face in the image, your response should be 'no-face'.
- If you cannot be certain, your response should be 'not-sure'.

Also, provide the bounding box (x, y, width, height) of the detected face as normalized values (0 to 1). If no face is detected, do not provide a bounding box.

Image: {{media url=imageDataUri}}`,
});

const detectMaskFlow = ai.defineFlow(
  {
    name: 'detectMaskFlow',
    inputSchema: DetectMaskInputSchema,
    outputSchema: DetectMaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return { detection: 'not-sure' };
    }
    return output;
  }
);
