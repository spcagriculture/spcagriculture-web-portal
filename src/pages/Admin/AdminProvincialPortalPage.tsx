import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPortalSettings, updatePortalSettings, uploadSettingImage, validateImage, PortalSettings, defaultSettings } from '@/integrations/firebase/portalSettings';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, Upload, Trash2, Plus } from 'lucide-react';

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
      <section className="gov-hero py-10 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Provincial Portal Settings</h1>
          <p className="opacity-90">Manage content for the public portal pages</p>
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
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full h-auto">
            <TabsTrigger value="home" className="py-2">Home Page</TabsTrigger>
            <TabsTrigger value="ministry" className="py-2">Ministry</TabsTrigger>
            <TabsTrigger value="province" className="py-2">Province</TabsTrigger>
            <TabsTrigger value="departments" className="py-2">Departments</TabsTrigger>
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

            

            <Card>
              <CardHeader>
                <CardTitle>Visitor Count</CardTitle>
                <CardDescription>Visitor count from Firebase analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="visitor-enabled"
                    checked={settings.visitorCount.enabled}
                    onChange={(e) => setSettings(s => ({ ...s, visitorCount: { ...s.visitorCount, enabled: e.target.checked } }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="visitor-enabled">Show Visitor Count</Label>
                </div>
                {settings.visitorCount.enabled && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitor-count">Current Count (Read-only from Firebase)</Label>
                      <Input
                        id="visitor-count"
                        type="number"
                        value={settings.visitorCount.count}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">This value is automatically updated from Firebase analytics</p>
                    </div>
                  </div>
                )}
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
                    className="w-full min-h-[100px] border rounded-md p-2"
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
                    className="w-full min-h-[60px] border rounded-md p-2"
                    value={settings.ministry.mission}
                    onChange={(e) => setSettings(s => ({ ...s, ministry: { ...s.ministry, mission: e.target.value } }))}
                  />
                </div>
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

        </Tabs>
      </section>
    </Layout>
  );
}
