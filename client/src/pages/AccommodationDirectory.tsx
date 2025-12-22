import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, ExternalLink, MapPin, ArrowLeft, List, Map as MapIcon } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo, useRef, useEffect } from "react";
import accommodationData from "@/data/accommodation-full.json";
import { MapView } from "@/components/Map";
import { GalleryDialog } from "@/components/GalleryDialog";

export default function AccommodationDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  // Combine featured and directory listings for the full list
  const allListings = useMemo(() => [
    ...accommodationData.featured.map(item => ({ ...item, isFeatured: true, location: "Witta" })),
    ...accommodationData.directory.map(item => ({ ...item, isFeatured: false }))
  ].sort((a, b) => a.name.localeCompare(b.name)), []);

  const filteredListings = useMemo(() => allListings.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [allListings, searchTerm]);

  // Calculate map center based on filtered listings or default to Witta
  const mapCenter = useMemo(() => {
    if (filteredListings.length > 0 && filteredListings[0].coordinates) {
      return filteredListings[0].coordinates;
    }
    return { lat: -26.7083, lng: 152.8417 }; // Default Witta coordinates
  }, [filteredListings]);

  // Update markers when filtered listings change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    // Add new markers
    filteredListings.forEach(item => {
      if (item.coordinates) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position: item.coordinates,
          title: item.name,
        });
        
        // Add click listener to show info window
        marker.addListener("click", () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${item.name}</h3>
                <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${item.type}</p>
                ${item.contact?.website ? `<a href="${item.contact.website}" target="_blank" style="color: #0066cc; text-decoration: none; font-size: 12px;">Visit Website &rarr;</a>` : ''}
              </div>
            `,
          });
          infoWindow.open({
            anchor: marker,
            map: mapRef.current,
          });
        });

        markersRef.current.push(marker);
      }
    });
  }, [filteredListings, viewMode]);

  // Update map center when it changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter(mapCenter);
    }
  }, [mapCenter]);

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img 
            src="/images/accommodation/directory-hero.jpg" 
            alt="Background" 
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="container relative z-10">
          <Link href="/accommodation">
            <Button variant="link" className="text-white/80 hover:text-white p-0 mb-6 h-auto flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Featured Stays
            </Button>
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Accommodation Directory</h1>
          <p className="text-xl text-white/80 max-w-2xl font-light">
            A complete list of places to stay in Witta, Maleny, and the surrounding hinterland.
          </p>
        </div>
      </section>

      {/* Directory Section */}
      <section className="py-16 bg-background min-h-screen">
        <div className="container">
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, type, or location..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground hidden md:block">
                Showing <strong>{filteredListings.length}</strong> properties
              </div>
              <div className="flex bg-muted p-1 rounded-md">
                <Button 
                  variant={viewMode === "list" ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="h-4 w-4" /> List
                </Button>
                <Button 
                  variant={viewMode === "map" ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setViewMode("map")}
                  className="gap-2"
                >
                  <MapIcon className="h-4 w-4" /> Map
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {viewMode === "list" ? (
            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[300px]">Property Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.map((place) => (
                    <TableRow key={place.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="text-base font-serif font-bold text-primary group-hover:text-primary/80 transition-colors">
                            {place.name}
                          </span>
                          {place.isFeatured && (
                            <Badge variant="secondary" className="w-fit text-[10px] px-2 py-0 h-5">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                          {place.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {place.location || "Witta Area"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm max-w-md truncate">
                        {place.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* @ts-ignore */}
                          {place.images && place.images.length > 0 && (
                            // @ts-ignore
                            <GalleryDialog images={place.images} title={place.name} />
                          )}
                          {place.contact?.website ? (
                            <Button size="sm" variant="ghost" asChild className="hover:bg-primary hover:text-white transition-colors">
                              <a href={place.contact.website} target="_blank" rel="noopener noreferrer">
                                Visit <ExternalLink className="ml-2 h-3 w-3" />
                              </a>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground italic px-3">No website</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredListings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No results found for "{searchTerm}". Try a different search term.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-[600px] rounded-lg border border-border shadow-sm overflow-hidden relative">
              <MapView 
                initialCenter={mapCenter}
                initialZoom={13}
                onMapReady={(map) => {
                  mapRef.current = map;
                  // Trigger marker creation for initial load
                  filteredListings.forEach(item => {
                    if (item.coordinates) {
                      const marker = new google.maps.marker.AdvancedMarkerElement({
                        map: map,
                        position: item.coordinates,
                        title: item.name,
                      });
                      
                      marker.addListener("click", () => {
                        const infoWindow = new google.maps.InfoWindow({
                          content: `
                            <div style="padding: 8px; max-width: 200px;">
                              <h3 style="font-weight: bold; margin-bottom: 4px;">${item.name}</h3>
                              <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${item.type}</p>
                              ${item.contact?.website ? `<a href="${item.contact.website}" target="_blank" style="color: #0066cc; text-decoration: none; font-size: 12px;">Visit Website &rarr;</a>` : ''}
                            </div>
                          `,
                        });
                        infoWindow.open({
                          anchor: marker,
                          map: map,
                        });
                      });

                      markersRef.current.push(marker);
                    }
                  });
                }}
                className="h-full w-full"
              />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
