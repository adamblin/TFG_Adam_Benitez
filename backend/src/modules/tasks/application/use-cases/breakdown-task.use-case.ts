import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import OpenAI from 'openai';

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
 * usando OpenAI. Lanza ServiceUnavailableException si la cuota se agota.
 */
export class BreakdownTaskUseCase {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY ?? '',
    });
  }

  async execute(description: string): Promise<BreakdownResult> {
    let text: string;

    try {
      const response = await this.openai.responses.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-5.4-mini',
        instructions: SYSTEM_PROMPT,
        input: description,
        max_output_tokens: 300,
      });
      text = response.output_text;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? (err as { status?: unknown }).status
          : undefined;
      if (
        status === 429 ||
        msg.includes('429') ||
        msg.toLowerCase().includes('quota') ||
        msg.toLowerCase().includes('rate limit')
      ) {
        throw new ServiceUnavailableException('quota_exceeded');
      }
      throw new ServiceUnavailableException(
        'AI breakdown service is unavailable. Check OPENAI_API_KEY.',
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
