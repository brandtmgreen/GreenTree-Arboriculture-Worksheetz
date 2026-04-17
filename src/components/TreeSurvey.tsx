import React, { useState, useEffect } from 'react';
import { Map, Info, Plane, CheckCircle2, Search, Activity, Camera, TreePine, Sparkles, User, Phone, Mail, Briefcase, MapPin, Loader2, Globe, ImagePlus, X, Trash2 } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { fetchSiteDetails } from '../services/geminiService';
import { db, setDoc, doc, handleFirestoreError, OperationType, auth } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';

interface TreeEntry {
  id: string;
  species: string;
  height: string;
  dbh: string;
  category: string;
  condition: string;
  photos: string[];
}

export const TreeSurvey: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    surveyorName: '',
    surveyPurpose: '',
    address: '',
    surveyArea: '',
    surveyType: 'BS5837:2012',
    surveyMethod: 'Ground-based Visual',
    summary: '',
  });

  const [trees, setTrees] = useState<TreeEntry[]>([
    { id: 'T001', species: 'Quercus robur', height: '18m', dbh: '85cm', category: 'A1', condition: 'Good', photos: [] },
    { id: 'T002', species: 'Fraxinus excelsior', height: '14m', dbh: '45cm', category: 'U', condition: 'Dead/Dying', photos: [] }
  ]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (treeId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const compressedBase64 = await compressImage(file);
      setTrees(prev => prev.map(t => 
        t.id === treeId ? { ...t, photos: [...t.photos, compressedBase64] } : t
      ));
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  const removePhoto = (treeId: string, photoIndex: number) => {
    setTrees(prev => prev.map(t => 
      t.id === treeId ? { ...t, photos: t.photos.filter((_, i) => i !== photoIndex) } : t
    ));
  };

  const updateTree = (id: string, field: keyof TreeEntry, value: string) => {
    setTrees(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addTree = () => {
    const newId = `T${String(trees.length + 1).padStart(3, '0')}`;
    setTrees([...trees, { id: newId, species: '', height: '', dbh: '', category: 'C', condition: 'Fair', photos: [] }]);
  };

  const removeTree = (id: string) => {
    setTrees(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (siteData) {
      setFormData(prev => ({
        ...prev,
        date: siteData.date || prev.date,
        clientName: siteData.clientName || prev.clientName,
        clientPhone: siteData.clientPhone || prev.clientPhone,
        clientEmail: siteData.clientEmail || prev.clientEmail,
        surveyorName: siteData.surveyorName || prev.surveyorName,
        surveyPurpose: siteData.surveyPurpose || prev.surveyPurpose,
        address: siteData.location || prev.address,
        surveyArea: siteData.surveyArea || prev.surveyArea,
      }));
    }
  }, [siteData]);

  const handleSmartFill = () => {
    if (siteData) {
      setFormData(prev => ({
        ...prev,
        summary: `Site Area: ${siteData.location || 'N/A'}. \nTree Species Identified: ${siteData.treeSpecies?.join(', ') || 'N/A'}. \nDrone Mapping Notes: ${siteData.droneNotes || 'N/A'}.`,
      }));
    }
  };

  const handleFetchSiteInfo = async () => {
    if (!formData.address) return;
    setIsFetching(true);
    try {
      const details = await fetchSiteDetails(formData.address);
      updateSiteData(details);
      if (details.treeSpecies) {
        setFormData(prev => ({
          ...prev,
          summary: `${prev.summary}\n\nAI Research Findings:\nTypical Species: ${details.treeSpecies?.join(', ')}\nConditions: ${details.siteConditions}\nWeather: ${details.weather}`
        }));
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    setSaveSuccess(false);
    
    const id = `TS-${Date.now()}`;
    const path = `treeSurveys/${id}`;
    
    try {
      await setDoc(doc(db, 'treeSurveys', id), {
        ...formData,
        trees,
        id,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTrees = trees.filter(tree => {
    const query = searchQuery.toLowerCase();
    return (
      tree.id.toLowerCase().includes(query) ||
      tree.species.toLowerCase().includes(query) ||
      tree.condition.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <Map size={24} className="sm:w-7 sm:h-7" />
          Tree Survey (BS5837)
        </h2>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {siteData && Object.keys(siteData).length > 0 && (
            <button 
              onClick={handleSmartFill}
              className="btn-secondary text-xs py-1.5 bg-brand-vibrant/10 border-brand-vibrant text-brand-vibrant hover:bg-brand-vibrant hover:text-white animate-pulse"
            >
              <Sparkles size={14} />
              Smart Fill from AI
            </button>
          )}
          <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
            Ref: TS-2026-001
          </div>
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Customer & Surveyor Info */}
        <section>
          <div className="section-header text-brand-green">
            <User size={20} />
            Customer & Surveyor Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Client Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  className="input-field pl-10" 
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Client Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  className="input-field pl-10" 
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Client Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" 
                  className="input-field pl-10" 
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Surveyor Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  className="input-field pl-10" 
                  value={formData.surveyorName}
                  onChange={(e) => setFormData({...formData, surveyorName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-500">Survey Purpose</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  className="input-field pl-10" 
                  placeholder="e.g. Planning Application, Risk Management..."
                  value={formData.surveyPurpose}
                  onChange={(e) => setFormData({...formData, surveyPurpose: e.target.value})}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Site Location */}
        <section>
          <div className="section-header text-brand-green">
            <MapPin size={20} />
            Site Location & Area
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500 flex justify-between">
                Job Site Address
                <button 
                  onClick={handleFetchSiteInfo}
                  disabled={isFetching || !formData.address}
                  className="text-brand-vibrant hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  {isFetching ? <Loader2 size={12} className="animate-spin" /> : <Globe size={12} />}
                  Auto-fetch site data
                </button>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  className="input-field pl-10" 
                  placeholder="Enter address..." 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Specific Area to Survey</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Rear garden, North boundary..."
                value={formData.surveyArea}
                onChange={(e) => setFormData({...formData, surveyArea: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Survey Methodology */}
        <section>
          <div className="section-header text-brand-green">
            <Info size={20} />
            Survey Methodology
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Survey Type</label>
              <select 
                className="input-field"
                value={formData.surveyType}
                onChange={(e) => setFormData({...formData, surveyType: e.target.value})}
              >
                <option>BS5837:2012</option>
                <option>Tree Inventory</option>
                <option>Risk Management Survey</option>
                <option>Ecological Impact Assessment</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Survey Method</label>
              <select 
                className="input-field"
                value={formData.surveyMethod}
                onChange={(e) => setFormData({...formData, surveyMethod: e.target.value})}
              >
                <option>Ground-based Visual</option>
                <option>Drone-assisted Photogrammetry</option>
                <option>LiDAR Point Cloud</option>
                <option>Combined Ground & Aerial</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Site Area (Est.)</label>
              <input type="text" className="input-field" placeholder="e.g. 2.5 hectares" />
            </div>
          </div>
        </section>

        {/* Drone Photogrammetry & Mapping */}
        <section className="bg-brand-green/5 p-4 sm:p-6 rounded-2xl border border-brand-green/20">
          <div className="section-header text-brand-green border-brand-green/20">
            <Plane size={20} className="animate-bounce" />
            Drone Photogrammetry & Mapping
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Orthomosaic Map Link</label>
                <div className="relative">
                  <input type="text" className="input-field pl-9" placeholder="https://cloud.greentree.com/maps/..." />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">3D Model Link (Point Cloud)</label>
                <div className="relative">
                  <input type="text" className="input-field pl-9" placeholder="https://cloud.greentree.com/3d/..." />
                  <Activity className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-brand-green uppercase">Mapping Data Quality</p>
              <div className="grid grid-cols-2 gap-2">
                {['High Resolution', 'GPS Tagged', 'GCPs Used', 'RTK Enabled'].map(tag => (
                  <div key={tag} className="flex items-center gap-2 p-2 bg-white rounded border border-brand-green/10">
                    <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tree Schedule */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="section-header text-brand-green mb-0 border-none pb-0">
              <TreePine size={20} />
              Tree Schedule
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search ID, species, condition..." 
                className="input-field pl-9 py-1.5 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 overflow-x-auto">
            <table className="min-w-full text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 px-2">ID</th>
                  <th className="pb-2 px-2">Species</th>
                  <th className="pb-2 px-2">Height</th>
                  <th className="pb-2 px-2">DBH</th>
                  <th className="pb-2 px-2">Category</th>
                  <th className="pb-2 px-2">Condition</th>
                  <th className="pb-2 px-2">Photos</th>
                  <th className="pb-2 px-2"></th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredTrees.map(tree => (
                  <tr key={tree.id} className="border-b border-gray-100 group">
                    <td className="py-2 px-2 font-bold">
                      <input 
                        value={tree.id} 
                        onChange={(e) => updateTree(tree.id, 'id', e.target.value)} 
                        className="w-12 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-green focus:outline-none transition-colors" 
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input 
                        value={tree.species} 
                        onChange={(e) => updateTree(tree.id, 'species', e.target.value)} 
                        placeholder="Species..." 
                        className="w-full min-w-[120px] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-green focus:outline-none transition-colors" 
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input 
                        value={tree.height} 
                        onChange={(e) => updateTree(tree.id, 'height', e.target.value)} 
                        placeholder="e.g. 10m" 
                        className="w-16 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-green focus:outline-none transition-colors" 
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input 
                        value={tree.dbh} 
                        onChange={(e) => updateTree(tree.id, 'dbh', e.target.value)} 
                        placeholder="e.g. 50cm" 
                        className="w-16 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-green focus:outline-none transition-colors" 
                      />
                    </td>
                    <td className="py-2 px-2">
                      <select 
                        value={tree.category} 
                        onChange={(e) => updateTree(tree.id, 'category', e.target.value)} 
                        className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-green focus:outline-none cursor-pointer"
                      >
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="A3">A3</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="B3">B3</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                        <option value="C3">C3</option>
                        <option value="U">U</option>
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <select 
                        value={tree.condition} 
                        onChange={(e) => updateTree(tree.id, 'condition', e.target.value)} 
                        className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-green focus:outline-none cursor-pointer max-w-[120px]"
                      >
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                        <option value="Dead/Dying">Dead/Dying</option>
                        <option value="Diseased">Diseased</option>
                        <option value="Structurally Compromised">Structurally Compromised</option>
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1 flex-wrap min-w-[80px]">
                        {tree.photos.map((photo, i) => (
                          <div key={i} className="relative group/photo">
                            <img src={photo} alt="Tree" className="w-8 h-8 object-cover rounded border border-gray-200" />
                            <button 
                              onClick={() => removePhoto(tree.id, i)} 
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hidden group-hover/photo:block shadow-sm"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <label className="cursor-pointer bg-white hover:bg-gray-100 w-8 h-8 rounded flex items-center justify-center border border-dashed border-gray-300 transition-colors">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(tree.id, e)} />
                          <ImagePlus size={14} className="text-gray-400" />
                        </label>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <button 
                        onClick={() => removeTree(tree.id)} 
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTrees.length === 0 && (
              <div className="text-center py-8 text-gray-400 italic text-sm">
                No trees match your search.
              </div>
            )}
          </div>
          <button 
            onClick={addTree}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold uppercase text-xs hover:border-brand-green hover:text-brand-green transition-all"
          >
            + Add Tree Entry
          </button>
        </section>

        {/* Recommendations & Sign Off */}
        <section>
          <div className="section-header text-brand-green">
            <Camera size={20} />
            Survey Findings & Recommendations
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Summary of Findings</label>
              <textarea 
                className="input-field min-h-[150px]" 
                placeholder="Provide a high-level summary of the survey results..."
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
              ></textarea>
            </div>
          </div>
        </section>

        {/* Sign Off */}
        <section className="pt-4 border-t">
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`btn-primary w-full py-4 text-lg bg-brand-green ${saveSuccess ? 'bg-green-600' : ''}`}
          >
            {isSaving ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
            {isSaving ? 'Finalizing...' : saveSuccess ? 'Report Finalized!' : 'Finalize Tree Survey Report'}
          </button>
        </section>
      </div>
    </div>
  );
};
