/**
 * Renders a JSON-LD `<script>` block for structured data.
 *
 * Centralising the serialisation keeps the schema-building logic (in `lib/structured-data.ts`)
 * separate from how it is injected into the document.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: it is our own structured data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
