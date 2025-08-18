import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Upload, FileText, Database, Cpu, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  source: string;
  fileType: string;
  chunk: number;
}

export default function Index() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(0);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          content: 'Machine learning algorithms can significantly improve document retrieval by understanding semantic relationships between concepts...',
          similarity: 0.94,
          source: 'research_paper_ml.pdf',
          fileType: 'PDF',
          chunk: 1
        },
        {
          id: '2',
          content: 'Neural networks excel at processing natural language queries and finding contextually relevant information...',
          similarity: 0.89,
          source: 'ai_research.txt',
          fileType: 'TXT',
          chunk: 3
        },
        {
          id: '3',
          content: 'Vector embeddings capture semantic meaning better than traditional keyword matching approaches...',
          similarity: 0.85,
          source: 'nlp_dataset.csv',
          fileType: 'CSV',
          chunk: 7
        }
      ];
      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(prev => prev + files.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-semantic-secondary">
      {/* Header */}
      <header className="border-b border-brand-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand-500 rounded-lg">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SemanticSearch</h1>
                <p className="text-sm text-gray-600">AI-Powered Document Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-brand-100 text-brand-700">
                {uploadedFiles} Documents Indexed
              </Badge>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Beyond Keywords.
              <span className="bg-gradient-to-r from-brand-500 to-semantic-accent bg-clip-text text-transparent">
                {" "}Into Meaning.
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Upload your documents and search with natural language. Our AI understands context, 
              not just words, delivering the most relevant results from your knowledge base.
            </p>

            {/* Search Interface */}
            <div className="bg-white rounded-2xl shadow-xl border border-brand-200 p-8 mb-12">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Ask anything about your documents... e.g., 'How do neural networks improve search accuracy?'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 pr-4 py-6 text-lg border-2 border-brand-200 focus:border-brand-500 rounded-xl"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching || !query.trim()}
                  className="px-8 py-6 text-lg bg-brand-500 hover:bg-brand-600 rounded-xl"
                >
                  {isSearching ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Search</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Quick Upload */}
              <div className="flex items-center justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.txt,.csv,.json,.db"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-2 px-6 py-3 bg-brand-50 hover:bg-brand-100 rounded-lg border-2 border-dashed border-brand-300 transition-colors">
                    <Upload className="h-5 w-5 text-brand-600" />
                    <span className="text-brand-700 font-medium">Upload Documents</span>
                    <span className="text-sm text-gray-500">(PDF, TXT, CSV, JSON, DB)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Search Results */}
            {results.length > 0 && (
              <div className="space-y-4 mb-12">
                <h3 className="text-2xl font-bold text-gray-900 text-left">Search Results</h3>
                {results.map((result) => (
                  <Card key={result.id} className="text-left hover:shadow-lg transition-shadow border-brand-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-brand-500" />
                          <CardTitle className="text-lg font-semibold">{result.source}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {result.fileType}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Chunk {result.chunk}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Similarity:</span>
                          <Badge 
                            variant={result.similarity > 0.9 ? "default" : "secondary"}
                            className={result.similarity > 0.9 ? "bg-green-500" : "bg-yellow-500"}
                          >
                            {(result.similarity * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{result.content}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Found in: {result.source}
                        </div>
                        <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700">
                          View Full Document
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Semantic Search?</h3>
            <p className="text-xl text-gray-600">Traditional keyword search finds words. We find meaning.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-brand-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-brand-100 rounded-lg w-fit mb-4">
                  <Cpu className="h-8 w-8 text-brand-600" />
                </div>
                <CardTitle>Context-Aware AI</CardTitle>
                <CardDescription>
                  Our neural models understand relationships between concepts, not just exact word matches.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-brand-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-brand-100 rounded-lg w-fit mb-4">
                  <Database className="h-8 w-8 text-brand-600" />
                </div>
                <CardTitle>Multi-Format Support</CardTitle>
                <CardDescription>
                  Upload PDFs, text files, CSVs, JSON, and databases. We extract and index everything.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-brand-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-brand-100 rounded-lg w-fit mb-4">
                  <Zap className="h-8 w-8 text-brand-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  FAISS vector indexing delivers sub-second search results across millions of documents.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-brand-500 rounded-lg">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">SemanticSearch</span>
          </div>
          <p className="text-gray-400">
            Powered by SentenceTransformers, FAISS, and cutting-edge NLP research.
          </p>
        </div>
      </footer>
    </div>
  );
}
