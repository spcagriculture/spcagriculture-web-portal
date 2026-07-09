import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPortalSettings, updatePortalSettings, uploadSettingImage, validateImage, PortalSettings, defaultSettings } from '@/integrations/firebase/portalSettings';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, Upload, Trash2, Plus, ArrowLeft, User, MessageSquare, Phone, Mail } from 'lucide-react';

export default function AdminProvincialPortalPage() {
  const [settings, setSettings] = useState<PortalSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getPortalSettings();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load settings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePortalSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(`Failed to save settings: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getErrorMessage = (error: any): string => {
    if (error?.code === 'permission-denied') {
      return 'Permission denied. You may not have access to save settings.';
    } else if (error?.code === 'unauthenticated') {
      return 'Not authenticated. Please log in again.';
    } else if (error?.code === 'internal') {
      return 'Internal server error. Please try again.';
    } else if (error?.message) {
      return error.message;
    }
    return 'Unknown error occurred';
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (settings.heroImages.length >= 3) {
      toast.error('Maximum 3 hero images allowed');
      return;
    }

    try {
      await validateImage(file, { maxWidth: 3000, maxHeight: 3000 });
      const url = await uploadSettingImage(file, 'hero-images');
      setSettings(prev => ({
        ...prev,
        heroImages: [...prev.heroImages, { id: Date.now().toString(), url, alt: 'Hero image' }]
      }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const removeHeroImage = (id: string) => {
    setSettings(prev => ({
      ...prev,
      heroImages: prev.heroImages.filter(img => img.id !== id)
    }));
  };

  const handleMinistryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await validateImage(file, { maxWidth: 3000, maxHeight: 3000 });
      const url = await uploadSettingImage(file, 'ministry-images');
      setSettings(s => ({
        ...s,
        ministry: { ...s.ministry, imageUrl: url }
      }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const handleProvinceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await validateImage(file, { maxWidth: 3000, maxHeight: 3000 });
      const url = await uploadSettingImage(file, 'province-images');
      setSettings(s => ({
        ...s,
        province: { ...s.province, imageUrl: url }
      }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const handleDepartmentImageUpload = async (deptId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await validateImage(file, { maxWidth: 3000, maxHeight: 3000 });
      const url = await uploadSettingImage(file, `department-images/${deptId}`);
      setSettings(s => ({
        ...s,
        departmentHeroImages: {
          ...s.departmentHeroImages,
          [deptId]: url
        }
      }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const removeDepartmentImage = (deptId: string) => {
    setSettings(s => ({
      ...s,
      departmentHeroImages: {
        ...s.departmentHeroImages,
        [deptId]: ''
      }
    }));
  };

  // Helper functions for Leadership Messages management
  const addLeadershipMessage = () => {
    setSettings(prev => ({
      ...prev,
      ministry: {
        ...prev.ministry,
        leadershipMessages: [
          ...(prev.ministry.leadershipMessages || []),
          { id: Date.now().toString(), name: '', title: '', message: '', photoUrl: '' }
        ]
      }
    }));
  };

  const removeLeadershipMessage = (id: string) => {
    setSettings(prev => ({
      ...prev,
      ministry: {
        ...prev.ministry,
        leadershipMessages: (prev.ministry.leadershipMessages || []).filter(msg => msg.id !== id)
      }
    }));
  };

  const updateLeadershipField = (id: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      ministry: {
        ...prev.ministry,
        leadershipMessages: (prev.ministry.leadershipMessages || []).map(msg => 
          msg.id === id ? { ...msg, [field]: value } : msg
        )
      }
    }));
  };

  const handleLeadershipPhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await validateImage(file, { maxWidth: 3000, maxHeight: 3000 });
      const url = await uploadSettingImage(file, `leadership-photos/${id}`);
      setSettings(prev => ({
        ...prev,
        ministry: {
          ...prev.ministry,
          leadershipMessages: (prev.ministry.leadershipMessages || []).map(msg => 
            msg.id === id ? { ...msg, photoUrl: url } : msg
          )
        }
      }));
      toast.success('Leader photo uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Photo upload failed');
    }
  };

  // Helper functions for Key Officers management
  const addKeyOfficer = () => {
    setSettings(prev => ({
      ...prev,
      ministry: {
        ...prev.ministry,
        keyOfficers: [
          ...(prev.ministry.keyOfficers || []),
          { id: Date.now().toString(), name: '', position: '', contact: '', photoUrl: '' }
        ]
      }
    }));
  };

  const removeKeyOfficer = (id: string) => {
    setSettings(prev => ({
      ...prev,
      ministry: {
        ...prev.ministry,
        keyOfficers: (prev.ministry.keyOfficers || []).filter(o => o.id !== id)
      }
    }));
  };

  const updateOfficerField = (id: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      ministry: {
        ...prev.ministry,
        keyOfficers: (prev.ministry.keyOfficers || []).map(o => 
          o.id === id ? { ...o, [field]: value } : o
        )
      }
    }));
  };

  const handleOfficerPhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await validateImage(file, { maxWidth: 3000, maxHeight: 3000 });
      const url = await uploadSettingImage(file, `officer-photos/${id}`);
      setSettings(prev => ({
        ...prev,
        ministry: {
          ...prev.ministry,
          keyOfficers: (prev.ministry.keyOfficers || []).map(o => 
            o.id === id ? { ...o, photoUrl: url } : o
          )
        }
      }));
      toast.success('Officer photo uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Photo upload failed');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded w-full"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="gov-hero py-10 bg-primary text-primary-foreground relative">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Provincial Portal Settings</h1>
            <p className="opacity-90">Manage content for the public portal pages</p>
          </div>
          <Button asChild variant="secondary" className="w-fit">
            <Link to="/admin" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Settings Configuration</h2>
          <Button onClick={handleSave} disabled={isSaving} className="gov-btn-primary">
            {isSaving ? <span className="animate-spin mr-2">⏳</span> : <Save className="mr-2 h-4 w-4" />}
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto">
            <TabsTrigger value="home" className="py-2">Home Page</TabsTrigger>
            <TabsTrigger value="ministry" className="py-2">Ministry</TabsTrigger>
            <TabsTrigger value="province" className="py-2">Province</TabsTrigger>
            <TabsTrigger value="departments" className="py-2">Departments</TabsTrigger>
            <TabsTrigger value="system" className="py-2">System Settings</TabsTrigger>
          </TabsList>

          {/* HOME PAGE SETTINGS */}
          <TabsContent value="home" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section Images</CardTitle>
                <CardDescription>Upload background images for the main hero section carousel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {settings.heroImages.map((img) => (
                    <div key={img.id} className="relative group border rounded-md overflow-hidden aspect-video">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeHeroImage(img.id)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed rounded-md flex flex-col items-center justify-center aspect-video text-muted-foreground hover:bg-muted/50 transition-colors">
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm">Upload Image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageUpload} />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MINISTRY TAB SETTINGS */}
          <TabsContent value="ministry" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ministry Hero Section Image</CardTitle>
                <CardDescription>Upload background image for ministry page hero section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {settings.ministry.imageUrl ? (
                    <div className="relative group border rounded-md overflow-hidden aspect-square w-48">
                      <img src={settings.ministry.imageUrl} alt="Ministry hero" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setSettings(s => ({ ...s, ministry: { ...s.ministry, imageUrl: '' } }))}
                        className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-md flex flex-col items-center justify-center aspect-square w-48 text-muted-foreground hover:bg-muted/50 transition-colors">
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">Upload Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleMinistryImageUpload} />
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Ministry Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Start Date (for Years of Service calculation)</Label>
                  <Input
                    type="date"
                    value={settings.ministry.startDate.split('T')[0]}
                    onChange={(e) => {
                      const d = new Date(e.target.value);
                      if (!isNaN(d.getTime())) {
                        setSettings(s => ({ ...s, ministry: { ...s.ministry, startDate: d.toISOString() } }));
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    className="w-full min-h-[100px] border rounded-md p-2 text-sm bg-background"
                    value={settings.ministry.description}
                    onChange={(e) => setSettings(s => ({ ...s, ministry: { ...s.ministry, description: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vision</Label>
                  <Input
                    value={settings.ministry.vision}
                    onChange={(e) => setSettings(s => ({ ...s, ministry: { ...s.ministry, vision: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mission</Label>
                  <textarea
                    className="w-full min-h-[60px] border rounded-md p-2 text-sm bg-background"
                    value={settings.ministry.mission}
                    onChange={(e) => setSettings(s => ({ ...s, ministry: { ...s.ministry, mission: e.target.value } }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Leadership Messages Manager */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle>Leadership Messages</CardTitle>
                  <CardDescription>Manage messages from key leaders shown on the ministry page.</CardDescription>
                </div>
                <Button onClick={addLeadershipMessage} size="sm" className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Leader
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {(settings.ministry.leadershipMessages || []).length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <MessageSquare className="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No leadership messages configured. Default messages will be displayed.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(settings.ministry.leadershipMessages || []).map((msg, idx) => (
                      <div key={msg.id || idx} className="border p-5 rounded-lg bg-muted/20 space-y-4 relative group hover:border-primary/20 transition-colors">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeLeadershipMessage(msg.id)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid md:grid-cols-4 gap-6">
                          <div className="col-span-1 space-y-2">
                            <Label className="text-sm font-semibold">Photo</Label>
                            {msg.photoUrl ? (
                              <div className="relative rounded-lg overflow-hidden aspect-[3/4] w-full border shadow-sm">
                                <img src={msg.photoUrl} alt={msg.name || "Leader"} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => updateLeadershipField(msg.id, 'photoUrl', '')}
                                  className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-destructive-foreground rounded-md hover:bg-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed rounded-lg aspect-[3/4] flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
                                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-4 text-center">
                                  <Upload className="h-8 w-8 mb-2 text-primary" />
                                  <span className="text-xs font-medium">Upload Photo</span>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => handleLeadershipPhotoUpload(msg.id, e)} 
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                          
                          <div className="col-span-3 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label>Leader Name</Label>
                                <Input 
                                  value={msg.name} 
                                  placeholder="e.g., Hon. Governor Name"
                                  onChange={(e) => updateLeadershipField(msg.id, 'name', e.target.value)} 
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label>Title / Designation</Label>
                                <Input 
                                  value={msg.title} 
                                  placeholder="e.g., Governor of Sabaragamuwa"
                                  onChange={(e) => updateLeadershipField(msg.id, 'title', e.target.value)} 
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <Label>Message</Label>
                              <textarea
                                className="w-full min-h-[120px] border rounded-md p-3 text-sm bg-background"
                                placeholder="Enter message text here..."
                                value={msg.message}
                                onChange={(e) => updateLeadershipField(msg.id, 'message', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Officers Manager */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle>Key Officers</CardTitle>
                  <CardDescription>Manage key officers shown at the bottom of the ministry page.</CardDescription>
                </div>
                <Button onClick={addKeyOfficer} size="sm" className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Officer
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {(settings.ministry.keyOfficers || []).length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <User className="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No key officers configured. Default list will be displayed.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(settings.ministry.keyOfficers || []).map((o, idx) => (
                      <div key={o.id || idx} className="border p-5 rounded-lg bg-muted/20 space-y-4 relative group hover:border-primary/20 transition-colors">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeKeyOfficer(o.id)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid md:grid-cols-4 gap-6">
                          <div className="col-span-1 space-y-2">
                            <Label className="text-sm font-semibold">Photo</Label>
                            {o.photoUrl ? (
                              <div className="relative rounded-lg overflow-hidden aspect-square w-full border shadow-sm">
                                <img src={o.photoUrl} alt={o.name || "Officer"} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => updateOfficerField(o.id, 'photoUrl', '')}
                                  className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-destructive-foreground rounded-md hover:bg-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
                                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-4 text-center">
                                  <Upload className="h-8 w-8 mb-2 text-primary" />
                                  <span className="text-xs font-medium">Upload Photo</span>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => handleOfficerPhotoUpload(o.id, e)} 
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                          
                          <div className="col-span-3 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label>Officer Name</Label>
                                <Input 
                                  value={o.name} 
                                  placeholder="e.g., Secretary Name"
                                  onChange={(e) => updateOfficerField(o.id, 'name', e.target.value)} 
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label>Position / Designation</Label>
                                <Input 
                                  value={o.position} 
                                  placeholder="e.g., Provincial Secretary"
                                  onChange={(e) => updateOfficerField(o.id, 'position', e.target.value)} 
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <Label>Contact Details (Phone / Email)</Label>
                              <Input 
                                value={o.contact} 
                                placeholder="e.g., +94 45 2222 100 / secretary@sabaragamuwa.gov.lk"
                                onChange={(e) => updateOfficerField(o.id, 'contact', e.target.value)} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROVINCE TAB SETTINGS */}
          <TabsContent value="province" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Province Hero Section Image</CardTitle>
                <CardDescription>Upload background image for province page hero section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {settings.province.imageUrl ? (
                    <div className="relative group border rounded-md overflow-hidden aspect-square w-48">
                      <img src={settings.province.imageUrl} alt="Province hero" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setSettings(s => ({ ...s, province: { ...s.province, imageUrl: '' } }))}
                        className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-md flex flex-col items-center justify-center aspect-square w-48 text-muted-foreground hover:bg-muted/50 transition-colors">
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">Upload Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleProvinceImageUpload} />
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Province Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>General Description</Label>
                  <textarea
                    className="w-full min-h-[150px] border rounded-md p-2"
                    value={settings.province.details}
                    onChange={(e) => setSettings(s => ({ ...s, province: { ...s.province, details: e.target.value } }))}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Important Places & Attractions</CardTitle>
                <CardDescription>Manage the list of important places shown on the province page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.province.importantPlaces?.map((place, idx) => (
                  <div key={place.id || idx} className="grid md:grid-cols-3 gap-4 items-start border p-3 rounded-md">
                    <div className="col-span-1">
                      {place.imageUrl ? (
                        <div className="relative overflow-hidden rounded-md aspect-square w-32">
                          <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setSettings(s => ({
                              ...s,
                              province: {
                                ...s.province,
                                importantPlaces: s.province.importantPlaces.map(p => p.id === place.id ? { ...p, imageUrl: '' } : p)
                              }
                            }))}
                            className="absolute top-1 right-1 p-1 bg-destructive/90 text-destructive-foreground rounded opacity-0 hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-md flex items-center justify-center aspect-square w-32 text-muted-foreground">
                          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                            <Upload className="h-6 w-6 mb-1" />
                            <span className="text-xs">Upload</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  await validateImage(file, { maxWidth: 3000, maxHeight: 3000 });
                                  const url = await uploadSettingImage(file, `province-places/${place.id || Date.now().toString()}`);
                                  setSettings(s => ({
                                    ...s,
                                    province: {
                                      ...s.province,
                                      importantPlaces: s.province.importantPlaces.map(p => p === place || p.id === place.id ? { ...p, imageUrl: url } : p)
                                    }
                                  }));
                                  toast.success('Image uploaded');
                                } catch (err: any) {
                                  toast.error(err?.message || 'Upload failed');
                                }
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 space-y-2">
                      <input
                        className="w-full border rounded-md px-2 py-1"
                        placeholder="Place name"
                        value={place.name}
                        onChange={(e) => setSettings(s => ({
                          ...s,
                          province: {
                            ...s.province,
                            importantPlaces: s.province.importantPlaces.map(p => p.id === place.id ? { ...p, name: e.target.value } : p)
                          }
                        }))}
                      />
                      <textarea
                        className="w-full border rounded-md p-2"
                        placeholder="Short description"
                        value={place.description}
                        onChange={(e) => setSettings(s => ({
                          ...s,
                          province: {
                            ...s.province,
                            importantPlaces: s.province.importantPlaces.map(p => p.id === place.id ? { ...p, description: e.target.value } : p)
                          }
                        }))}
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setSettings(s => ({
                          ...s,
                          province: {
                            ...s.province,
                            importantPlaces: s.province.importantPlaces.filter(p => p.id !== place.id)
                          }
                        }))}>
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div>
                  <Button onClick={() => setSettings(s => ({
                    ...s,
                    province: {
                      ...s.province,
                      importantPlaces: [
                        ...(s.province.importantPlaces || []),
                        { id: Date.now().toString(), name: 'New Place', description: '', imageUrl: '' }
                      ]
                    }
                  }))}>
                    <Plus className="h-4 w-4 mr-2" /> Add Place
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DEPARTMENTS TAB SETTINGS */}
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Departments Tab Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    className="w-full min-h-[100px] border rounded-md p-2"
                    value={settings.departmentsTab.description}
                    onChange={(e) => setSettings(s => ({ ...s, departmentsTab: { ...s.departmentsTab, description: e.target.value } }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Per-Department Images</CardTitle>
                <CardDescription>Upload hero section background images for each department.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {['agriculture', 'land', 'animal', 'fisheries', 'irrigation'].map((deptId) => (
                  <div key={deptId} className="border p-4 rounded-md space-y-4 bg-muted/20">
                    <h3 className="font-semibold text-lg capitalize border-b pb-2">{deptId} Department</h3>
                    <div className="space-y-4">
                      {settings.departmentHeroImages?.[deptId] ? (
                        <div className="relative group border rounded-md overflow-hidden aspect-square w-48">
                          <img src={settings.departmentHeroImages[deptId]} alt={`${deptId} hero`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeDepartmentImage(deptId)}
                            className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-md flex flex-col items-center justify-center aspect-square w-48 text-muted-foreground hover:bg-muted/50 transition-colors">
                          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-sm">Upload Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDepartmentImageUpload(deptId, e)} />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SYSTEM SETTINGS TAB */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System & Visitor Counter Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings, such as public visitor counts and analytics display.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/10">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-visitor-enabled" className="text-base font-semibold">
                      Enable Visitor Counter
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Control whether visitors see the counter widget on any public dashboards.
                    </p>
                  </div>
                  <Switch
                    id="system-visitor-enabled"
                    checked={settings.visitorCount.enabled}
                    onCheckedChange={(checked) => 
                      setSettings(s => ({ 
                        ...s, 
                        visitorCount: { ...s.visitorCount, enabled: checked } 
                      }))
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border bg-background">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Visitor Metrics</CardTitle>
                      <CardDescription>View and manually adjust the counter value.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="system-visitor-count">Total Visitor Count</Label>
                        <Input
                          id="system-visitor-count"
                          type="number"
                          value={settings.visitorCount.count}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) {
                              setSettings(s => ({
                                ...s,
                                visitorCount: { ...s.visitorCount, count: val }
                              }));
                            }
                          }}
                          className="font-mono text-lg font-semibold animate-pulse-slow"
                        />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          This value increments automatically in the background on unique user visits. Administrators can override it here if needed.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border bg-background">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">System Health & Metadata</CardTitle>
                      <CardDescription>System telemetry and configuration state.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Database Sync Status:</span>
                        <span className="font-semibold text-green-600 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Connected
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Active Hero Images:</span>
                        <span className="font-semibold">{settings.heroImages.length}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Ministry Custom Officers:</span>
                        <span className="font-semibold">{settings.ministry.keyOfficers?.length || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </section>
    </Layout>
  );
}

