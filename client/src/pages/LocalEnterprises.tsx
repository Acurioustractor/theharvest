import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Phone, Mail, Globe, ExternalLink, Facebook, Instagram, Calendar, Clock, Loader2 } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import enterpriseData from "@/data/enterprises.json";
import staticEventsData from "@/data/events.json";
import { EventSubmissionDialog } from "@/components/EventSubmissionDialog";
import BusinessRegistrationDialog from "@/components/BusinessRegistrationDialog";
import { trpc } from "@/lib/trpc";

// Category images mapping
const categoryImages: Record<string, string> = {
  "Markets & Retail": "/assets/images/category-market.jpg",
  "Arts & Crafts": "/assets/images/category-arts.jpg",
  "Accommodation": "/images/accommodation/directory-hero.jpg",
  "Services & Trades": "/assets/images/category-services.jpg",
  "Community & Sports": "/assets/images/category-community.jpg",
  "Local Business": "/assets/images/enterprises-hero.jpg"
};

// Category image mapping for events
const eventCategoryImages: Record<string, string> = {
  market: "/assets/images/category-market.jpg",
  community: "/assets/images/category-community.jpg",
  arts: "/assets/images/category-arts.jpg",
  workshop: "/assets/images/category-services.jpg",
  music: "/assets/images/enterprises-hero.jpg",
};

export default function LocalEnterprises() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch approved events from API
  const { data: apiEvents, isLoading: eventsLoading, refetch: refetchEvents } = trpc.events.list.useQuery();

  const categories = Array.from(new Set(enterpriseData.enterprises.map(e => e.category)));

  const filteredEnterprises = enterpriseData.enterprises.filter(enterprise => {
    const matchesSearch = enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          enterprise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? enterprise.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Combine API events with static events, prioritizing API events
  const allEvents = useMemo(() => {
    const now = new Date('2025-12-01');
    
    // Transform API events
    const transformedApiEvents = (apiEvents || []).map(event => ({
      id: `api-${event.id}`,
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      location: event.location,
      category: event.category.charAt(0).toUpperCase() + event.category.slice(1),
      description: event.description,
      image: eventCategoryImages[event.category] || "/assets/images/enterprises-hero.jpg",
      isFromApi: true,
    }));

    // Filter static events
    const staticEvents = staticEventsData.events
      .filter(e => new Date(e.date) >= now)
      .map(e => ({ ...e, isFromApi: false }));

    // Combine and sort by date
    return [...transformedApiEvents, ...staticEvents]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [apiEvents]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LazyImage
            src="/assets/images/enterprises-hero.jpg"
            alt="Community gathering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">
            Local Enterprises
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90 font-light">
            Celebrating the heartbeat of our community. Discover the businesses, artisans, and creators that make Witta and Maleny unique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <BusinessRegistrationDialog
              trigger={
                <Button size="lg" className="bg-[#c17c54] hover:bg-[#a06543] text-white border-none">
                  Join The Harvest
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-[#f8f5f2]">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                className="pl-10 bg-white border-[#e0e0e0]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-[#2c4c3b] text-white" : "border-[#2c4c3b] text-[#2c4c3b]"}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-[#2c4c3b] text-white" : "border-[#2c4c3b] text-[#2c4c3b]"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnterprises.map((enterprise) => (
              <Card key={enterprise.id} className="flex flex-col h-full border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <LazyImage
                    src={enterprise.image || categoryImages[enterprise.category] || "/assets/images/enterprises-hero.jpg"}
                    alt={enterprise.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="font-serif text-xl text-[#2c4c3b]">{enterprise.name}</CardTitle>
                    <Badge variant="secondary" className="bg-[#2c4c3b]/10 text-[#2c4c3b] shrink-0">
                      {enterprise.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {enterprise.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  {((enterprise as any).location || (enterprise as any).address) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#c17c54] shrink-0" />
                      <span className="truncate">{(enterprise as any).location || (enterprise as any).address}</span>
                    </div>
                  )}
                  {enterprise.contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#c17c54] shrink-0" />
                      <span>{enterprise.contact.phone}</span>
                    </div>
                  )}
                  {enterprise.contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#c17c54] shrink-0" />
                      <span className="truncate">{enterprise.contact.email}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="mt-auto pt-4 flex gap-2">
                  {enterprise.contact.website && (
                    <Button asChild variant="outline" className="flex-1 border-[#2c4c3b] text-[#2c4c3b] hover:bg-[#2c4c3b] hover:text-white">
                      <a href={enterprise.contact.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                  {enterprise.contact.facebook && (
                    <Button asChild size="icon" variant="outline" className="border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white">
                      <a href={enterprise.contact.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {enterprise.contact.instagram && (
                    <Button asChild size="icon" variant="outline" className="border-[#E4405F] text-[#E4405F] hover:bg-[#E4405F] hover:text-white">
                      <a href={enterprise.contact.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredEnterprises.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No businesses found matching your search.</p>
              <Button 
                variant="link" 
                onClick={() => {setSearchTerm(""); setSelectedCategory(null);}}
                className="mt-2 text-[#c17c54]"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Community Events Section */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2c4c3b] mb-4">Community Events</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Connect with your neighbors and celebrate local culture at these upcoming gatherings.
              </p>
            </div>
            <EventSubmissionDialog onEventSubmitted={() => refetchEvents()} />
          </div>

          {eventsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#2c4c3b]" />
              <span className="ml-3 text-muted-foreground">Loading events...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((event) => (
                <Card key={event.id} className="flex flex-col h-full border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden relative">
                    <LazyImage
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 text-[#2c4c3b] px-3 py-1 rounded-md font-bold text-center shadow-sm">
                      <div className="text-xs uppercase tracking-wider">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                      <div className="text-xl leading-none">{new Date(event.date).getDate()}</div>
                    </div>
                    <Badge className="absolute top-4 right-4 bg-[#c17c54] hover:bg-[#a06543]">
                      {event.category}
                    </Badge>
                    {event.isFromApi && (
                      <Badge className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-xs">
                        Community Submitted
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl text-[#2c4c3b]">{event.title}</CardTitle>
                    <div className="flex flex-col gap-2 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#c17c54]" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#c17c54]" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {event.description}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto pt-0">
                    <Button variant="outline" className="w-full border-[#2c4c3b] text-[#2c4c3b] hover:bg-[#2c4c3b] hover:text-white">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!eventsLoading && allEvents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No upcoming events at the moment.</p>
              <p className="text-sm text-muted-foreground mt-2">Be the first to submit an event!</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#2c4c3b] text-white text-center">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Be Part of The Harvest</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-white/80">
            Are you a local business owner, artisan, or grower? Join our network to connect with the community and grow together.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-[#2c4c3b] hover:bg-gray-100">
            Register Your Business
          </Button>
        </div>
      </section>
    </Layout>
  );
}
