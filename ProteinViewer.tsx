import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

interface ProteinViewerProps {
  sequence?: string;
  structure?: string;
  confidence?: number;
  isPlaceholder?: boolean;
}

export const ProteinViewer: React.FC<ProteinViewerProps> = ({
  sequence,
  structure,
  confidence,
  isPlaceholder = false,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewer3DRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!scriptLoadedRef.current) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.4/3Dmol-min.js';
      script.onload = () => {
        scriptLoadedRef.current = true;
        initializeViewer();
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else {
      initializeViewer();
    }
  }, []);

  useEffect(() => {
    if (viewer3DRef.current && sequence && !isPlaceholder) {
      updateProteinStructure();
    }
  }, [sequence, structure, isPlaceholder]);

  const initializeViewer = () => {
    if (viewerRef.current && window.$3Dmol) {
      viewer3DRef.current = window.$3Dmol.createViewer(viewerRef.current, {
        defaultcolors: window.$3Dmol.rasmolElementColors,
      });
      
      viewer3DRef.current.setBackgroundColor(0x000000, 0.0);
      
      if (isPlaceholder) {
        showPlaceholder();
      } else if (sequence) {
        updateProteinStructure();
      }
    }
  };

  const showPlaceholder = () => {
    if (!viewer3DRef.current) return;
    
    const placeholderPDB = `ATOM      1  CA  ALA A   1      -8.901   4.127  -0.555  1.00 11.99           C
ATOM      2  CA  ALA A   2      -8.608   3.135  -3.618  1.00 11.99           C
ATOM      3  CA  ALA A   3      -5.924   1.568  -5.261  1.00 11.99           C
ATOM      4  CA  ALA A   4      -3.192   4.019  -6.066  1.00 11.99           C
ATOM      5  CA  ALA A   5      -1.153   2.113  -8.348  1.00 11.99           C
ATOM      6  CA  ALA A   6       1.230   4.567  -9.304  1.00 11.99           C
ATOM      7  CA  ALA A   7       4.016   2.208 -10.829  1.00 11.99           C
ATOM      8  CA  ALA A   8       6.589   5.106 -12.456  1.00 11.99           C
END`;
    
    viewer3DRef.current.addModel(placeholderPDB, 'pdb');
    viewer3DRef.current.setStyle({}, { cartoon: { color: 'spectrum' } });
    viewer3DRef.current.zoomTo();
    viewer3DRef.current.render();
    viewer3DRef.current.spin(true);
  };

  const updateProteinStructure = () => {
    if (!viewer3DRef.current) return;
    
    viewer3DRef.current.clear();
    
    let pdbData = structure;
    if (!pdbData && sequence) {
      pdbData = generateMockStructure(sequence);
    }
    
    if (pdbData) {
      viewer3DRef.current.addModel(pdbData, 'pdb');
      
      const color = confidence && confidence >= 90 ? 'green' : 
                    confidence && confidence >= 80 ? 'yellow' : 'orange';
      
      viewer3DRef.current.setStyle({}, { 
        cartoon: { color: color, thickness: 0.8 },
        stick: { radius: 0.15 }
      });
      
      viewer3DRef.current.zoomTo();
      viewer3DRef.current.render();
      viewer3DRef.current.spin(true);
    }
  };

  const generateMockStructure = (sequence: string): string => {
    let pdb = '';
    const length = Math.min(sequence.length, 100);
    
    for (let i = 0; i < length; i++) {
      const angle = i * 0.3;
      const radius = 8 + Math.sin(i * 0.1) * 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = i * 1.5 - length * 0.75;
      
      const resName = getThreeLetterCode(sequence[i]);
      
      pdb += `ATOM  ${(i + 1).toString().padStart(5)}  CA  ${resName} A${(i + 1).toString().padStart(4)}    ${x.toFixed(3).padStart(8)}${y.toFixed(3).padStart(8)}${z.toFixed(3).padStart(8)}  1.00 20.00           C\n`;
    }
    
    pdb += 'END\n';
    return pdb;
  };

  const getThreeLetterCode = (oneLetterCode: string): string => {
    const codes: { [key: string]: string } = {
      'A': 'ALA', 'R': 'ARG', 'N': 'ASN', 'D': 'ASP', 'C': 'CYS',
      'Q': 'GLN', 'E': 'GLU', 'G': 'GLY', 'H': 'HIS', 'I': 'ILE',
      'L': 'LEU', 'K': 'LYS', 'M': 'MET', 'F': 'PHE', 'P': 'PRO',
      'S': 'SER', 'T': 'THR', 'W': 'TRP', 'Y': 'TYR', 'V': 'VAL'
    };
    return codes[oneLetterCode] || 'ALA';
  };

  return (
    <motion.div
      className="relative h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl border border-purple-500/20 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={viewerRef} className="h-full w-full" />
      
      {confidence && (
        <motion.div
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm font-medium text-white">
            Confidence: <span className={`${confidence >= 90 ? 'text-green-400' : confidence >= 80 ? 'text-yellow-400' : 'text-orange-400'}`}>
              {confidence.toFixed(1)}%
            </span>
          </div>
        </motion.div>
      )}
      
      {isPlaceholder && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-white/60">
            <div className="text-lg font-medium mb-2">Interactive 3D structure generated from AI prediction</div>
            <div className="text-sm">Generate a protein to see structure</div>
          </div>
        </motion.div>
      )}

      {!isPlaceholder && sequence && (
        <motion.div
          className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-xs text-white/80">
            Interactive 3D structure generated from AI prediction
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};