import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT =
  'Eres un asistente que transforma una descripción de tarea o una user story en un nombre corto y un plan accionable.\n' +
  'Responde SIEMPRE en este formato exacto, sin texto adicional:\n' +
  'Línea 1: Nombre corto de la tarea (máximo 80 caracteres, sin punto final)\n' +
  'Líneas 2-9: Entre 4 y 8 subtareas ordenadas lógicamente. Marca la primera con un asterisco al inicio: "* primera subtarea"\n' +
  'No añadas títulos, numeración, introducciones ni explicaciones. Solo el nombre y las subtareas.';

export type BreakdownResult = { title: string; subtasks: string[] };

@Injectable()
/**
 * Descompone una descripción de tarea en nombre corto y entre 4-8 subtareas ordenadas
 * usando el modelo Gemini 2.5 Flash Lite. Lanza ServiceUnavailableException si la cuota se agota.
 */
export class BreakdownTaskUseCase {
  private readonly genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
  }

  async execute(description: string): Promise<BreakdownResult> {
    let text: string;

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await model.generateContent(description);
      text = result.response.text();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('429') || msg.toLowerCase().includes('quota')) {
        throw new ServiceUnavailableException('quota_exceeded');
      }
      throw new ServiceUnavailableException(
        'AI breakdown service is unavailable. Check GEMINI_API_KEY.',
      );
    }

    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const title = lines[0] ?? description.slice(0, 80);
    const subtasks = lines
      .slice(1)
      .map((line) => line.replace(/^\*\s*/, '').trim())
      .filter((line) => line.length > 0);

    return { title, subtasks };
  }
}
