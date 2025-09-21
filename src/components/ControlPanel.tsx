import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Database,
  Download,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface ControlPanelProps {
  onGraphDataChange: (data: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedProtein: string | null;
}

export const ControlPanel = ({ 
  onGraphDataChange, 
  searchQuery, 
  onSearchChange, 
  selectedProtein 
}: ControlPanelProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [proteinId, setProteinId] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      toast(`CSV file "${file.name}" uploaded successfully`);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast("Knowledge graph image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const processCsvData = async () => {
    if (!csvFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate CSV processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast("CSV data processed and graph updated!");
      onGraphDataChange({ source: 'csv', file: csvFile.name });
    } catch (error) {
      toast("Error processing CSV file");
    } finally {
      setIsProcessing(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsProcessing(true);
    try {
      // Simulate search
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast(`Search completed for: ${searchQuery}`);
      onGraphDataChange({ source: 'search', query: searchQuery });
    } catch (error) {
      toast("Search failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchProteinById = async () => {
    if (!proteinId.trim()) return;
    
    setIsProcessing(true);
    try {
      // Simulate protein ID lookup
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast(`Protein data fetched for ID: ${proteinId}`);
      onGraphDataChange({ source: 'id', proteinId });
    } catch (error) {
      toast("Failed to fetch protein data");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    toast("Knowledge graph image removed");
  };

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-5 w-5 text-primary" />
          Analysis Controls
        </CardTitle>
        {selectedProtein && (
          <Badge variant="outline" className="w-fit">
            Selected: {selectedProtein}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="search-input">Protein/Gene Search</Label>
              <div className="flex gap-2">
                <Input
                  id="search-input"
                  placeholder="e.g., Tau, BRCA1, TP53..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={performSearch}
                  disabled={!searchQuery.trim() || isProcessing}
                  size="sm"
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="protein-id">Protein ID Lookup</Label>
              <div className="flex gap-2">
                <Input
                  id="protein-id"
                  placeholder="UniProt ID, HGNC symbol..."
                  value={proteinId}
                  onChange={(e) => setProteinId(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={fetchProteinById}
                  disabled={!proteinId.trim() || isProcessing}
                  size="sm"
                >
                  <Database className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="csv-upload">CSV Data Upload</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select CSV File
                </Button>
                {csvFile && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Selected: {csvFile.name}
                    </p>
                    <Button 
                      onClick={processCsvData}
                      disabled={isProcessing}
                      size="sm"
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Process CSV
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Expected CSV format: protein1, protein2, interaction_type, pmid
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            <div className="space-y-3">
              <Label>Knowledge Graph Images</Label>
              
              {uploadedImage ? (
                <div className="space-y-3">
                  <div className="border border-border rounded-lg overflow-hidden">
                    <img 
                      src={uploadedImage} 
                      alt="Protein knowledge graph" 
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={removeImage}
                      className="flex-1"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Knowledge Graph
                  </Button>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Upload reference knowledge graphs</p>
              <p>• Compare with generated networks</p>
              <p>• Export current visualization</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Nodes: 7</div>
            <div>Edges: 6</div>
            <div>Proteins: 4</div>
            <div>Papers: 1</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};