import { useState } from 'react';
import { ProteinDesign, GenerationJob, ProteinParameters } from '../types';

// Mock protein sequences for demonstration
const mockSequences = [
  'MKLFWLLFTIGFCWAQYSSNTQQGRTSGIVHVVNLNNYMLPAWYGLNAGGQAMTLHAVVNLINYQDDAELATRAAKDVSHCFPLYDTSVGKYVFMYNNLFYEHQGSPHQVHSLLLTGVYTPTNQCEKPMVLFTDVKNQPVIIVNFSHGTQGNQCNVGVQTPWEEEKNSSFMAEAGGAGVDSVVSFNAVIAIQNKIDIYSGTIFDNAAEACGRGLGLGDIAENPPYFQPDDMDMQFEKGFVSVVVTSRGFYQPVTDSSSRCGAMLSLLVAYAEKYHDPNSFPSSAGTMNYASYSQGCLCVGVAGDAAEAGLGRILVKDSVSVLLQYGSTDYAEQELTSADGPEVIQGLKWGAVNSQVQSRSADQTIIWGVNLAHGVLSIKQVGVLAGLCDEMSAQPVELLEILEDGVLNKNTIEYETVQLQDPLVNVLQVVPAGDLLKIDGTPAYDTKIQAACESPLVSALAYAHMSQMGMSKDVGMPGGLPMQSQMPIGRQKRSAVGMVAMVGAVYRNQTGDVSLKVKSGAGTDAEVDVSLANAGGSGHNYAPGPSIGTGWEKRKAAIQSLEEAGQSLCVGTPSTLQTLIRGLGATTLTPITNGSGSLQVGTGQLLVVNAGTQTVCAGLNSGLQTLQPYQGLDPVGIVSRSSDPTVSCIGLTGSSAQYTDVPGGVGDLYRCSGAAFGNQGLSGVQVATSGGSADRSAASAMDDMMQTVFSCASEPALGCGLDVQVDHYGLQPVFNLNGDHVYVAKLLLMDQYSGYYVGVVDHVFKQDDEGLQPGVFQGLKAGSAGAYQVYVNGTPKVQGSQVGLRDGVQLAGNYGSSYLRQTVSFSVDLASRVGDVGVGGVVDGVVVYDGTGSDMGCTGIGLGGGDVQSGLTGLDEAQGGTPDYPFQCAGLGGAMLSARGVYFQDVVYGLVDGVLDNTKISGVSAGGQFMVFNGVPTLQTVVQTGEDVAGVVTAGVAGGGIVAGALQNVLKGVMLLQGLGGSQGVVQGVVGGLQGVQGVQGVQGVQGVQ',
  'MKLKAILFVVGFVCKSLAAEVQEVQGPQGVAGGQAMTLHAVVNLINYQDDAELATRAAKDVSHCFPLYDTSVGKYVFMYNNLFYEHQGSPHQVHSLLLTGVYTPTNQCEKPMVLFTDVKNQPVIIVNFSHGTQGNQCNVGVQTPWEEEKNSSFMAEAGGAGVDSVVSFNAVIAIQNKIDIYSGTIFDNAAEACGRGLGLGDIAENPPYFQPDDMDMQFEKGFVSVVVTSRGFYQPVTDSSSRCGAMLSLLVAYAEKYHDPNSFPSSAGTMNYASYSQGCLCVGVAGDAAEAGLGRILVKDSVSVLLQYGSTDYAEQELTSADGPEVIQGLKWGAVNSQVQSRSADQTIIWGVNLAHGVLSIKQVGVLAGLCDEMSAQPVELLEILEDGVLNKNTIEYETVQLQDPLVNVLQVVPAGDLLKIDGTPAYDTKIQAACESPLVSALAYAHMSQMGMSKDVGMPGGLPMQSQMPIGRQKRSAVGMVAMVGAVYRNQTGDVSLKVKSGAGTDAEVDVSLANAGGSGHNYAPGPSIGTGWEKRKAAIQSLEEAGQSLCVGTPSTLQTLIRGLGATTLTPITNGSGSLQVGTGQLLVVNAGTQTVCAGLNSGLQTLQPYQGLDPVGIVSRSSDPTVSCIGLTGSSAQYTDVPGGVGDLYRCSGAAFGNQGLSGVQVATSGGSADRSAASAMDDMMQTVFSCASEPALGCGLDVQVDHYGLQPVFNLNGDHVYVAKLLLMDQYSGYYVGVVDHVFKQDDEGLQPGVFQGLKAGSAGAYQVYVNGTPKVQGSQVGLRDGVQLAGNYGSSYLRQTVSFSVDLASRVGDVGVGGVVDGVVVYDGTGSDMGCTGIGLGGGDVQSGLTGLDEAQGGTPDYPFQCAGLGGAMLSARGVYFQDVVYGLVDGVLDNTKISGVSAGGQFMVFNGVPTLQTVVQTGEDVAGVVTAGVAGGGIVAGALQNVLKGVMLLQGLGGSQGVVQGVVGGLQGVQGVQGVQGVQGVQ',
];

export const useProteinGeneration = () => {
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProtein = async (description: string, parameters: ProteinParameters): Promise<ProteinDesign> => {
    setIsGenerating(true);
    
    const job: GenerationJob = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      description,
      createdAt: new Date().toISOString(),
    };
    
    setCurrentJob(job);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    job.status = 'processing';
    setCurrentJob({ ...job });

    // Simulate structure prediction
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock protein data based on parameters
    let sequence = mockSequences[Math.floor(Math.random() * mockSequences.length)];
    
    // Adjust sequence length based on target
    if (parameters.targetLength < sequence.length) {
      sequence = sequence.substring(0, parameters.targetLength);
    } else if (parameters.targetLength > sequence.length) {
      const additionalAA = 'ACDEFGHIKLMNPQRSTVWY';
      while (sequence.length < parameters.targetLength) {
        sequence += additionalAA[Math.floor(Math.random() * additionalAA.length)];
      }
    }
    
    const confidence = 85 + Math.random() * 10; // 85-95% confidence

    const result: ProteinDesign = {
      id: Math.random().toString(36).substr(2, 9),
      userId: '1',
      description,
      targetLength: parameters.targetLength,
      foldingType: parameters.foldingType,
      stabilityPreference: parameters.stabilityPreference,
      solubilityRequirement: parameters.solubilityRequirement,
      sequence,
      confidence: Math.round(confidence * 10) / 10,
      timestamp: new Date().toISOString(),
      exported: false,
    };

    job.status = 'completed';
    job.result = result;
    setCurrentJob({ ...job });
    setIsGenerating(false);

    return result;
  };

  const clearJob = () => {
    setCurrentJob(null);
    setIsGenerating(false);
  };

  return {
    currentJob,
    isGenerating,
    generateProtein,
    clearJob,
  };
};