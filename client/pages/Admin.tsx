import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Search, 
  Database,
  Cpu,
  ArrowLeft,
  RefreshCw,
  BarChart3,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  chunks: number;
  status: 'indexed' | 'processing' | 'error';
}

export default function Admin() {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'research_paper_ml.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      chunks: 24,
      status: 'indexed'
    },
    {
      id: '2',
      name: 'ai_research.txt',
      type: 'TXT',
      size: '850 KB',
      uploadDate: '2024-01-14',
      chunks: 12,
      status: 'indexed'
    },
    {
      id: '3',
      name: 'nlp_dataset.csv',
      type: 'CSV',
      size: '5.2 MB',
      uploadDate: '2024-01-13',
      chunks: 45,
      status: 'processing'
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            
            // Add new files to the list
            const newFiles: UploadedFile[] = Array.from(uploadedFiles).map((file, index) => ({
              id: Date.now().toString() + index,
              name: file.name,
              type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
              size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
              uploadDate: new Date().toISOString().split('T')[0],
              chunks: Math.floor(Math.random() * 50) + 5,
              status: 'processing' as const
            }));
            
            setFiles(prev => [...newFiles, ...prev]);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const reindexFile = (id: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, status: 'processing' as const } : file
    ));
    
    // Simulate reindexing
    setTimeout(() => {
      setFiles(prev => prev.map(file => 
        file.id === id ? { ...file, status: 'indexed' as const } : file
      ));
    }, 2000);
  };

  const stats = {
    totalFiles: files.length,
    totalChunks: files.reduce((sum, file) => sum + file.chunks, 0),
    indexedFiles: files.filter(f => f.status === 'indexed').length,
    processingFiles: files.filter(f => f.status === 'processing').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-semantic-secondary">
      {/* Header */}
      <header className="border-b border-brand-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-500 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-sm text-gray-600">Manage your document collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-brand-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Files</CardTitle>
              <div className="text-2xl font-bold text-gray-900">{stats.totalFiles}</div>
            </CardHeader>
          </Card>
          
          <Card className="border-brand-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Indexed Files</CardTitle>
              <div className="text-2xl font-bold text-green-600">{stats.indexedFiles}</div>
            </CardHeader>
          </Card>
          
          <Card className="border-brand-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Processing</CardTitle>
              <div className="text-2xl font-bold text-yellow-600">{stats.processingFiles}</div>
            </CardHeader>
          </Card>
          
          <Card className="border-brand-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Chunks</CardTitle>
              <div className="text-2xl font-bold text-brand-600">{stats.totalChunks}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 border-brand-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Documents</span>
            </CardTitle>
            <CardDescription>
              Upload new documents to expand your searchable knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isUploading ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">Uploading and processing files...</div>
                <Progress value={uploadProgress} className="w-full" />
                <div className="text-xs text-gray-500">{uploadProgress}% complete</div>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.txt,.csv,.json,.db"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-brand-300 rounded-lg p-8 text-center hover:border-brand-500 transition-colors">
                  <Upload className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Choose files to upload
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Supported formats: PDF, TXT, CSV, JSON, DB files
                  </div>
                  <Button className="bg-brand-500 hover:bg-brand-600">
                    Select Files
                  </Button>
                </div>
              </label>
            )}
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="border-brand-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Document Collection</span>
            </CardTitle>
            <CardDescription>
              Manage your uploaded documents and their indexing status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-brand-500" />
                    <div>
                      <div className="font-medium text-gray-900">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        {file.size} • {file.chunks} chunks • Uploaded {file.uploadDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      {file.type}
                    </Badge>
                    
                    <Badge 
                      variant={
                        file.status === 'indexed' ? 'default' : 
                        file.status === 'processing' ? 'secondary' : 
                        'destructive'
                      }
                      className={
                        file.status === 'indexed' ? 'bg-green-500' :
                        file.status === 'processing' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }
                    >
                      {file.status === 'indexed' ? 'Indexed' :
                       file.status === 'processing' ? 'Processing...' :
                       'Error'}
                    </Badge>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reindexFile(file.id)}
                        disabled={file.status === 'processing'}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFile(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
