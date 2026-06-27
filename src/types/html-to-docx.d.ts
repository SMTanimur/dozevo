declare module 'html-to-docx' {
  function HTMLtoDOCX(
    html: string,
    headerHTML?: string | null,
    options?: {
      table?: { row?: { cantSplit?: boolean } };
      footer?: boolean;
      pageNumber?: boolean;
      font?: string;
      fontSize?: number;
      margins?: { top?: number; right?: number; bottom?: number; left?: number };
      [key: string]: unknown;
    },
    footerHTML?: string | null
  ): Promise<Buffer | Blob>;

  export default HTMLtoDOCX;
}
