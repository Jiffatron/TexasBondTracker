import Header from "@/components/Header";
import PDFAuditParser from "@/components/PDFAuditParser";

export default function AuditParser() {
  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">ISD Audit Parser</h1>
          <p className="text-muted-foreground mt-2">
            Upload Texas Independent School District audit PDFs to extract key financial data
          </p>
        </div>
        
        <PDFAuditParser />
      </main>
    </div>
  );
}