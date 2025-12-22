import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MapPin, Phone, Globe, Check, Star, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import accommodationData from "@/data/accommodation-full.json";

export default function Accommodation() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/accommodation-hero.jpg" 
            alt="Witta Accommodation Landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-sm font-medium tracking-wider mb-6">
              CURATED COLLECTION
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
              Hinterland Stays
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the magic of Witta and Maleny with our hand-picked selection of premium local accommodation providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white border-none" onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}>
                View Featured Stays
              </Button>
              <Link href="/accommodation/directory">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/50 text-white hover:bg-white hover:text-primary">
                  Browse Full Directory
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Accommodation Grid */}
      <section id="featured" className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Featured Properties</h2>
            <p className="text-muted-foreground text-lg">
              Our top recommendations for an unforgettable stay in the Sunshine Coast Hinterland.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {accommodationData.featured.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:shadow-2xl transition-all duration-500 group bg-card">
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={place.image} 
                      alt={place.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground font-bold shadow-sm">
                        {place.type}
                      </Badge>
                      <Badge variant="default" className="bg-primary/90 backdrop-blur-sm text-white font-bold shadow-sm">
                        {place.priceRange}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-serif text-2xl font-bold drop-shadow-md">{place.name}</h3>
                    </div>
                  </div>
                  
                  <CardContent className="flex-grow space-y-6 p-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Users className="h-4 w-4" /> 
                      <span>Best for: {place.audience}</span>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {place.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="h-px bg-border/50 w-full" />
                      <ul className="grid grid-cols-2 gap-3">
                        {place.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-secondary flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-muted/30 p-6 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground w-full sm:w-auto">
                      {place.contact.phone && (
                        <div className="flex items-center gap-2 hover:text-primary transition-colors">
                          <Phone className="h-4 w-4" />
                          <span>{place.contact.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-md group-hover:translate-x-1 transition-transform">
                      <a href={place.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Directory Teaser */}
      <section className="py-24 bg-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/images/swot-bg-texture.jpg')] bg-cover bg-center mix-blend-overlay" />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Looking for More Options?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            We have compiled a comprehensive directory of all accommodation providers in the Witta and Maleny area. 
            Find the perfect spot that suits your specific needs and budget.
          </p>
          <Link href="/accommodation/directory">
            <Button size="lg" className="h-14 px-8 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              View Full Accommodation Directory <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
