import { useState } from "react";
import { LiteraturePanel } from "./LiteraturePanel";
import { ProteinGraphVisualization } from "./ProteinGraphVisualization";
import { ControlPanel } from "./ControlPanel";
import { Header } from "./Header";

export const ProteinInteractionPlatform = () => {
  const [selectedProtein, setSelectedProtein] = useState<string | null>(null);
  const [graphData, setGraphData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/30">
      <Header />
      
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Literature Panel - Left */}
        <div className="w-80 flex-shrink-0">
          <LiteraturePanel 
            selectedProtein={selectedProtein}
            onProteinSelect={setSelectedProtein}
          />
        </div>

        {/* Graph Visualization - Center */}
        <div className="flex-1 min-w-0">
          <ProteinGraphVisualization 
            selectedProtein={selectedProtein}
            onProteinSelect={setSelectedProtein}
            graphData={graphData}
            searchQuery={searchQuery}
          />
        </div>

        {/* Control Panel - Right */}
        <div className="w-80 flex-shrink-0">
          <ControlPanel 
            onGraphDataChange={setGraphData}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedProtein={selectedProtein}
          />
        </div>
      </div>
    </div>
  );
};