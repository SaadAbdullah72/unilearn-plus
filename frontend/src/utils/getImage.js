// Smart Image Assigner
export const getThumbnail = (title) => {
    const t = title.toLowerCase();
    
    // Keywords check karo aur image return karo
    if (t.includes('web') || t.includes('react') || t.includes('node')) 
        return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop";
    
    if (t.includes('python') || t.includes('data') || t.includes('ai') || t.includes('machine')) 
        return "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop";
    
    if (t.includes('cyber') || t.includes('security') || t.includes('hack')) 
        return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop";

    if (t.includes('marketing') || t.includes('seo') || t.includes('business')) 
        return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop";

    if (t.includes('design') || t.includes('graphic') || t.includes('art')) 
        return "https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=600&auto=format&fit=crop";

    if (t.includes('game') || t.includes('unity')) 
        return "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop";

    if (t.includes('robot') || t.includes('hardware')) 
        return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop";

    // Default Fallback
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop";
};