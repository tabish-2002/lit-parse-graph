import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

interface LiteraturePanelProps {
  selectedProtein: string | null;
  onProteinSelect: (protein: string) => void;
}

const mockLiterature = [
  {
    pmid: "31201283",
    title: "Tau protein interactions with Shp2 phosphatase in neurodegenerative pathways",
    authors: "Smith, J. et al.",
    journal: "Nature Neuroscience",
    year: "2019",
    citations: 156,
    relevantProteins: ["Tau", "Shp2", "APP"],
    type: "Research Article"
  },
  {
    pmid: "30192847",
    title: "Alpha-synuclein aggregation and its role in Parkinson's disease",
    authors: "Johnson, M. et al.",
    journal: "Cell",
    year: "2018",
    citations: 243,
    relevantProteins: ["SNCA", "PARK2", "LRRK2"],
    type: "Review"
  },
  {
    pmid: "29874567",
    title: "BRCA1 interactions in DNA repair mechanisms",
    authors: "Williams, K. et al.",
    journal: "Science",
    year: "2018",
    citations: 189,
    relevantProteins: ["BRCA1", "BRCA2", "TP53"],
    type: "Research Article"
  },
  {
    pmid: "28945234",
    title: "Huntingtin protein complex assembly and neuronal dysfunction",
    authors: "Davis, R. et al.",
    journal: "PNAS",
    year: "2017",
    citations: 134,
    relevantProteins: ["HTT", "HAP1", "DCTN1"],
    type: "Research Article"
  }
];

export const LiteraturePanel = ({ selectedProtein, onProteinSelect }: LiteraturePanelProps) => {
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);

  const handleProteinClick = (protein: string) => {
    onProteinSelect(protein);
    toast(`Selected protein: ${protein}`);
  };

  const handleViewPaper = (pmid: string) => {
    toast(`Opening PubMed: ${pmid}`);
    // In a real app, this would open the PubMed link
  };

  return (
    <Card className="h-full bg-literature-bg/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-literature-accent" />
          Literature Evidence
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Scientific publications supporting protein interactions
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {mockLiterature.map((paper) => (
          <div
            key={paper.pmid}
            className="p-4 bg-card rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <Badge variant={paper.type === "Review" ? "secondary" : "default"} className="text-xs">
                {paper.type}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {paper.year}
              </div>
            </div>
            
            <h4 className="font-medium text-sm mb-2 line-clamp-2 leading-tight">
              {paper.title}
            </h4>
            
            <p className="text-xs text-muted-foreground mb-2">
              {paper.authors} • {paper.journal}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">
                Citations: {paper.citations}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewPaper(paper.pmid)}
                className="h-6 px-2 text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                PMID: {paper.pmid}
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Proteins:</p>
              <div className="flex flex-wrap gap-1">
                {paper.relevantProteins.map((protein) => (
                  <Button
                    key={protein}
                    variant={selectedProtein === protein ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleProteinClick(protein)}
                    className="h-6 px-2 text-xs hover:bg-primary hover:text-primary-foreground"
                  >
                    {protein}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};