import { Network, Dna } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-panel">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-node">
            <Network className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">ProteinMapper</h1>
            <p className="text-sm text-muted-foreground">
              Literature-based Protein Interaction Network Analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Dna className="h-5 w-5" />
          <span className="text-sm font-medium">Bioinformatics Platform</span>
        </div>
      </div>
    </header>
  );
};