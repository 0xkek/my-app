// /app/generate/page.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Download, Shuffle, Upload, Image as LucideImage, Layers } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';

// --- Helper Types ---
type ImageLayer = {
  name: string;
  files: File[];
};

type TraitSelection = {
  layerName: string;
  file: File;
};

// --- Main Component ---
export default function NftGeneratorPage() {
  const [layers, setLayers] = useState<ImageLayer[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentColor = '#FFAE00';

  // --- Handlers ---

  /**
   * Adds a new, empty layer for users to upload images to.
   */
  const addLayer = () => {
    const newLayerName = `Layer ${layers.length + 1}`;
    setLayers([...layers, { name: newLayerName, files: [] }]);
  };

  /**
   * Updates the name of a specific layer.
   */
  const handleLayerNameChange = (index: number, newName: string) => {
    const updatedLayers = [...layers];
    updatedLayers[index].name = newName;
    setLayers(updatedLayers);
  };

  /**
   * Handles file selection for a specific layer, adding the new files.
   */
  const handleFileChange = (index: number, selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const updatedLayers = [...layers];
    updatedLayers[index].files = [...updatedLayers[index].files, ...Array.from(selectedFiles)];
    setLayers(updatedLayers);
  };
  
  /**
    * Removes a specific image file from a layer.
  */
  const removeFile = (layerIndex: number, fileIndex: number) => {
    const updatedLayers = [...layers];
    updatedLayers[layerIndex].files.splice(fileIndex, 1);
    setLayers(updatedLayers);
  };

  /**
   * Removes an entire layer.
   */
  const removeLayer = (index: number) => {
    const updatedLayers = layers.filter((_, i) => i !== index);
    setLayers(updatedLayers);
  };

  /**
   * The core function to generate a random NFT.
   * It randomly selects one trait from each layer and draws them onto the canvas.
   */
  const generateRandomNft = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || layers.some(l => l.files.length === 0)) {
      alert("Please make sure every layer has at least one image before generating.");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find the max dimensions to set canvas size
    let maxWidth = 0;
    let maxHeight = 0;
    
    // This is a simplified approach; assumes first image in first layer sets the size.
    // A more robust solution might involve pre-loading all images to find max dimensions.
    if (layers[0] && layers[0].files[0]) {
        const firstImage = await createImageBitmap(layers[0].files[0]);
        maxWidth = firstImage.width;
        maxHeight = firstImage.height;
    } else {
        // Default size if no images are loaded yet
        maxWidth = 512;
        maxHeight = 512;
    }

    canvas.width = maxWidth;
    canvas.height = maxHeight;

    // Clear canvas for redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each layer
    for (const layer of layers) {
      if (layer.files.length > 0) {
        const randomIndex = Math.floor(Math.random() * layer.files.length);
        const file = layer.files[randomIndex];
        const image = await createImageBitmap(file);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    }

    // Set the generated image for display
    setGeneratedImage(canvas.toDataURL('image/png'));
  }, [layers]);

  /**
   * Handles downloading the currently displayed image.
   */
  const downloadImage = () => {
    if (!generatedImage) {
      alert("Please generate an image first!");
      return;
    }
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `nft-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Render Method ---
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-white">NFT Collection Generator</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Create your own layered NFT collection. Add layers, upload your art, and randomly generate unique combinations.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side: Controls & Layers */}
          <div className="bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950/80 backdrop-blur-sm border border-[#FFAE00] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-white">
                <Layers className="mr-3" color={accentColor} />
                Trait Layers
            </h2>
            
            <div className="space-y-6">
              {layers.map((layer, layerIndex) => (
                <div key={layerIndex} className="bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950/80 backdrop-blur-sm p-4 rounded-md border border-stone-600">
                  <div className="flex justify-between items-center mb-3">
                    <input
                      type="text"
                      value={layer.name}
                      onChange={(e) => handleLayerNameChange(layerIndex, e.target.value)}
                      className="bg-transparent text-lg font-semibold border-b border-stone-500 focus:border-yellow-400 focus:outline-none text-white"
                    />
                    <button onClick={() => removeLayer(layerIndex)} className="text-red-500 hover:text-red-400 font-bold transition-colors">
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                    {layer.files.map((file, fileIndex) => (
                       <div key={fileIndex} className="relative group">
                           <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover rounded aspect-square"/>
                           <button onClick={() => removeFile(layerIndex, fileIndex)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               &times;
                           </button>
                       </div>
                    ))}
                  </div>

                  <label className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950/80 backdrop-blur-sm text-slate-300 rounded-md cursor-pointer hover:bg-stone-700 transition-colors border border-stone-600">
                    <Upload className="w-5 h-5 mr-2" />
                    <span>Add Images</span>
                    <input type="file" multiple onChange={(e) => handleFileChange(layerIndex, e.target.files)} className="hidden" accept="image/png, image/jpeg, image/gif"/>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={addLayer}
              style={{ borderColor: accentColor, color: accentColor }}
              className="mt-6 w-full text-center font-semibold py-3 px-5 rounded-md border-2 transition-all duration-300 hover:bg-yellow-500/10 hover:shadow-[0_0_12px_rgba(255,174,0,0.3)]"
            >
              + Add New Layer
            </button>
          </div>

          {/* Right Side: Preview & Actions */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-white">
                <LucideImage className="mr-3" color={accentColor} />
                Preview
            </h2>
            
            <div className="w-full max-w-md aspect-square bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950/80 backdrop-blur-sm border-2 border-dashed border-[#FFAE00] rounded-lg flex items-center justify-center mb-6">
                {generatedImage ? (
                    <img src={generatedImage} alt="Generated NFT" className="max-w-full max-h-full rounded-md" />
                ) : (
                    <div className="text-center text-slate-300">
                        <p>Your generated NFT will appear here.</p>
                        <p className="text-sm">Add some layers and click "Generate".</p>
                    </div>
                )}
                 <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={generateRandomNft}
                  style={{ backgroundColor: accentColor }}
                  className="w-full flex items-center justify-center hover:opacity-90 hover:scale-105 text-black font-semibold py-3 px-5 rounded-md shadow-md transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,174,0,0.7)]"
                >
                    <Shuffle className="mr-2" />
                    Generate
                </button>
                <button
                  onClick={downloadImage}
                  className="w-full flex items-center justify-center bg-gradient-to-br from-stone-700 to-stone-800 hover:from-stone-600 hover:to-stone-700 text-white font-semibold py-3 px-5 rounded-md shadow-md transition-all border border-stone-600"
                >
                    <Download className="mr-2" />
                    Download
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}