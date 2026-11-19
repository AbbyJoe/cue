import mammoth from 'mammoth'
import { extractText } from 'unpdf'

const MAX_CHARS = 8000

/** Pull the words out of a PDF or DOCX. A scan, a photo, or an old .doc file comes back empty. */
export async function readCvText(filename: string, data: Buffer) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  try {
    const raw = ext === 'pdf'
      ? await pdfText(data)
      : ext === 'docx'
        ? await docxText(data)
        : ''
    return raw.replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS)
  } catch (error) {
    console.error('[cv] could not read text:', error instanceof Error ? error.message : ext)
    return ''
  }
}

async function pdfText(data: Buffer) {
  const { text } = await extractText(new Uint8Array(data), { mergePages: true })
  return text
}

async function docxText(data: Buffer) {
  const result = await mammoth.extractRawText({ buffer: data })
  return result.value
}
