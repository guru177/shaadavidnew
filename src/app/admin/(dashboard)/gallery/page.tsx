"use client";

import React, { useState, useEffect } from 'react';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch gallery", error);
    }
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl && !file) return;
    
    setIsAdding(true);
    try {
      let finalImageUrl = newUrl;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalImageUrl = uploadData.url;
        }
      }

      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalImageUrl }),
      });
      setNewUrl('');
      setFile(null);
      fetchGallery();
    } catch (error) {
      console.error("Failed to add image", error);
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      fetchGallery();
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-[#0c1622]">Manage Gallery</h1>
        <p className="text-gray-500 mt-1">Upload and manage images shown on the public gallery page.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#0c1622] mb-1">Add New Image</h2>
        <p className="text-xs text-gray-500 mb-5 font-semibold">Recommended size: 1000x1000px (1:1 ratio) • Max size: 5MB</p>
        
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#29425e]/10 file:text-[#29425e] hover:file:bg-[#29425e]/20"
            />
            <span className="text-gray-400 font-bold text-sm">OR</span>
            <input 
              type="url" 
              value={newUrl} 
              onChange={e => setNewUrl(e.target.value)} 
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] outline-none transition-all text-sm" 
              placeholder="Paste URL here..." 
              required={!file && !newUrl}
            />
          </div>
          <button disabled={isAdding || (!file && !newUrl)} type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-[#0c1622] hover:bg-[#29425e] text-white rounded-xl font-bold transition-all disabled:opacity-70 whitespace-nowrap">
            {isAdding ? 'Uploading...' : 'Add to Gallery'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#0c1622] mb-6">Published Images ({images.length})</h2>
        
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No images in the gallery yet. Add some above!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-xl overflow-hidden aspect-square border border-gray-200">
                <img src={img.url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={() => handleDelete(img.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Delete Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
